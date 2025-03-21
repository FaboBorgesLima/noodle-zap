import express from "express";
import { apiRoutes } from "./routes/api.routes";
import cors from "cors";
import { EntityFactoriesProvider } from "./middleware/entityFactoriesProvider.middleware";

function main() {
    const port = 8080;
    const app = express();

    app.use(cors({}));

    app.use((req, _res, next) => {
        console.log(`${req.method}:${req.path} ${new Date().toString()}`);
        next();
    });

    app.use(EntityFactoriesProvider.middleware.bind(EntityFactoriesProvider));

    app.use("/api", apiRoutes);

    app.listen(port, () => {
        console.log(`started at ${port}`);
    });
}

main();
