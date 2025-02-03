const debounce = (func, delay = 1000) => {
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  return function (...args) {
    const context = this as unknown as ThisType<unknown>;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

export default debounce;
