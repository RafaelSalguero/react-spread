import * as React from "react";
import { FormErrors } from "./validation";
import { Spread } from "./spread";

interface FormProps<T> {
    value?: T;
    onChange?: (value: T) => void;
    onBlur?: (field: keyof T) => void;
    errors?: FormErrors<T>;
}

export function Form<T>(props: React.PropsWithChildren<FormProps<T>>)
export function Form<TValue, TExtraProps>(props: React.PropsWithChildren<FormProps<TValue> & TExtraProps>)
export function Form<T>(props: React.PropsWithChildren<FormProps<T>>) {
    return <FormComp  {...props} />
}

class FormComp<T> extends React.Component<FormProps<T>> {
    spreadOnChange = (field: keyof T, value: T[keyof T]) => {
        this.props.onChange?.({
            ... (this.props.value as any ?? {}),
            [field]: value
        });
    };

    render() {
        const { onChange, ...rest } = this.props;

        return (
            <Spread
                {...rest}
                onChange={onChange ? this.spreadOnChange : undefined}
            >
                {this.props.children}
            </Spread>
        )
    }
}