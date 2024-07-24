export async function delay(ms: number): Promise<void> {
  return await new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function debounce<A = unknown, R = void>(fn: (args?: A) => R, ms: number = 300): [(args: A) => Promise<R>, () => void] {
  let timer: NodeJS.Timeout;
  const debouncedFn = (args?: A): Promise<R> =>
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

export function appendQueryParams(url: URL, params?: { [key: string]: any }): URL {
  if (!params) {
    return url;
  }
  for (const key in params) {
    if (typeof params[key] === 'string') {
      url.searchParams.set(key, params[key]);
    } else if (Array.isArray(params[key])) {
      for (const value of params[key]) {
        if (typeof value === 'string') {
          url.searchParams.append(key, value);
        }
      }
    }
  }
  return url;
}