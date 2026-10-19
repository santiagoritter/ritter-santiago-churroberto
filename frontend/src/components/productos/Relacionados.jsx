import FichaProducto from "./FichaProducto";

// Otros productos del menú para seguir mirando, debajo del detalle.
export default function Relacionados({ productos, nombresDeCategoria }) {
    if (productos.length === 0) return null;

    return (
        <section className="relacionados" aria-labelledby="titulo-relacionados">
            <h2 className="relacionados__titulo" id="titulo-relacionados">
                También te puede gustar
            </h2>
            <ul className="rejilla-fichas">
                {productos.map((otro, indice) => (
                    <li key={otro.id}>
                        <FichaProducto
                            producto={otro}
                            categoria={nombresDeCategoria.get(otro.categoriaId) ?? ""}
                            indice={indice + 1}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}
