const debounce = <T extends (...args: any[]) => any>(func: T, delay = 1000) => {
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  return function (this: unknown, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

export default debounce;
