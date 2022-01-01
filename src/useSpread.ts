import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Bind, SpreadProps, useBind } from "./useBind";
import { useThunk } from "./useThunk";

type OnChange<T> = ((x: T) => any) | Dispatch<SetStateAction<T>>;

type BaseProps<TValue> = {
    value?: TValue;
    onChange?: OnChange<TValue>;
}

type OnChangeSpread<TValue> = {
    onChange: {
        [K in keyof TValue]: (value: TValue[K]) => void;
    }
}

/**
 * Returns a function that spreads @param spread over child components.
 * Example:
 *
 * const value = {
 *  name: "Rafa",
 *  age: 20
 * }
 * 
 * const bind = useForm({ value, onChange });
 * 
 * <Input {...bind("name")} />
 * <Input {...bind("age")} />
 * 
 * @param spread Props to spread over child components
 * @param extra Optinal extra props to pass to all child components, functions are called with the field name as first argument
 */
export function useSpread<T, TSpread extends SpreadProps<any, keyof T>, TExtra = {}>(spread: BaseProps<T> & TSpread, extra?: TExtra)
    : Bind<Omit<TSpread, "onChange"> & OnChangeSpread<T>, TExtra> {
    const getValue = useThunk(spread.value);
    const spreadOnChange = useCallback((field: keyof T, value: T[keyof T]) => {
        spread.onChange?.({
            ... (getValue() as any ?? {}),
            [field]: value
        });
    }, [spread.onChange]);

    const bind = useBind({
        ...spread,
        onChange: spread.onChange ? spreadOnChange : undefined
    }, extra);

    return bind as any;
}