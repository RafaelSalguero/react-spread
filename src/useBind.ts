import { mapObject } from "./mapObject";
import { useCache } from "./useCache";

type Key = string | number | symbol;
type Func = (...args: any[]) => any;

export type SpreadFunc<TFunc extends Func, TFields extends Key> = (field: TFields, ...args: (Parameters<TFunc>)) => ReturnType<TFunc>;

export type SpreadField<T, TFields extends Key> =
    T extends Func ? SpreadFunc<T, TFields> :
    T;

export type SpreadProps<TProps, TFields extends Key> = {
    [K in keyof TProps]:
    {
        [Field in TFields]?: SpreadField<TProps[K], TFields>
    } | SpreadField<TProps[K], TFields>
}

type ExtractExtraField<T> =
    T extends (field: any, ...args: infer P) => any ? (...args: P) => ReturnType<T> :
    T;

type ExtraExtraProps<T> = T extends {} ? {
    [K in keyof T]: ExtractExtraField<T[K]>
} : {};

type ExtractProps<TSpread, TField extends keyof TSpread[any]> = {
    [K in keyof TSpread]:
    TSpread[K] extends Func ? ExtractExtraField<TSpread[K]> :
    TSpread[K] extends object ? TSpread[K][TField] :
    ExtractExtraField<TSpread[K]>
}

type ExtractFields<T> = T extends {
    [K in keyof T]?:
    T[K] extends Func ? any :
    T[K] extends object ? {
        [K in infer P]?: any
    } : any
} ? P : never;

export type Bind<TSpread extends SpreadProps<any, any>, TExtra> =
    <TField extends ExtractFields<TSpread>>(field: TField) => ExtractProps<TSpread, TField> & ExtraExtraProps<TExtra>;

/**
 * Retuns a function that spread props to child components
 * Field props are spreaded from @param spread according to the given field name.
 * 
 * @param spread An object with the shape of { [prop]: { [field]: value }  }, holding the props to spread for each field
 * @param extra An object with the shape of { [prop]: value }, holding the props to spread to all fields
 * @returns 
 */
export function useBind<TSpread extends SpreadProps<any, any>, TExtra = undefined>(spread: TSpread, extra?: TExtra): Bind<TSpread, TExtra> {
    const cacheGet = useCache();
    const mapValue = (value: any, field: string | number | symbol, prop: string) => {
        if (typeof (value) != "function") {
            return value;
        }

        return cacheGet(`${field.toString()}.${prop}`, () => (...args: any[]) => value(field, ...args), [value]);
    }
    return function bind(field) {
        const extraProps = mapObject(extra || {},
            (value, prop) =>
                mapValue(value?.[prop as any], field, prop as string)
        );

        const spreadProps = mapObject(spread,
            (value, prop) =>
                typeof value == "object" ? value[field] :
                    mapValue(value?.[prop as any], field, prop as string)
        );

        return { ...extraProps, spreadProps } as any;
    }
}
