import { createContext } from "react";
import { UserFromDb } from "../../schemas/userFromDb";

export const LoggedContext = createContext<UserFromDb | null>(null);
