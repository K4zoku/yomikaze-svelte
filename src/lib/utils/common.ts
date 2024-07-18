
export async function delayedValuePromise<T>(delayMs: number, value: T): Promise<T> {
    return await new Promise<T>(resolve => setTimeout(() => resolve(value), delayMs));
}