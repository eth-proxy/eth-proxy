export const methodProxy = {
  get: (target, name) => {
    return payload => ({
      ...target,
      payload,
      method: name
    });
  }
};
export const interfaceProxy = {
  get: (target, name) => {
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
