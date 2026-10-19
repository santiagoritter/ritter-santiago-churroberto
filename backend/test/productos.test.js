import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { Messages } from "../src/enums/Messages.js";
import { conToken, crearApi, iniciarSesionAdmin, registrarCliente } from "./helpers.js";

const productoValido = {
    nombre: "Churros de prueba",
    descripcion: "Producto creado por los tests.",
    precio: 5000,
    stock: 10,
    categoriaId: 1
};

describe("CRUD de productos", () => {
    let api;
    let tokenAdmin;

    before(async () => {
        api = crearApi();
        tokenAdmin = await iniciarSesionAdmin(api);
    });

    it("obtiene todos los productos con el formato { success, data }", async () => {
        const respuesta = await api.get("/productos");
        assert.equal(respuesta.status, 200);
        assert.equal(respuesta.body.success, true);
        assert.ok(Array.isArray(respuesta.body.data));
        assert.ok(respuesta.body.data.length > 0);
    });

    it("filtra los productos por categoría", async () => {
        const respuesta = await api.get("/productos?categoriaId=4");
        assert.equal(respuesta.status, 200);
        assert.ok(respuesta.body.data.every((producto) => producto.categoriaId === 4));
    });

    it("obtiene un producto por ID", async () => {
        const respuesta = await api.get("/productos/1");
        assert.equal(respuesta.status, 200);
        assert.equal(respuesta.body.data.id, 1);
    });

    it("responde 404 con { success: false, message } si el producto no existe", async () => {
        const respuesta = await api.get("/productos/9999");
        assert.equal(respuesta.status, 404);
        assert.deepEqual(respuesta.body, { success: false, message: Messages.PRODUCT_NOT_FOUND });
    });

    it("responde 400 si el ID no es válido", async () => {
        const respuesta = await api.get("/productos/abc");
        assert.equal(respuesta.status, 400);
        assert.equal(respuesta.body.message, Messages.INVALID_ID);
    });

    it("exige sesión para crear un producto", async () => {
        const respuesta = await api.post("/productos").send(productoValido);
        assert.equal(respuesta.status, 401);
        assert.equal(respuesta.body.message, Messages.TOKEN_REQUIRED);
    });

    it("no deja crear productos a un cliente", async () => {
        const { token } = await registrarCliente(api);
        const respuesta = await api.post("/productos").set(conToken(token)).send(productoValido);
        assert.equal(respuesta.status, 403);
        assert.equal(respuesta.body.message, Messages.FORBIDDEN);
    });

    it("crea, modifica y elimina un producto siendo administrador", async () => {
        const creado = await api.post("/productos").set(conToken(tokenAdmin)).send(productoValido);
        assert.equal(creado.status, 201);
        assert.equal(creado.body.success, true);
        const id = creado.body.data.id;

        const modificado = await api
            .put(`/productos/${id}`)
            .set(conToken(tokenAdmin))
            .send({ ...productoValido, precio: 6500 });
        assert.equal(modificado.status, 200);
        assert.equal(modificado.body.data.precio, 6500);

        const eliminado = await api.delete(`/productos/${id}`).set(conToken(tokenAdmin));
        assert.equal(eliminado.status, 200);

        const buscado = await api.get(`/productos/${id}`);
        assert.equal(buscado.status, 404);
    });

    it("rechaza datos inválidos con 400", async () => {
        const respuesta = await api
            .post("/productos")
            .set(conToken(tokenAdmin))
            .send({ ...productoValido, precio: -1 });
        assert.equal(respuesta.status, 400);
        assert.equal(respuesta.body.message, Messages.PRICE_INVALID);
    });

    it("rechaza un nombre duplicado con 409", async () => {
        const [existente] = (await api.get("/productos")).body.data;
        const respuesta = await api
            .post("/productos")
            .set(conToken(tokenAdmin))
            .send({ ...productoValido, nombre: existente.nombre });
        assert.equal(respuesta.status, 409);
        assert.equal(respuesta.body.message, Messages.PRODUCT_DUPLICATED);
    });

    it("rechaza una categoría que no existe con 404", async () => {
        const respuesta = await api
            .post("/productos")
            .set(conToken(tokenAdmin))
            .send({ ...productoValido, categoriaId: 999 });
        assert.equal(respuesta.status, 404);
        assert.equal(respuesta.body.message, Messages.CATEGORY_NOT_FOUND);
    });

    it("responde 400 ante un JSON mal formado", async () => {
        const respuesta = await api
            .post("/productos")
            .set(conToken(tokenAdmin))
            .set("Content-Type", "application/json")
            .send("{ esto no es json");
        assert.equal(respuesta.status, 400);
        assert.equal(respuesta.body.message, Messages.INVALID_DATA);
    });

    it("responde 404 en el mismo formato si la ruta no existe", async () => {
        const respuesta = await api.get("/no-existe");
        assert.equal(respuesta.status, 404);
        assert.deepEqual(respuesta.body, { success: false, message: Messages.ROUTE_NOT_FOUND });
    });
});
