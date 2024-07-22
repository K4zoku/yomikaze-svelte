
export async function delay(ms: number): Promise<void> {
  return await new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function debounce<A = unknown, R = void>(fn: (args: A) => R, ms: number = 300): [(args: A) => Promise<R>, () => void] {
  let timer: NodeJS.Timeout;
  const debouncedFn = (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });

  const teardown = () => clearTimeout(timer);

  return [debouncedFn, teardown];
}