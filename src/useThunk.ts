import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a stable (always the same instance) thunk that returns @param value
 */
export function useThunk<T>(value: T): () => T {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);

    const thunk = useCallback(() => ref.current, []);
    return thunk;
}