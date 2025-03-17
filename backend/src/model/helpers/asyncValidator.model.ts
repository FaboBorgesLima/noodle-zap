type Validator<T> = (param: unknown) => Promise<T> | T;

export class AsyncValidator<Validators extends Record<string, Validator<any>>> {
    constructor(private validators: Validators) {}

    async validate(toBeValidated: unknown): Promise<
        | void
        | {
              [K in keyof Validators]: Exclude<
                  Awaited<ReturnType<Validators[K]>>,
                  void
              >;
          }
    > {
        if (typeof toBeValidated !== "object" || toBeValidated === null) return;

        const keys = Object.keys(this.validators) as (keyof Validators)[];

        const validated: Partial<{
            [K in keyof Validators]: ReturnType<Validators[K]>;
        }> = {};

        for (const k of keys) {
            //@ts-ignore
            const param = (toBeValidated as Record<string, unknown>)[k];
            const tryValid = await this.validators[k](param);

            if (tryValid === undefined || tryValid === null) return;

            validated[k] = tryValid;
        }

        return validated as {
            [K in keyof Validators]: Exclude<
                Awaited<ReturnType<Validators[K]>>,
                void
            >;
        };
    }
}
