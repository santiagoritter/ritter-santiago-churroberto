import bcrypt from "bcryptjs";
import { config } from "./config.js";

export const hashearContrasena = (contrasena) => bcrypt.hash(contrasena, config.bcryptRounds);

export const hashearContrasenaSync = (contrasena) => bcrypt.hashSync(contrasena, config.bcryptRounds);

export const compararContrasena = (contrasena, hash) => bcrypt.compare(contrasena, hash);
