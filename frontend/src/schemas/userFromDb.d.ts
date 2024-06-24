export interface UserFromDb {
    user: { name: string; email: string; token: string };
    id: string;
}
