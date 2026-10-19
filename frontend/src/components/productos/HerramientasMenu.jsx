import Filtros from "../ui/Filtros";
import { Input, Select } from "../ui/Field";
import { ORDENES } from "../../utils/menu";

// Categorías, buscador, orden y el conteo de lo que se está viendo.
export default function HerramientasMenu({ categorias, filtros, cantidadVisible, cantidadTotal }) {
    const { categoriaId, busqueda, orden, cambiar, hayFiltros } = filtros;

    return (
        <>
            <div className="herramientas">
                <Filtros
                    etiqueta="Filtrar por categoría"
                    valor={categoriaId ?? "todo"}
                    opciones={[
                        { valor: "todo", etiqueta: "Todo" },
                        ...categorias.map((categoria) => ({ valor: categoria.id, etiqueta: categoria.nombre }))
                    ]}
                    alElegir={(valor) => cambiar({ categoria: valor === "todo" ? null : valor })}
                />
                <div className="herramientas__controles">
                    <Input
                        etiqueta="Buscar en el menú"
                        type="search"
                        name="q"
                        autoComplete="off"
                        spellCheck={false}
                        value={busqueda}
                        onChange={(evento) => cambiar({ q: evento.target.value })}
                    />
                    <Select
                        etiqueta="Ordenar por"
                        name="orden"
                        value={orden}
                        opciones={ORDENES}
                        onChange={(evento) =>
                            cambiar({ orden: evento.target.value === "menu" ? null : evento.target.value })
                        }
                    />
                </div>
            </div>

            <p className="herramientas__conteo" role="status">
                {cantidadVisible} {cantidadVisible === 1 ? "producto" : "productos"}
                {hayFiltros && cantidadTotal !== cantidadVisible ? ` de ${cantidadTotal}` : ""}
            </p>
        </>
    );
}
