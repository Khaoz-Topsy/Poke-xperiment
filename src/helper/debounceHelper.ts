export const debounceLeading = (func: any, wait: number = 300, immediate?: boolean) => {
  let timeout: any;
  const funcToReturn: any = function () {
    let context = this;
    let args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
  return funcToReturn;
};
