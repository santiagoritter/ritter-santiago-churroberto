import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import { Cargando, EstadoError, EstadoVacio } from "../../components/ui/Estados";
import { Input } from "../../components/ui/Field";
import Insignia from "../../components/ui/Insignia";
import { useConfirm } from "../../context/ConfirmContext";
import { useToast } from "../../context/ToastContext";
import { useAsync } from "../../hooks/useAsync";
import { useTitulo } from "../../hooks/useTitulo";
import { listarCategorias } from "../../services/categoriasService";
import { eliminarProducto, listarProductos } from "../../services/productosService";
import { formatearPrecio } from "../../utils/format";

export default function AdminProductosPage() {
    useTitulo("Administrar productos");
    const toast = useToast();
    const confirmar = useConfirm();
    const [eliminando, setEliminando] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const { datos, error, cargando, recargar } = useAsync(async (signal) => {
        const [productos, categorias] = await Promise.all([listarProductos({ signal }), listarCategorias({ signal })]);
        return { productos, categorias };
    });

    const visibles = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        if (!datos || !texto) return datos?.productos ?? [];
        return datos.productos.filter((producto) => producto.nombre.toLowerCase().includes(texto));
    }, [datos, busqueda]);

    const eliminar = async (producto) => {
        const acepto = await confirmar({
            titulo: `¿Eliminar “${producto.nombre}”?`,
            mensaje: "Sale del menú y de los carritos donde esté. Los pedidos ya hechos no cambian.",
            confirmar: "Sí, eliminar",
            cancelar: "No, conservar",
            peligro: true
        });
        if (!acepto) return;

        setEliminando(producto.id);
        try {
            await eliminarProducto(producto.id);
            toast.exito(`Eliminaste “${producto.nombre}”.`);
            recargar();
        } catch (fallo) {
            toast.error(fallo.message);
        } finally {
            setEliminando(null);
        }
    };

    return (
        <div className="admin__contenido">
            <div className="admin__cabecera">
                <h2 className="admin__subtitulo">Productos del menú</h2>
                <Button to="/admin/productos/nuevo" icono="mas">
                    Nuevo producto
                </Button>
            </div>

            {cargando && <Cargando etiqueta="Cargando los productos" />}
            {error && <EstadoError mensaje={error.message} alReintentar={recargar} />}

            {datos?.productos.length === 0 && (
                <EstadoVacio
                    titulo="Todavía no hay productos"
                    mensaje="Cargá el primero para que aparezca en el menú."
                    accion={
                        <Button to="/admin/productos/nuevo" icono="mas">
                            Nuevo producto
                        </Button>
                    }
                />
            )}

            {datos?.productos.length > 0 && (
                <div className="herramientas herramientas--admin">
                    <Input
                        etiqueta="Buscar un producto"
                        type="search"
                        autoComplete="off"
                        spellCheck={false}
                        value={busqueda}
                        onChange={(evento) => setBusqueda(evento.target.value)}
                    />
                    <p className="herramientas__conteo" role="status">
                        {visibles.length} de {datos.productos.length}
                    </p>
                </div>
            )}

            {datos?.productos.length > 0 && visibles.length === 0 && (
                <EstadoVacio titulo="Ningún producto coincide" nivel={3} />
            )}

            {visibles.length > 0 && (
                <div className="tabla-envoltorio">
                    <table className="tabla">
                        <caption className="visualmente-oculto">Productos del menú</caption>
                        <thead>
                            <tr>
                                <th scope="col">Producto</th>
                                <th scope="col">Categoría</th>
                                <th scope="col" className="tabla__numero">
                                    Precio
                                </th>
                                <th scope="col" className="tabla__numero">
                                    Stock
                                </th>
                                <th scope="col">
                                    <span className="visualmente-oculto">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibles.map((producto) => (
                                <tr key={producto.id}>
                                    <th scope="row">{producto.nombre}</th>
                                    <td>
                                        {datos.categorias.find((c) => c.id === producto.categoriaId)?.nombre ??
                                            "Sin categoría"}
                                    </td>
                                    <td className="tabla__numero">{formatearPrecio(producto.precio)}</td>
                                    <td className="tabla__numero">
                                        {producto.stock}
                                        {producto.stock === 0 && <Insignia tono="error">Agotado</Insignia>}
                                        {producto.stock > 0 && producto.stock <= 10 && (
                                            <Insignia tono="aviso">Poco stock</Insignia>
                                        )}
                                    </td>
                                    <td className="tabla__acciones">
                                        <Button
                                            to={`/admin/productos/${producto.id}/editar`}
                                            variante="secundario"
                                            tamano="chico"
                                            icono="lapiz"
                                            aria-label={`Editar ${producto.nombre}`}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variante="peligro"
                                            tamano="chico"
                                            icono="basura"
                                            cargando={eliminando === producto.id}
                                            onClick={() => eliminar(producto)}
                                            aria-label={`Eliminar ${producto.nombre}`}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
