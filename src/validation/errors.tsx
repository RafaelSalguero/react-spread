
/**A single field error message */
export type FieldError = string | null;

/**For each form field, an error message */
export type FormErrors<T> = {
    [K in keyof T]?: FieldError
};
