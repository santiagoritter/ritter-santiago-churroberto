import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { Messages } from "../src/enums/Messages.js";
import { conToken, crearApi, iniciarSesionAdmin, registrarCliente } from "./helpers.js";

const pedidoDeRetiro = { tipoEntrega: "RETIRO", metodoPago: "EFECTIVO" };

describe("Cuentas y sesión", () => {
    let api;

    before(() => {
        api = crearApi();
    });

    it("registra un cliente sin devolver la contraseña", async () => {
        const respuesta = await api.post("/auth/registro").send({
            nombre: "Ana",
            apellido: "Pérez",
            email: "Ana@Example.com",
            telefono: "11 5555-1234",
            contrasena: "una-clave-larga"
        });
        assert.equal(respuesta.status, 201);
        assert.equal(respuesta.body.data.usuario.email, "ana@example.com");
        assert.equal(respuesta.body.data.usuario.rol, "CLIENTE");
        assert.equal("contrasena" in respuesta.body.data.usuario, false);
        assert.ok(respuesta.body.data.token);
    });

    it("rechaza un email ya registrado con 409", async () => {
        const respuesta = await api.post("/auth/registro").send({
            nombre: "Otra",
            apellido: "Persona",
            email: "ana@example.com",
            telefono: "11 5555-9999",
            contrasena: "una-clave-larga"
        });
        assert.equal(respuesta.status, 409);
        assert.equal(respuesta.body.message, Messages.EMAIL_ALREADY_REGISTERED);
    });

    it("inicia sesión y rechaza credenciales incorrectas con el mismo mensaje", async () => {
        const correcta = await api.post("/auth/login").send({ email: "ana@example.com", contrasena: "una-clave-larga" });
        assert.equal(correcta.status, 200);

        const claveMala = await api.post("/auth/login").send({ email: "ana@example.com", contrasena: "otra" });
        const emailInexistente = await api.post("/auth/login").send({ email: "nadie@example.com", contrasena: "otra" });
        assert.equal(claveMala.status, 401);
        assert.equal(emailInexistente.status, 401);
        assert.equal(claveMala.body.message, Messages.INVALID_CREDENTIALS);
        assert.equal(emailInexistente.body.message, Messages.INVALID_CREDENTIALS);
    });

    it("rechaza un token inválido", async () => {
        const respuesta = await api.get("/auth/perfil").set(conToken("token-falso"));
        assert.equal(respuesta.status, 401);
        assert.equal(respuesta.body.message, Messages.TOKEN_INVALID);
    });
});

describe("Carrito y pedidos", () => {
    let api;
    let tokenAdmin;
    let tokenCliente;

    before(async () => {
        api = crearApi();
        tokenAdmin = await iniciarSesionAdmin(api);
        tokenCliente = (await registrarCliente(api)).token;
    });

    it("arma el carrito y respeta el stock", async () => {
        const agregado = await api
            .post("/carrito/items")
            .set(conToken(tokenCliente))
            .send({ productoId: 1, cantidad: 2 });
        assert.equal(agregado.status, 201);
        assert.equal(agregado.body.data.total, 18000);

        const sinStock = await api
            .post("/carrito/items")
            .set(conToken(tokenCliente))
            .send({ productoId: 1, cantidad: 100000 });
        assert.equal(sinStock.status, 409);
        assert.equal(sinStock.body.message, Messages.PRODUCT_OUT_OF_STOCK);
    });

    it("no crea pedidos con el carrito vacío", async () => {
        const otro = (await registrarCliente(api, "otro@example.com")).token;
        const respuesta = await api.post("/pedidos").set(conToken(otro)).send(pedidoDeRetiro);
        assert.equal(respuesta.status, 400);
        assert.equal(respuesta.body.message, Messages.CART_EMPTY);
    });

    it("exige dirección cuando el pedido es con envío", async () => {
        const respuesta = await api
            .post("/pedidos")
            .set(conToken(tokenCliente))
            .send({ tipoEntrega: "ENVIO", metodoPago: "EFECTIVO" });
        assert.equal(respuesta.status, 400);
        assert.equal(respuesta.body.message, Messages.ADDRESS_REQUIRED);
    });

    it("confirma el pedido, descuenta el stock y vacía el carrito", async () => {
        const stockAntes = (await api.get("/productos/1")).body.data.stock;

        const respuesta = await api.post("/pedidos").set(conToken(tokenCliente)).send(pedidoDeRetiro);
        assert.equal(respuesta.status, 201);
        assert.equal(respuesta.body.data.estado, "PENDIENTE");
        assert.equal(respuesta.body.data.total, 18000);
        assert.equal(respuesta.body.data.direccionEntrega, null);

        const stockDespues = (await api.get("/productos/1")).body.data.stock;
        assert.equal(stockDespues, stockAntes - 2);

        const carrito = await api.get("/carrito").set(conToken(tokenCliente));
        assert.deepEqual(carrito.body.data.items, []);
    });

    it("solo el administrador ve todos los pedidos", async () => {
        const cliente = await api.get("/pedidos").set(conToken(tokenCliente));
        assert.equal(cliente.status, 403);

        const admin = await api.get("/pedidos").set(conToken(tokenAdmin));
        assert.equal(admin.status, 200);
        assert.equal(admin.body.data.length, 1);
    });

    it("un cliente no ve los pedidos de otro", async () => {
        const intruso = (await registrarCliente(api, "intruso@example.com")).token;
        const respuesta = await api.get("/pedidos/1").set(conToken(intruso));
        assert.equal(respuesta.status, 404);
        assert.equal(respuesta.body.message, Messages.ORDER_NOT_FOUND);
    });

    it("valida las transiciones de estado", async () => {
        const salto = await api.patch("/pedidos/1/estado").set(conToken(tokenAdmin)).send({ estado: "LISTO" });
        assert.equal(salto.status, 409);
        assert.equal(salto.body.message, Messages.ORDER_INVALID_TRANSITION);

        const valido = await api
            .patch("/pedidos/1/estado")
            .set(conToken(tokenAdmin))
            .send({ estado: "EN_PREPARACION" });
        assert.equal(valido.status, 200);
        assert.equal(valido.body.data.estado, "EN_PREPARACION");
    });

    it("el cliente cancela un pedido pendiente y se devuelve el stock", async () => {
        await api.post("/carrito/items").set(conToken(tokenCliente)).send({ productoId: 2, cantidad: 3 });
        const pedido = await api.post("/pedidos").set(conToken(tokenCliente)).send(pedidoDeRetiro);
        const stockConPedido = (await api.get("/productos/2")).body.data.stock;

        const cancelado = await api.patch(`/pedidos/${pedido.body.data.id}/cancelar`).set(conToken(tokenCliente));
        assert.equal(cancelado.status, 200);
        assert.equal(cancelado.body.data.estado, "CANCELADO");

        const stockDespues = (await api.get("/productos/2")).body.data.stock;
        assert.equal(stockDespues, stockConPedido + 3);
    });
});

describe("Datos del local", () => {
    it("publica los datos del local y las reseñas sin iniciar sesión", async () => {
        const api = crearApi();
        const local = await api.get("/local");
        assert.equal(local.status, 200);
        assert.equal(local.body.data.barrio, "Villa Urquiza");

        const resenas = await api.get("/resenas");
        assert.equal(resenas.status, 200);
        assert.equal(resenas.body.data.length, 3);
    });
});
