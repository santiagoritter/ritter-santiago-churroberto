import "./setup.js";
import request from "supertest";
import { createApp } from "../src/app.js";

export const crearApi = () => request(createApp());

export const conToken = (token) => ({ Authorization: `Bearer ${token}` });

export const iniciarSesionAdmin = async (api) => {
    const respuesta = await api
        .post("/auth/login")
        .send({ email: process.env.ADMIN_EMAIL, contrasena: process.env.ADMIN_PASSWORD });
    return respuesta.body.data.token;
};

export const registrarCliente = async (api, email = "ana@example.com") => {
    const respuesta = await api.post("/auth/registro").send({
        nombre: "Ana",
        apellido: "Pérez",
        email,
        telefono: "11 5555-1234",
        contrasena: "una-clave-larga"
    });
    return respuesta.body.data;
};
