import { useSpread } from ".";
import { useBind } from "./useBind";

interface Customer {
    name: string;
    age: number;
}

const value: Customer = {
    age: 20,
    name: "rafa"
};

const onChange = (x: Customer) => {

};

const onBlur = (x: keyof Customer, ev: Event) => {

}
(() => {
    {
        const bind = useSpread({
            value,
            onChange,
            onBlur,
            readonly: true,
            size: 20
        })

        {
            const t0: number = bind("age").value;
            const t1: (ev: Event) => void = bind("age").onBlur;
            const t2: (x: number) => void = bind("age").onChange;
            const t3: (x: string) => void = bind("name").onChange;
            const t4: boolean = bind("age").readonly;
            const t5: number = bind("name").size;
        }
    }

    {
        const bind = useSpread({
            onChange,
            onBlur,
            readonly: true,
        })

        {
            const t1: (ev: Event) => void = bind("age").onBlur;
            const t2: (x: number) => void = bind("age").onChange;
            const t3: (x: string) => void = bind("name").onChange;
            const t4: boolean = bind("age").readonly;
        }
    }

    {
        const bind = useSpread({
            value,
            readonly: true,
        } as const)

        {
            const t4: true = bind("age").readonly;
        }
    }

    {
        const onBlur: ((x: keyof Customer, ev: Event) => void) | undefined = null as any;

        const bind = useBind({
            value,
            onBlur
        })


        bind("name").onBlur?.(null as any);
    }
});