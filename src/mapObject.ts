export function mapObject<T, TOut>(obj: T, map: <K extends keyof T>(value: T[K], key: K) => TOut): ({ [K in keyof T]: TOut }) {
    const ret = {};
    for (const key in obj) {
        const value = obj[key];
        ret[key as string] = map(value, key);
    }
    return ret as { [K in keyof T]: TOut };
}