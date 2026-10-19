import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { cargarDatosIniciales } from "./repositories/datosIniciales.js";
import routes from "./routes/index.js";
import { config } from "./utils/config.js";

export const createApp = ({ conDatosIniciales = true } = {}) => {
    const app = express();

    if (config.trustProxy) {
        app.set("trust proxy", config.trustProxy);
    }

    app.use(helmet());
    app.use(cors({ origin: config.corsOrigins }));
    app.use(express.json({ limit: "100kb" }));

    if (conDatosIniciales) {
        cargarDatosIniciales();
    }

    app.use(routes);
    app.use(notFound);
    app.use(errorHandler);

    return app;
};

export default createApp;
