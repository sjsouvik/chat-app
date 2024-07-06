import { useRef } from "react";

export const useDebounce = () => {
  const timerRef = useRef();

  const debounce = (fn, delay) => {
    return function debounced(...args) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  return debounce;
};
