/**
 * Office Formula Evaluator for BK Research Labs Spreadsheet Tool
 * Evaluates Excel/Google Sheets style formulas:
 * =SUM(A1:A10), =AVG(B1:B5), =AVERAGE(C1:C8), =MIN(A1:A5), =MAX(A1:A5),
 * =COUNT(A1:A20), =PRODUCT(A1:A3), =ROUND(A1*B1, 2), =A1+B1, =A1*B1, etc.
 */

// Helper to convert column letter to index (A -> 0, B -> 1, ..., Z -> 25)
export function colLetterToIndex(col: string): number {
  let result = 0;
  const upper = col.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    result = result * 26 + (upper.charCodeAt(i) - 64);
  }
  return result - 1;
}

// Helper to convert column index to letter (0 -> A, 1 -> B, 25 -> Z)
export function indexToColLetter(index: number): string {
  let temp = index;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

// Parse range "A1:A5" or "B2:D6" into array of coordinate keys ["A1", "A2", ...]
export function parseRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':').map(s => s.trim().toUpperCase());
  if (parts.length === 1) return [parts[0]];
  if (parts.length !== 2) return [];

  const startMatch = parts[0].match(/^([A-Z]+)(\d+)$/);
  const endMatch = parts[1].match(/^([A-Z]+)(\d+)$/);

  if (!startMatch || !endMatch) return [];

  const startCol = colLetterToIndex(startMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endCol = colLetterToIndex(endMatch[1]);
  const endRow = parseInt(endMatch[2], 10);

  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);

  const coords: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      coords.push(`${indexToColLetter(c)}${r}`);
    }
  }
  return coords;
}

// Extract numeric value from a cell
function getNumericValue(coord: string, cells: Record<string, { value: string; computed?: string | number }>): number {
  const cell = cells[coord];
  if (!cell) return 0;
  const raw = cell.computed !== undefined ? cell.computed : cell.value;
  if (typeof raw === 'number') return isNaN(raw) ? 0 : raw;
  const cleaned = String(raw).replace(/[\$,%]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Primary evaluator function
export function evaluateFormula(
  formula: string,
  cells: Record<string, { value: string; computed?: string | number }>,
  currentCoord: string,
  visited: Set<string> = new Set()
): string | number {
  if (!formula.startsWith('=')) {
    return formula;
  }

  // Circular reference detection
  if (visited.has(currentCoord)) {
    return '#CIRCULAR!';
  }
  visited.add(currentCoord);

  const expression = formula.substring(1).trim();

  // Function matches: FUNCTION(PARAMS)
  const fnMatch = expression.match(/^([A-Z]+)\((.*)\)$/i);
  if (fnMatch) {
    const fnName = fnMatch[1].toUpperCase();
    const argsStr = fnMatch[2].trim();

    // Split args respecting ranges or commas
    const rawArgs = argsStr.split(',').map(a => a.trim());
    let numbers: number[] = [];

    rawArgs.forEach(arg => {
      if (arg.includes(':')) {
        const rangeCoords = parseRange(arg);
        rangeCoords.forEach(coord => {
          if (coord !== currentCoord) {
            numbers.push(getNumericValue(coord, cells));
          }
        });
      } else if (/^[A-Z]+\d+$/i.test(arg)) {
        numbers.push(getNumericValue(arg.toUpperCase(), cells));
      } else {
        const val = parseFloat(arg);
        if (!isNaN(val)) numbers.push(val);
      }
    });

    switch (fnName) {
      case 'SUM':
        return numbers.reduce((acc, n) => acc + n, 0);

      case 'AVERAGE':
      case 'AVG':
        if (numbers.length === 0) return 0;
        return Number((numbers.reduce((acc, n) => acc + n, 0) / numbers.length).toFixed(4));

      case 'MIN':
        if (numbers.length === 0) return 0;
        return Math.min(...numbers);

      case 'MAX':
        if (numbers.length === 0) return 0;
        return Math.max(...numbers);

      case 'COUNT':
        return numbers.length;

      case 'PRODUCT':
      case 'MULTIPLY':
        if (numbers.length === 0) return 0;
        return numbers.reduce((acc, n) => acc * n, 1);

      case 'ROUND':
        if (numbers.length === 0) return 0;
        const decimals = rawArgs.length > 1 ? parseInt(rawArgs[1], 10) : 0;
        return Number(numbers[0].toFixed(isNaN(decimals) ? 0 : decimals));

      case 'IF':
        // Basic =IF(A1>50, 100, 0)
        try {
          const parts = argsStr.split(',').map(p => p.trim());
          if (parts.length >= 3) {
            // Replace cell references in condition
            let condition = parts[0].replace(/([A-Z]+\d+)/gi, match => {
              return String(getNumericValue(match.toUpperCase(), cells));
            });
            // Safe evaluation of simple comparison
            const isTrue = Function(`"use strict"; return (${condition})`)();
            return isTrue ? parts[1].replace(/['"]/g, '') : parts[2].replace(/['"]/g, '');
          }
        } catch {
          return '#VALUE!';
        }
        break;

      default:
        break;
    }
  }

  // Arithmetic math evaluation: =A1+B1, =A1*B1-C1/2
  try {
    const mathExpression = expression.replace(/([A-Z]+\d+)/gi, match => {
      const val = getNumericValue(match.toUpperCase(), cells);
      return String(val);
    });

    // Only allow safe math characters
    if (/^[0-9+\-*/().\s]+$/.test(mathExpression)) {
      // Evaluate basic arithmetic
      const result = Function(`"use strict"; return (${mathExpression})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        return Number.isInteger(result) ? result : Number(result.toFixed(4));
      }
    }
  } catch {
    return '#ERROR!';
  }

  return expression;
}

// Format a number according to format choice
export function formatCellValue(
  value: string | number,
  format: 'text' | 'number' | 'currency' | 'percent' | 'scientific' | 'date' = 'text'
): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string' && isNaN(Number(value))) return value;

  const num = typeof value === 'number' ? value : Number(value);

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    case 'percent':
      return `${(num * (num <= 1 && num >= -1 ? 100 : 1)).toFixed(2)}%`;
    case 'scientific':
      return num.toExponential(3);
    case 'number':
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(num);
    default:
      return String(value);
  }
}
