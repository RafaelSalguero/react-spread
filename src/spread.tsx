import React, { PropsWithChildren } from "react";
import { FormErrors } from "./validation";
import { mapObject } from "./logic";

const spreadContext = React.createContext<any>({});

export function Spread<T>(props: PropsWithChildren<any>) {
    return (
        <spreadContext.Provider value={props}>
            {props.children}
        </spreadContext.Provider>
    );
}

interface MinimalFieldProps<T> {
    render: React.ComponentType;
    field: keyof T;
}

function getFieldPropsFromContext(field: string, contextProps: any) {
    return mapObject(contextProps, x =>
        typeof (x) == "function" ? ((...args: any[]) => x(field, ...args)) :
            typeof (x) == "object" ? x[field] :
                x
    );

}

/** Renders a component with props inherited form the nearest Spread context */
function Field<T>(props: MinimalFieldProps<T>) {
    const { render, field, ...rest } = props as any;

    const Render = render;
    return (
        <spreadContext.Consumer>
            {(context) =>
                <Render
                    {...getFieldPropsFromContext(field, context)}
                    {...rest}
                />
            }
        </spreadContext.Consumer>
    )
}

export function createField<T>() {
    type ControlProps<TProps extends { [k: string]: any }> = {
        render: React.ComponentType<TProps>;
        field: keyof T;
        ref?: React.Ref<any>;
    } & (
            Partial<Pick<TProps, "value">> &
            Pick<TProps, Exclude<keyof TProps, "value" | "onChange">> & {
                onChange?: TProps["onChange"] | null
            }
        )

    /**
     * Diibuja el componente especificado en @see render, ligado al campo de nombre @see field y al @see Form mas cercano en el arbol de react
     * Pasa el @see value y @see onChange al elemento dibujado, segun el Form ligado
     */
    function FieldType<TProps>(props: ControlProps<TProps>) { return null as React.ReactElement | null; }
    type RetType = typeof FieldType;
    return Field as any as RetType;
}