const utf8 = require('utf8') as typeof import('utf8');

/**
 * Should be called to get hex representation (prefixed by 0x) of utf8 string
 */
export function utf8ToHex(str: string) {
  str = utf8.encode(str);
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code === 0) {
      hex += '00';
    } else {
      const n = code.toString(16);
      hex += n.length < 2 ? '0' + n : n;
    }
  }

  return '0x' + hex;
}
