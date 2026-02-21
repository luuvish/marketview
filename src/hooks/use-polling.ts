import { useEffect, useRef } from 'react';

export function usePolling(callback: () => void, interval: number, enabled = true) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    if (!enabled) return;

    // Initial call
    savedCallback.current();

    let timer: ReturnType<typeof setInterval>;

    function start() {
      timer = setInterval(() => savedCallback.current(), interval);
    }

    function handleVisibility() {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        savedCallback.current();
        start();
      }
    }

    start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [interval, enabled]);
}
