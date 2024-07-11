import { instance } from "../connection/instance";
import { UserFromDb } from "../schemas/userFromDb";

export class UserService {
    private static readonly localStorageTokenAddress = "blog-token";
    /**
     *
     * @param email
     * @param password
     * @returns
     *
     * will login the user and set the token in localStorage
     */
    static async login(
        email: string,
        password: string
    ): Promise<void | UserFromDb> {
        try {
            const { data } = await instance.post<UserFromDb>(
                "/api/user/login",
                {
                    email,
                    password,
                }
            );

            this.setToken(data.user.token);

            return data;
        } catch {}
    }
    /**
     *
     * @param name
     * @param password
     * @param email
     * @returns
     * will create the user and set the token in localStorage
     */
    static async create(
        name: string,
        password: string,
        email: string
    ): Promise<void | UserFromDb> {
        try {
            const { data } = await instance.post<UserFromDb>(
                "/api/user/create",
                {
                    name,
                    password,
                    email,
                }
            );

            this.setToken(data.user.token);

            return data;
        } catch {}
    }

    static async getUserByToken(token: string): Promise<UserFromDb | void> {
        try {
            const { data } = await instance.post<UserFromDb>(
                "/api/user/login-token",
                { token }
            );

            return data;
        } catch {}
    }

    static setToken(token: string) {
        localStorage.setItem(this.localStorageTokenAddress, token);
    }

    static getToken(): string | null {
        return localStorage.getItem(this.localStorageTokenAddress);
    }

    static clearToken(): void {
        localStorage.removeItem(this.localStorageTokenAddress);
    }

    static async logout(token: string): Promise<void> {
        try {
            await instance.delete("/api/user/auth/logout", {
                headers: { Authorization: `bearer ${token}` },
            });
        } catch {}
    }

    static async getByName(
        name: string
    ): Promise<void | { name: string; id: string }> {
        try {
            const { data } = await instance.get<{ name: string; id: string }>(
                `/api/user/find-by-name/${name}`
            );
            return data;
        } catch {}
    }
}
