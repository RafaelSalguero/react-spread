import { renderHook } from '@testing-library/react-hooks';
import { useState } from 'react';
import { act } from 'react-test-renderer';
import { useSpread } from '../useSpread';

interface Customer {
    name: string;
    age: number;
}

const initialValue: Customer = {
    age: 20,
    name: "rafa"
};


test("spread onChange", () => {
    const { result, rerender } = renderHook(() => {
        const [value, onChange] = useState(initialValue);
        const bind = useSpread({
            value,
            onChange
        });

        return {
            value,
            onChange,
            bind
        }
    });

    const origAgeOnChange = result.current.bind("age").onChange;
    const origNameOnChange = result.current.bind("name").onChange;

    expect(result.current.bind("age").value).toEqual(20);
    expect(result.current.bind("name").value).toEqual("rafa");

    rerender();

    // Should have the same instance:
    expect(result.current.bind("age").onChange).toBe(origAgeOnChange);
    expect(result.current.bind("name").onChange).toBe(origNameOnChange);

    act(() => {
        origAgeOnChange(22);
    });

    act(() => {
        origNameOnChange("rafa2");
    })

    expect(result.current.value).toEqual({
        age: 22,
        name: "rafa2"
    });
});