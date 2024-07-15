export class MongodbUserModel {
    readonly name: string;
    readonly email: string;
    protected constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }

    static factory(name: string, email: string): MongodbUserModel {
        return new MongodbUserModel(name, email);
    }

    toJSON() {
        return {
            name: this.name,
            email: this.email,
        };
    }
}
