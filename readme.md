# react-spread

The *tiniest* package to do forms in React.

- ✅ Works with React 16 and 17 both DOM and Native
- ✅ Perfectly typed
- ✅ Packaged both for ES6 + CommonJS 
- ✅ Functional, controlled style
- ✅ Composable
- ✅ Unopinionated, works with any component out of the box
- ✅ Super easy to implement your own validation logic
- ✅ No-nonsense, tiny API, super simple logic

# Minimal example

```tsx
import { useSpread } from "react-spread"

interface Customer {
    name: string;
    age: number;
}

interface Props {
    value: Customer;
    onChange: (x: Customer) => void;
}

function CustomerForm(props: Props)
{
    // Calling 'bind' with a field name
    // returns a props object for that specific field

    const bind = useSpread(props);
    return (
        <div>
            <Input {...bind("name")} >
            <Input {...bind("age")} type="number" >
        </div>
    );
}
```

# Form validation
Validation is not included but it's easy to implement your own custom logic
by spreading an object of errors over form fields:

```tsx
function validate(x: Customer) {
    return {
        name: !x.name ? "Required" : null,
        age: x.age < 18 ? "Must be over 18": null
    }
}


function CustomerForm(props: Props)
{
    // An 'error' prop will be passed to each specific field
    // with the corresponding value
    const bind = useSpread({
        ... props,
        error: validate(props.value)
    })

    return (
        <div>
            <Input {...bind("name")} >
            <Input {...bind("age")} type="number" >
        </div>
    );
}
```

# Extra props
```tsx
function CustomerForm(props: Props)
{
    // Second parameter is the optional "extra" props
    // A 'readonly' prop will be passed to each component
    const bind = useSpread(props, {
        readOnly: true
    })

    return (
        <div>
            <Input {...bind("name")} >
            <Input {...bind("age")} type="number" >
        </div>
    );
}
```

# Function props
Function props are treated different from non-function ones, when a child component
calls, the call is mirrored with the field name as an extra first argument.

In other words, functions are mapped to:
```js
(...args) => prop(field, ...args)
```

This allows the function handler to known which field made the call

# onChange prop

`onChange` is the only prop that behaves differently, is mapped to

```js
(x) => prop({... value, [field]: x })
```


# No bloat oath

> I do solemnly swear to never bloat this package
>
> <cite>Rafael Salguero</cite>