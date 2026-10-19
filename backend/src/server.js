import { createApp } from "./app.js";
import { config } from "./utils/config.js";

const app = createApp();

app.listen(config.port, () => {
    console.log(`API de Churroberto escuchando en http://localhost:${config.port}`);
});
