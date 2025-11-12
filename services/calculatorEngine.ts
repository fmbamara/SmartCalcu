
/**
 * Evaluates a mathematical expression string.
 * This uses the Function constructor, which is safer than `eval()` because it doesn't
 * have access to the surrounding scope. It's a pragmatic way to implement a calculator
 * for this context without writing a full-blown parser.
 * It handles basic arithmetic, precedence, and parentheses.
 * 
 * @param expression The mathematical expression to evaluate.
 * @returns The result of the calculation or an error message string.
 */
export const evaluateExpression = (expression: string): string => {
  if (!expression) return '0';

  try {
    // Sanitize and prepare the expression
    let sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/--/g, '+')
      .replace(/\+-/g, '-')
      .replace(/\^/g, '**');

    // Handle scientific functions
    sanitized = sanitized.replace(/sin\(([^)]+)\)/g, (_, val) => `Math.sin((${val}) * Math.PI / 180)`);
    sanitized = sanitized.replace(/cos\(([^)]+)\)/g, (_, val) => `Math.cos((${val}) * Math.PI / 180)`);
    sanitized = sanitized.replace(/tan\(([^)]+)\)/g, (_, val) => `Math.tan((${val}) * Math.PI / 180)`);
    sanitized = sanitized.replace(/log\(([^)]+)\)/g, (_, val) => `Math.log10(${val})`);
    sanitized = sanitized.replace(/sqrt\(([^)]+)\)/g, (_, val) => `Math.sqrt(${val})`);

    // Prevent invalid syntax at the end
    if (/[*\/+\-.]$/.test(sanitized)) {
      sanitized = sanitized.slice(0, -1);
    }
    
    if (sanitized.includes('/0')) {
        const parts = sanitized.split('/');
        if (parts.some(p => parseFloat(p) === 0)) {
             return "Error: Div by 0";
        }
    }
    
    const result = new Function('return ' + sanitized)();

    if (isNaN(result) || !isFinite(result)) {
      return "Error";
    }

    // Format to a reasonable number of decimal places
    return String(parseFloat(result.toPrecision(14)));

  } catch (error) {
    return "Error";
  }
};
