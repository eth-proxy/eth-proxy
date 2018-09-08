export function quantityOrTag(tags: string[]) {
  return (data: string | number) => {
    if (typeof data === 'string') {
      if (tags.includes(data)) {
        return data;
      }
    }
    if (typeof data === 'number') {
      return formatQuantity(data);
    }
    throw Error('Not a quantity or allowed tag');
  };
}

export function formatQuantity(number: number) {
  return '0x' + number.toString(16);
}
