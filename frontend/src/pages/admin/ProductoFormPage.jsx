import { useEffect, useRef, useState } from "react";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Cargando, EstadoError } from "../../components/ui/Estados";
import { Input, Select, Textarea } from "../../components/ui/Field";
import { useConfirm } from "../../context/ConfirmContext";
import { useToast } from "../../context/ToastContext";
import { useAsync } from "../../hooks/useAsync";
import { useTitulo } from "../../hooks/useTitulo";
import { listarCategorias } from "../../services/categoriasService";
import { actualizarProducto, crearProducto, obtenerProducto } from "../../services/productosService";
import { enfocarPrimerError } from "../../utils/forms";
import { hayErrores, validarProducto } from "../../utils/validation";

const VACIO = { nombre: "", descripcion: "", precio: "", stock: "0", categoriaId: "", imagen: "" };

// Sirve para crear (/nuevo) y para editar (/:id/editar).
export default function ProductoFormPage() {
    const { id } = useParams();
    const editando = Boolean(id);
    useTitulo(editando ? "Editar producto" : "Nuevo producto");
    const navegar = useNavigate();
    const toast = useToast();
    const confirmar = useConfirm();

    const [datos, setDatos] = useState(VACIO);
    const [inicial, setInicial] = useState(VACIO);
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);

    // Si hay cambios sin guardar, salir de la pantalla pide confirmación.
    const guardado = useRef(false);
    const hayCambios = useRef(false);
    const preguntando = useRef(false);

    // El valor se actualiza después de cada render y lo lee el bloqueador cuando alguien intenta salir.
    useEffect(() => {
        hayCambios.current = !guardado.current && JSON.stringify(datos) !== JSON.stringify(inicial);
    }, [datos, inicial]);

    const bloqueador = useBlocker(
        ({ currentLocation, nextLocation }) => hayCambios.current && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        if (bloqueador.state !== "blocked" || preguntando.current) return;
        preguntando.current = true;
        confirmar({
            titulo: "¿Salir sin guardar?",
            mensaje: "Tenés cambios que todavía no guardaste. Si salís ahora, se pierden.",
            confirmar: "Salir sin guardar",
            cancelar: "Seguir editando",
            peligro: true
        }).then((acepto) => {
            preguntando.current = false;
            if (acepto) bloqueador.proceed();
            else bloqueador.reset();
        });
    }, [bloqueador, confirmar]);

    useEffect(() => {
        const avisar = (evento) => {
            if (hayCambios.current) evento.preventDefault();
        };
        window.addEventListener("beforeunload", avisar);
        return () => window.removeEventListener("beforeunload", avisar);
    }, []);

    const categorias = useAsync((signal) => listarCategorias({ signal }));
    const producto = useAsync((signal) => (editando ? obtenerProducto(id, { signal }) : Promise.resolve(null)), [id]);

    useEffect(() => {
        if (!producto.datos) return;
        const { nombre, descripcion, precio, stock, categoriaId, imagen } = producto.datos;
        const cargado = {
            nombre,
            descripcion,
            precio: String(precio),
            stock: String(stock),
            categoriaId: String(categoriaId),
            imagen: imagen ?? ""
        };
        setDatos(cargado);
        setInicial(cargado);
    }, [producto.datos]);

    const cambiar = (campo) => (evento) => setDatos((actual) => ({ ...actual, [campo]: evento.target.value }));

    const enviar = async (evento) => {
        evento.preventDefault();
        const formulario = evento.currentTarget;
        const encontrados = validarProducto(datos);
        setErrores(encontrados);
        if (hayErrores(encontrados)) {
            enfocarPrimerError(formulario);
            toast.error("Revisá los campos marcados.");
            return;
        }

        const cuerpo = {
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion.trim(),
            precio: Number(datos.precio),
            stock: Number(datos.stock),
            categoriaId: Number(datos.categoriaId),
            imagen: datos.imagen.trim() || null
        };

        setEnviando(true);
        try {
            if (editando) await actualizarProducto(id, cuerpo);
            else await crearProducto(cuerpo);
            toast.exito(editando ? "Guardamos los cambios." : `Creaste “${cuerpo.nombre}”.`);
            guardado.current = true;
            hayCambios.current = false;
            navegar("/admin/productos");
        } catch (error) {
            toast.error(error.message);
            setEnviando(false);
        }
    };

    if (producto.cargando || categorias.cargando) return <Cargando etiqueta="Cargando el formulario" />;
    const fallo = producto.error ?? categorias.error;
    if (fallo) {
        return (
            <EstadoError
                mensaje={fallo.message}
                alReintentar={() => {
                    producto.recargar();
                    categorias.recargar();
                }}
            />
        );
    }

    const opciones = categorias.datos.map((categoria) => ({ valor: String(categoria.id), etiqueta: categoria.nombre }));

    return (
        <div className="admin__contenido">
            <h2 className="admin__subtitulo">{editando ? "Editar producto" : "Nuevo producto"}</h2>
            <form className="formulario sticker sticker--formulario" onSubmit={enviar} noValidate>
                <Input
                    etiqueta="Nombre"
                    name="nombre"
                    autoComplete="off"
                    value={datos.nombre}
                    onChange={cambiar("nombre")}
                    error={errores.nombre}
                    obligatorio
                />
                <Textarea
                    etiqueta="Descripción"
                    name="descripcion"
                    autoComplete="off"
                    value={datos.descripcion}
                    onChange={cambiar("descripcion")}
                />
                <div className="formulario__fila">
                    <Input
                        etiqueta="Precio en pesos"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="any"
                        name="precio"
                        autoComplete="off"
                        value={datos.precio}
                        onChange={cambiar("precio")}
                        error={errores.precio}
                        obligatorio
                    />
                    <Input
                        etiqueta="Stock"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        step="1"
                        name="stock"
                        autoComplete="off"
                        value={datos.stock}
                        onChange={cambiar("stock")}
                        error={errores.stock}
                        obligatorio
                    />
                </div>
                <Select
                    etiqueta="Categoría"
                    name="categoriaId"
                    value={datos.categoriaId}
                    onChange={cambiar("categoriaId")}
                    opciones={opciones}
                    placeholder="Elegí una categoría"
                    error={errores.categoriaId}
                    obligatorio
                />
                <Input
                    etiqueta="Imagen (opcional)"
                    type="url"
                    name="imagen"
                    autoComplete="off"
                    spellCheck={false}
                    value={datos.imagen}
                    onChange={cambiar("imagen")}
                    ayuda="Si lo dejás vacío, el sitio usa un dibujo del producto."
                />
                <div className="formulario__acciones">
                    <Button type="submit" cargando={enviando}>
                        {editando ? "Guardar cambios" : "Crear producto"}
                    </Button>
                    <Button to="/admin/productos" variante="secundario">
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
