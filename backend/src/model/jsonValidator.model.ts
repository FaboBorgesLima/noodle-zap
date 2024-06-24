type Validator<T> = (param: unknown) => T;

export class JsonValidator<Validators extends Record<string, Validator<any>>> {
    constructor(private validators: Validators) {}

    validate(
        toBeValidated: unknown
    ):
        | { [K in keyof Validators]: Exclude<ReturnType<Validators[K]>, void> }
        | void {
        if (typeof toBeValidated !== "object" || toBeValidated === null) return;

        const keys = Object.keys(this.validators) as (keyof Validators)[];

        const validated: Partial<{
            [K in keyof Validators]: ReturnType<Validators[K]>;
        }> = {};

        for (const k of keys) {
            //@ts-ignore
            const param = (toBeValidated as Record<string, unknown>)[k];
            const tryValid = this.validators[k](param);

            if (tryValid === undefined || tryValid === null) return;

            validated[k] = tryValid;
        }

        return validated as {
            [K in keyof Validators]: Exclude<ReturnType<Validators[K]>, void>;
        };
    }
}
