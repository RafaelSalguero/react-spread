import { useCache } from "../useCache";
import { renderHook } from '@testing-library/react-hooks';


test("cache", () => {
    const { result } = renderHook(() => useCache());

    const a1 = result.current("a", () => Math.random(), [1]);
    const a2 = result.current("a", () => Math.random(), [1]);
    const a3a = result.current("a", () => Math.random(), [2]);

    expect(a1).toEqual(a2);
    expect(a3a).not.toEqual(a2);

    const b1 = result.current("b", () => Math.random(), [1]);
    const b2 = result.current("b", () => Math.random(), [1]);
    const b3 = result.current("b", () => Math.random(), [2]);

    expect(a1).not.toEqual(b1);
    expect(b1).toEqual(b2);
    expect(b3).not.toEqual(b2);
});