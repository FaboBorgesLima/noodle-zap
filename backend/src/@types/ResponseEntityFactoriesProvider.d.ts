import { Response } from "express";
import { EntityFactoriesProvider } from "../middleware/entityFactoriesProvider.middleware";

export type ResponseEntityFactoriesProvider<Locals extends {} = {}> = Response<
    any,
    { entityFactoriesProvider: EntityFactoriesProvider } & Locals
>;
