import fs from 'fs';
import path from 'path';

interface AuditResult {
  tCalls: { file: string; line: number; key: string }[];
  potentialHardcodedText: { file: string; line: number; text: string }[];
  missingKeys: { key: string; files: string[]; sampleLine: number }[];
  coverageStats: {
    totalTCalls: number;
    uniqueKeys: number;
    keysWithEnglishTranslation: number;
    keysWithArabicTranslation: number;
    keysWithSpanishTranslation: number;
    keysWithFrenchTranslation: number;
    keysWithGermanTranslation: number;
  };
}

// Recursively get all .ts and .tsx files in src
function getFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        getFiles(fullPath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function runAudit(): AuditResult {
  const rootDir = process.cwd();
  const srcDir = path.join(rootDir, 'src');
  const files = getFiles(srcDir);

  // Read i18n file to extract defined keys and phrases
  const i18nPath = path.join(srcDir, 'lib', 'i18n.ts');
  const i18nContent = fs.readFileSync(i18nPath, 'utf-8');

  // We can load translations via dynamic import or regex parsing
  const tCalls: { file: string; line: number; key: string }[] = [];
  const potentialHardcodedText: { file: string; line: number; text: string }[] = [];

  // Match t('key') or t("key") or t(`key`)
  const tCallRegex = /\bt\(\s*(['"`])((?:\\.|[^\\])*?)\1/g;

  // Simple JSX text matcher: >Some text here<
  const jsxTextRegex = />\s*([A-Za-z0-9][A-Za-z0-9\s.,!?:;'"()-]{3,80})\s*</g;

  for (const filePath of files) {
    // Skip i18n definition files and test files
    if (filePath.includes('i18n.ts') || filePath.includes('translationsData.ts')) {
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(rootDir, filePath);
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;

      // Extract t() calls
      let match: RegExpExecArray | null;
      tCallRegex.lastIndex = 0;
      while ((match = tCallRegex.exec(line)) !== null) {
        const key = match[2].trim();
        if (key && !key.startsWith('$')) {
          tCalls.push({ file: relativePath, line: lineNum, key });
        }
      }

      // Check for hardcoded JSX text if the file is a TSX component
      if (filePath.endsWith('.tsx')) {
        // Exclude commented lines, console logs, svg paths, classNames, and imports
        const trimmed = line.trim();
        if (
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('/*') &&
          !trimmed.startsWith('*') &&
          !trimmed.includes('console.') &&
          !trimmed.includes('import ') &&
          !trimmed.includes('className=') &&
          !trimmed.includes('style=')
        ) {
          jsxTextRegex.lastIndex = 0;
          let jsxMatch: RegExpExecArray | null;
          while ((jsxMatch = jsxTextRegex.exec(line)) !== null) {
            const rawText = jsxMatch[1].trim();
            // Filter out purely numeric, symbols, template expressions, or common HTML artifacts
            if (
              rawText.length > 2 &&
              !rawText.startsWith('{') &&
              !rawText.endsWith('}') &&
              !/^[0-9\s.,$%#@!&*()_+\-=[\]{}|;':",.<>?/]+$/.test(rawText) &&
              !['div', 'span', 'p', 'button', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'true', 'false', 'null', 'undefined'].includes(rawText.toLowerCase())
            ) {
              potentialHardcodedText.push({ file: relativePath, line: lineNum, text: rawText });
            }
          }
        }
      }
    });
  }

  // Extract keys from i18n
  const uniqueTKeys = Array.from(new Set(tCalls.map(c => c.key)));
  const missingKeys: { key: string; files: string[]; sampleLine: number }[] = [];

  for (const key of uniqueTKeys) {
    // Check if key or lowercase key exists in i18n
    const keyLower = key.toLowerCase();
    const hasKey =
      i18nContent.includes(`'${key}'`) ||
      i18nContent.includes(`"${key}"`) ||
      i18nContent.includes(`'${keyLower}'`) ||
      i18nContent.includes(`"${keyLower}"`);

    if (!hasKey) {
      const occurrences = tCalls.filter(c => c.key === key);
      missingKeys.push({
        key,
        files: Array.from(new Set(occurrences.map(o => o.file))),
        sampleLine: occurrences[0].line
      });
    }
  }

  const result: AuditResult = {
    tCalls,
    potentialHardcodedText,
    missingKeys,
    coverageStats: {
      totalTCalls: tCalls.length,
      uniqueKeys: uniqueTKeys.length,
      keysWithEnglishTranslation: uniqueTKeys.length - missingKeys.length,
      keysWithArabicTranslation: 0,
      keysWithSpanishTranslation: 0,
      keysWithFrenchTranslation: 0,
      keysWithGermanTranslation: 0,
    }
  };

  return result;
}

// Run CLI
if (process.argv[1] && process.argv[1].endsWith('audit-i18n.ts')) {
  console.log('🔍 Running BK Research Labs i18n Audit & Crawler...\n');
  const audit = runAudit();

  console.log('====================================================');
  console.log(`📊 Total t() calls detected: ${audit.tCalls.length}`);
  console.log(`🔑 Unique translation keys/phrases: ${audit.coverageStats.uniqueKeys}`);
  console.log(`⚠️  Missing/Unregistered keys: ${audit.missingKeys.length}`);
  console.log(`📝 Potential hardcoded JSX text entries: ${audit.potentialHardcodedText.length}`);
  console.log('====================================================\n');

  if (audit.missingKeys.length > 0) {
    console.log('❌ MISSING TRANSLATION KEYS FOUND:');
    audit.missingKeys.forEach((m, idx) => {
      console.log(`  ${idx + 1}. "${m.key}"`);
      console.log(`     Used in: ${m.files.join(', ')} (line ${m.sampleLine})`);
    });
    console.log('\n');
  } else {
    console.log('✅ All t() calls match registered dictionary keys or product/category catalog entries!\n');
  }

  if (audit.potentialHardcodedText.length > 0) {
    console.log(`🔍 Top 15 Potential Hardcoded JSX Strings:`);
    audit.potentialHardcodedText.slice(0, 15).forEach((h, idx) => {
      console.log(`  ${idx + 1}. "${h.text}" (${h.file}:${h.line})`);
    });
    console.log('\n');
  }
}
