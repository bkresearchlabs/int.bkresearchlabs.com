import fs from 'fs';
import path from 'path';

interface DiagnosticIssue {
  file: string;
  component: string;
  line: number;
  type: 'missing_useTranslation' | 'hardcoded_jsx_text' | 'hardcoded_prop' | 'unregistered_key';
  content: string;
  context?: string;
}

const SRC_DIR = path.resolve(process.cwd(), 'src');

function getAllFiles(dir: string, ext = '.tsx'): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        results = results.concat(getAllFiles(filePath, ext));
      }
    } else if (file.endsWith(ext) || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

function runDiagnostics() {
  console.log('🔬 BK Research Labs — Comprehensive i18n & Component Translation Diagnostic');
  console.log('========================================================================\n');

  const files = getAllFiles(SRC_DIR, '.tsx');
  const issues: DiagnosticIssue[] = [];
  const componentReport: Record<string, { usesHook: boolean; hardcodedTexts: string[]; usesT: boolean }> = {};

  const IGNORED_STRINGS = new Set([
    '', ' ', '•', '-', '+', '/', '|', '$', '€', '£', '¥', ':', '%', '×', '—', '–',
    'ISO-17025', 'HPLC', 'CAS', 'SKU', 'BKRL', 'COA', 'CoA', 'API', 'UI', 'QR', 'iOS', 'Android', 'Web',
    'PNG', 'JPG', 'PDF', 'CSV', 'JSON', 'SMTP', 'SMS', 'URL', 'SSL', 'TLS', '256-bit', 'v1.0', 'v2.0'
  ]);

  files.forEach((file) => {
    const relPath = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    const componentName = path.basename(file, '.tsx');
    const usesHook = content.includes('useTranslation') || content.includes('useLanguage') || content.includes('LanguageContext');
    const usesT = content.includes('t(') || content.includes('translateProduct') || content.includes('getTranslation');

    componentReport[relPath] = {
      usesHook,
      usesT,
      hardcodedTexts: []
    };

    // Check for hardcoded JSX text nodes
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();

      // Skip comments, imports, svg paths, classNames, styles
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ') || trimmed.startsWith('export type')) {
        return;
      }

      // Regex for finding raw text in JSX tags: >Raw Text<
      const jsxTextRegex = />\s*([A-Za-z0-9][A-Za-z0-9\s,.'":?!/()\-+%$#&;]{2,})\s*</g;
      let match;
      while ((match = jsxTextRegex.exec(trimmed)) !== null) {
        const text = match[1].trim();
        // Ignore code/JS expressions like {var}, curly braces, tailwind icons, purely numeric or single symbol
        if (text.startsWith('{') || text.endsWith('}') || IGNORED_STRINGS.has(text) || /^[\d\s.,:/#\-+%$]+$/.test(text)) {
          continue;
        }

        // If line contains t(text) or t('...', ignore
        if (trimmed.includes(`t('${text}')`) || trimmed.includes(`t("${text}")`) || trimmed.includes(`t(\`${text}\`)`)) {
          continue;
        }

        issues.push({
          file: relPath,
          component: componentName,
          line: lineNum,
          type: 'hardcoded_jsx_text',
          content: text,
          context: trimmed.slice(0, 100)
        });
        componentReport[relPath].hardcodedTexts.push(`L${lineNum}: "${text}"`);
      }

      // Check for placeholder="..." without t()
      const placeholderRegex = /placeholder=["']([^"']{3,})["']/g;
      while ((match = placeholderRegex.exec(trimmed)) !== null) {
        const pText = match[1].trim();
        if (!trimmed.includes(`t(`)) {
          issues.push({
            file: relPath,
            component: componentName,
            line: lineNum,
            type: 'hardcoded_prop',
            content: `placeholder="${pText}"`,
            context: trimmed.slice(0, 100)
          });
        }
      }

      // Check for title="..." without t()
      const titleRegex = /title=["']([^"']{3,})["']/g;
      while ((match = titleRegex.exec(trimmed)) !== null) {
        const tText = match[1].trim();
        if (!trimmed.includes(`t(`) && !tText.startsWith('http') && !tText.includes('{')) {
          issues.push({
            file: relPath,
            component: componentName,
            line: lineNum,
            type: 'hardcoded_prop',
            content: `title="${tText}"`,
            context: trimmed.slice(0, 100)
          });
        }
      }
    });
  });

  // Group by component
  console.log('📊 COMPONENT AUDIT BREAKDOWN:');
  console.log('------------------------------------------------------------------------');
  
  let hookMissingCount = 0;
  let hardcodedCount = 0;

  Object.entries(componentReport).forEach(([file, rep]) => {
    const isStoreOrCustomerOrCheckout = file.includes('src/components/store') ||
                                       file.includes('src/components/checkout') ||
                                       file.includes('src/components/customer') ||
                                       file.includes('src/components/common') ||
                                       file === 'src/App.tsx';

    const statusBadge = rep.usesHook ? '✅ uses LanguageProvider' : '⚠️ missing useTranslation hook';
    if (!rep.usesHook && isStoreOrCustomerOrCheckout) hookMissingCount++;

    if (rep.hardcodedTexts.length > 0) {
      hardcodedCount += rep.hardcodedTexts.length;
      console.log(`\n📁 ${file} [${statusBadge}] — ${rep.hardcodedTexts.length} untranslated text nodes:`);
      rep.hardcodedTexts.slice(0, 8).forEach(t => console.log(`   🔸 ${t}`));
      if (rep.hardcodedTexts.length > 8) {
        console.log(`   ...and ${rep.hardcodedTexts.length - 8} more`);
      }
    } else {
      console.log(`\n📁 ${file} [${statusBadge}] — ✨ 100% localized (0 raw text nodes)`);
    }
  });

  console.log('\n========================================================================');
  console.log(`📈 DIAGNOSTIC SUMMARY:`);
  console.log(`   • Total React Components Scanned: ${files.length}`);
  console.log(`   • Total Raw/Hardcoded Text Node Issues: ${hardcodedCount}`);
  console.log(`   • Components Requiring LanguageProvider Integration: ${hookMissingCount}`);
  console.log('========================================================================\n');
}

runDiagnostics();
