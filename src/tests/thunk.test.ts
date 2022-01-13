
import { renderHook } from '@testing-library/react-hooks';
import { useThunk } from '../useThunk';


test("thunk test", () => {
    const { result, rerender } = renderHook(({ value }) => useThunk(value), {
        initialProps: {
            value: 20
        }
    });

    const a = result.current;
    expect(a()).toEqual(20);

    rerender({ value: 30 });

    const b = result.current;

    // Same instance
    expect(a).toBe(b);

    expect(b()).toEqual(30);
});