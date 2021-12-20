import * as React from "react";
import { FormErrors } from "./validation";
import { mapObject } from "./logic";

const spreadContext = React.createContext<any>({});

export function Spread<T>(props: React.PropsWithChildren<any>) {
    return (
        <spreadContext.Provider value={props}>
            {props.children}
        </spreadContext.Provider>
    );
}

interface FieldProps<T> {
    render: React.ComponentType;
    field: keyof T;
    extraProps: any;
}

function getFieldPropsFromContext(field: string, contextProps: any) {
    return mapObject(contextProps, x =>
        typeof (x) == "function" ? ((...args: any[]) => x(field, ...args)) :
            typeof (x) == "object" ? x[field] :
                x
    );

}

/** Renders a component with props inherited form the nearest Spread context */
function Field<T>(props: FieldProps<T>) {
    const { render, field, extraProps } = props as any;

    const Render = render;
    return (
        <spreadContext.Consumer>
            {(context) =>
                <Render
                    {...getFieldPropsFromContext(field, context)}
                    {...(extraProps ?? {})}
                />
            }
        </spreadContext.Consumer>
    )
}

export function createField<T>() {
    return function field<TRender extends React.ComponentType>(field: keyof T, render: TRender, props?: React.ComponentProps<TRender>) {
        return <Field<T> field={field} render={render} extraProps={props} />;
    };
}