export async function delay(ms: number): Promise<void> {
  return await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function debounce<A = unknown, R = void>(
  fn: (args: A) => R,
  ms: number = 300
): [(args: A) => Promise<R>, () => void] {
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

export function appendQueryParams(
  searchParams: URLSearchParams,
  params?: { [key: string]: any },
  autoRemoveNull: boolean = false
): URLSearchParams {
  if (!params) {
    return searchParams;
  }
  for (const key in params) {
    if (typeof params[key] === 'string' || typeof params[key] === 'number') {
      searchParams.set(key, params[key].toString());
    } else if (Array.isArray(params[key])) {
      for (const value of params[key]) {
        if (typeof value === 'string') {
          searchParams.append(key, value);
        }
      }
    } else if (autoRemoveNull && params[key] === null) {
      searchParams.delete(key);
    }
  }
  return searchParams;
}

export default function formatNumber(num: number, precision: number = 2) {
  const map = [
    { suffix: 't', threshold: 1e12 },
    { suffix: 'b', threshold: 1e9 },
    { suffix: 'm', threshold: 1e6 },
    { suffix: 'k', threshold: 1e3 },
    { suffix: '', threshold: 1 }
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision);
    return Number.parseFloat(formatted) + found.suffix;
  }

  return num;
}
