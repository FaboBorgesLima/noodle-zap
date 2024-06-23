export class JsonValidator {
    static validate<T = string | void | number>(
        paramValidators: { [k: string]: (param: unknown) => T },
        toBeValidated: unknown
    ): {
        [k: string]: Exclude<T, void>;
    } | void {
        if (typeof toBeValidated != "object" || !toBeValidated) return;

        const keys = Object.keys(paramValidators);

        const validated: { [k: string]: Exclude<T, void> } = {};

        for (const k of keys) {
            // unsafe types
            const param = (<any>toBeValidated)[k];
            const tryValid = paramValidators[k](param);

            if (!tryValid) return;

            //@ts-ignore
            validated[k] = tryValid;
        }

        return validated;
    }
}
