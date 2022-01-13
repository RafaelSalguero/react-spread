import { useBind } from "../useBind";
import { renderHook } from '@testing-library/react-hooks';

interface Customer {
    name: string;
    age: number;
}

const value: Customer = {
    age: 20,
    name: "rafa"
};

test("simple value", () => {
    const { result } = renderHook(() => useBind({
        value
    }));

    expect(result.current("age")).toEqual({
        value: 20,
    });

    expect(result.current("name")).toEqual({
        value: "rafa",
    });
});

test("extra props", () => {
    const { result } = renderHook(() => useBind({
        value
    }, {
        readonly: true,
    }));

    expect(result.current("age")).toEqual({
        value: 20,
        readonly: true,
    });

    expect(result.current("name")).toEqual({
        value: "rafa",
        readonly: true,
    })
});

test("non-object props", () => {
    const { result } = renderHook(() => useBind({
        value,
        disabled: true
    }, {
        readonly: true
    }));

    expect(result.current("age")).toEqual({
        value: 20,
        disabled: true,
        readonly: true,
    });

    expect(result.current("name")).toEqual({
        value: "rafa",
        disabled: true,
        readonly: true,
    });
});

test("spread funcs", () => {
    let value: Customer = {
        age: 20,
        name: "rafa"
    };

    let blurs: string[] = [];
    let onBlur = (field: keyof Customer) => {
        blurs.push(field);
    }

    const { result, rerender } = renderHook(({ value, onBlur }) => useBind({
        value,
        onBlur
    }), {
        initialProps: {
            value,
            onBlur
        }
    });


    const ageOnBlurInsstance = result.current("age").onBlur;
    const nameOnBlurInstance = result.current("name").onBlur;

    ageOnBlurInsstance();
    expect(blurs).toEqual(["age"]);

    nameOnBlurInstance();
    expect(blurs).toEqual(["age", "name"]);

    // Rerender with the same function, should result in the same instance:
    rerender({
        value,
        onBlur
    });

    expect(result.current("age").onBlur).toBe(ageOnBlurInsstance);
    expect(result.current("name").onBlur).toBe(nameOnBlurInstance);

    // Change onBlur:
    onBlur = (field: keyof Customer) => {
        blurs.push(field + "2");
    }

    // Rerender with a different function:
    rerender({
        value,
        onBlur
    });

    expect(result.current("age").onBlur).not.toBe(ageOnBlurInsstance);
    expect(result.current("name").onBlur).not.toBe(nameOnBlurInstance);

    result.current("age").onBlur();
    expect(blurs).toEqual(["age", "name", "age2"]);
});

test("spread func args", () => {
    let value: Customer = {
        age: 20,
        name: "rafa"
    };

    let blurs: string[] = [];
    const onBlur = (field: keyof Customer, ev: string) => {
        blurs.push(field + "_" + ev);
    }

    const { result } = renderHook(({ value, onBlur }) => useBind({
        value,
        onBlur
    }), {
        initialProps: {
            value,
            onBlur
        }
    });

    result.current("age").onBlur("ev1");
    expect(blurs).toEqual(["age_ev1"]);
});