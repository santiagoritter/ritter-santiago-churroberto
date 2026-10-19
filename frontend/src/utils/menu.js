export const ORDENES = Object.freeze([
    { valor: "menu", etiqueta: "Como en el menú" },
    { valor: "precio-asc", etiqueta: "Menor precio primero" },
    { valor: "precio-desc", etiqueta: "Mayor precio primero" },
    { valor: "nombre", etiqueta: "Nombre, de la A a la Z" }
]);

// Para buscar sin que importen las mayúsculas ni los acentos.
const normalizar = (texto) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const ordenar = (lista, orden) => {
    const copia = [...lista];
    if (orden === "precio-asc") copia.sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") copia.sort((a, b) => b.precio - a.precio);
    if (orden === "nombre") copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    return copia;
};

// Se arma una sola vez por carga del menú: el texto en el que se busca ya viene sin acentos ni mayúsculas.
export const indexarProductos = (productos) =>
    productos.map((producto) => ({ producto, clave: normalizar(`${producto.nombre} ${producto.descripcion}`) }));

// Los productos que se ven según la categoría, lo que se buscó y el orden elegido.
export const filtrarProductos = (indexados, { categoriaId, busqueda, orden }) => {
    const texto = normalizar(busqueda.trim());
    const coinciden = indexados
        .filter(
            ({ producto, clave }) =>
                (!categoriaId || producto.categoriaId === categoriaId) && (!texto || clave.includes(texto))
        )
        .map(({ producto }) => producto);
    return ordenar(coinciden, orden);
};
