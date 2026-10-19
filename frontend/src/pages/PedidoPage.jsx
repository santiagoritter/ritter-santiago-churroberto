import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "../components/effects/Reveal";
import SplitText from "../components/effects/SplitText";
import Button from "../components/ui/Button";
import { EstadoVacio } from "../components/ui/Estados";
import { Input, OpcionesTarjeta, Select } from "../components/ui/Field";
import ProductoArte from "../components/ui/ProductoArte";
import QuantityStepper from "../components/ui/QuantityStepper";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useTitulo } from "../hooks/useTitulo";
import { confirmarPedido } from "../services/pedidosService";
import { formatearPrecio } from "../utils/format";
import { enfocarPrimerError } from "../utils/forms";
import { hayErrores, validarPedido } from "../utils/validation";

const OPCIONES_ENTREGA = [
    { valor: "RETIRO", etiqueta: "Retiro en el local", detalle: "Pasás a buscarlo" },
    { valor: "ENVIO", etiqueta: "Envío a domicilio", detalle: "Te lo llevamos" }
];

const OPCIONES_PAGO = [
    { valor: "EFECTIVO", etiqueta: "Efectivo" },
    { valor: "TRANSFERENCIA", etiqueta: "Transferencia" },
    { valor: "MERCADO_PAGO", etiqueta: "Mercado Pago" }
];

export default function PedidoPage() {
    useTitulo("Mi pedido");
    const navegar = useNavigate();
    const toast = useToast();
    const { items, total, cambiarCantidad, quitar, vaciar } = useCart();
    const { estaLogueado, usuario } = useAuth();

    const [datos, setDatos] = useState({
        tipoEntrega: "RETIRO",
        direccionEntrega: usuario?.direccion ?? "",
        metodoPago: "EFECTIVO"
    });
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);

    const cambiar = (campo) => (evento) => setDatos((actual) => ({ ...actual, [campo]: evento.target.value }));

    const confirmar = async (evento) => {
        evento.preventDefault();
        const formulario = evento.currentTarget;
        const encontrados = validarPedido(datos);
        setErrores(encontrados);
        if (hayErrores(encontrados)) {
            enfocarPrimerError(formulario);
            toast.error("Revisá los datos de entrega.");
            return;
        }

        setEnviando(true);
        try {
            const pedido = await confirmarPedido(items, datos);
            vaciar();
            toast.exito("¡Listo! Tu pedido quedó registrado.");
            navegar(`/pedido/confirmado/${pedido.id}`, { replace: true });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    if (items.length === 0) {
        return (
            <section className="pagina campo-frutilla">
                <div className="pagina__interior">
                    <EstadoVacio
                        nivel={1}
                        titulo="Tu pedido está vacío"
                        mensaje="Sumá unos churros y volvé acá para confirmarlo."
                        accion={
                            <Button to="/menu" iconoDespues="flecha">
                                Ver el menú
                            </Button>
                        }
                    >
                        <ProductoArte nombre="Churros" />
                    </EstadoVacio>
                </div>
            </section>
        );
    }

    return (
        <section className="pagina campo-frutilla" aria-labelledby="titulo-pedido">
            <div className="pagina__interior">
                <SplitText como="h1" id="titulo-pedido" className="pagina__titulo" texto="Mi pedido" />

                <div className="pedido">
                    <ul className="pedido__items">
                        {items.map((item) => (
                            <Reveal como="li" key={item.productoId} efecto="izquierda" className="pedido-item sticker">
                                <div className="pedido-item__arte">
                                    <ProductoArte nombre={item.nombre} />
                                </div>
                                <div className="pedido-item__datos">
                                    <h2 className="pedido-item__nombre">{item.nombre}</h2>
                                    <p>{formatearPrecio(item.precio)} c/u</p>
                                </div>
                                <div className="pedido-item__cantidad">
                                    <QuantityStepper
                                        valor={item.cantidad}
                                        maximo={item.stock}
                                        alCambiar={(valor) => cambiarCantidad(item.productoId, valor)}
                                        nombre={item.nombre}
                                    />
                                </div>
                                <p className="pedido-item__subtotal">{formatearPrecio(item.precio * item.cantidad)}</p>
                                <Button
                                    className="pedido-item__quitar"
                                    variante="fantasma"
                                    tamano="chico"
                                    icono="basura"
                                    onClick={() => quitar(item.productoId)}
                                    aria-label={`Quitar ${item.nombre} del pedido`}
                                >
                                    Quitar
                                </Button>
                            </Reveal>
                        ))}
                    </ul>

                    <aside className="pedido__resumen sticker" aria-labelledby="titulo-resumen">
                        <h2 className="pedido__resumen-titulo" id="titulo-resumen">
                            Resumen
                        </h2>
                        <p className="pedido__total">
                            <span>Total</span>
                            <strong>{formatearPrecio(total)}</strong>
                        </p>

                        {estaLogueado ? (
                            <form className="formulario" onSubmit={confirmar} noValidate>
                                <OpcionesTarjeta
                                    leyenda="¿Cómo lo recibís?"
                                    nombre="tipoEntrega"
                                    valor={datos.tipoEntrega}
                                    opciones={OPCIONES_ENTREGA}
                                    alCambiar={(valor) => setDatos((actual) => ({ ...actual, tipoEntrega: valor }))}
                                />
                                {datos.tipoEntrega === "ENVIO" && (
                                    <Input
                                        etiqueta="Dirección de entrega"
                                        name="direccionEntrega"
                                        autoComplete="street-address"
                                        value={datos.direccionEntrega}
                                        onChange={cambiar("direccionEntrega")}
                                        error={errores.direccionEntrega}
                                        obligatorio
                                    />
                                )}
                                <Select
                                    etiqueta="¿Cómo pagás?"
                                    name="metodoPago"
                                    value={datos.metodoPago}
                                    onChange={cambiar("metodoPago")}
                                    opciones={OPCIONES_PAGO}
                                    ayuda="El pago se hace al recibir el pedido."
                                />
                                <Button type="submit" tamano="grande" cargando={enviando} iconoDespues="flecha">
                                    Confirmar pedido
                                </Button>
                            </form>
                        ) : (
                            <div className="pedido__ingreso">
                                <p>Para confirmar tu pedido necesitás una cuenta. Tu selección se guarda.</p>
                                <div className="pedido__ingreso-botones">
                                    <Button to="/ingresar" state={{ desde: "/pedido" }}>
                                        Ingresar
                                    </Button>
                                    <Button to="/registrarse" variante="secundario" state={{ desde: "/pedido" }}>
                                        Crear cuenta
                                    </Button>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </section>
    );
}
