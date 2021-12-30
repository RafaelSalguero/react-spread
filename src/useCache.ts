import { DependencyList, useRef } from "react";

function arrayEquals(a: readonly any[], b: readonly any[]) {
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

export function useCache() {
    const cache = useRef<{
        [key: string]: {
            deps: DependencyList,
            result: any
        }
    }>({});
    return function get<TResult>(key: string, func: () => TResult, deps: DependencyList): TResult {
        const cached = cache.current[key];
        if (cached && arrayEquals(cached.deps, deps)) {
            return cached.result;
        }
        const result = func();
        cache.current[key] = { deps, result };
        return result;
    }
}