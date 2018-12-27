export const methodProxy = {
  get: (target: {}, name: string) => {
    return (payload: any) => ({
      ...target,
      payload,
      method: name
    });
  }
};
export const interfaceProxy = {
  get: (target: any, name: string) => {
    return new Proxy(
      {
        ...target,
        interface: name
      },
      methodProxy
    );
  }
};
export const C = new Proxy({}, interfaceProxy);
