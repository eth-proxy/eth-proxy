/**
 * Should be called to get ascii from it's hex representation
 */
export function toAscii(hex: string) {
  // Find termination
  let str = '';
  let i = 0;
  const l = hex.length;
  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }
  for (; i < l; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
}

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 */
export function fromAscii(str: string, num = 0) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }

  return '0x' + hex.padEnd(num, '0');
}
