import Categoria from "../models/Categoria.js";
import Producto from "../models/Producto.js";
import Usuario from "../models/Usuario.js";
import Carrito from "../models/Carrito.js";
import Local from "../models/Local.js";
import Resena from "../models/Resena.js";
import { Roles } from "../enums/Roles.js";
import { config } from "../utils/config.js";
import { hashearContrasenaSync } from "../utils/password.js";
import CategoriaRepository from "./CategoriaRepository.js";
import ProductoRepository from "./ProductoRepository.js";
import UsuarioRepository from "./UsuarioRepository.js";
import CarritoRepository from "./CarritoRepository.js";
import PedidoRepository from "./PedidoRepository.js";
import LocalRepository from "./LocalRepository.js";
import ResenaRepository from "./ResenaRepository.js";

const REPOSITORIOS = [
    CategoriaRepository,
    ProductoRepository,
    UsuarioRepository,
    CarritoRepository,
    PedidoRepository,
    LocalRepository,
    ResenaRepository
];

// TODO: el menú, los precios y el stock son DE EJEMPLO. El local no publica su carta:
// reemplazarlos por los datos reales (o cargarlos desde el panel de administración).
const cargarMenuDeEjemplo = () => {
    const churros = CategoriaRepository.save(new Categoria(null, "Churros", "Churros fritos al momento."));
    const rellenos = CategoriaRepository.save(
        new Categoria(null, "Rellenos", "Rellenos de dulce de leche o chocolate.")
    );
    const combos = CategoriaRepository.save(new Categoria(null, "Combos", "Docenas surtidas para compartir."));
    const facturas = CategoriaRepository.save(new Categoria(null, "Facturas", "Facturas de panadería."));

    const productos = [
        ["Churros clásicos (docena)", "Fritos y recién hechos.", 9000, 60, churros.id],
        ["Churros clásicos (media docena)", "Para una merienda de a dos.", 6500, 60, churros.id],
        ["Rellenos de dulce de leche (docena)", "Se rellenan al momento.", 12000, 40, rellenos.id],
        ["Rellenos de chocolate (docena)", "Se rellenan al momento.", 12000, 40, rellenos.id],
        ["Docena surtida", "Mitad dulce de leche, mitad chocolate.", 12500, 40, combos.id],
        ["Facturas (unidad)", "Consultá las del día en el local.", 1200, 100, facturas.id]
    ];
    productos.forEach(([nombre, descripcion, precio, stock, categoriaId]) => {
        ProductoRepository.save(new Producto(null, nombre, descripcion, precio, null, stock, categoriaId));
    });
};

const cargarAdministrador = () => {
    const administrador = new Usuario(
        null,
        "Administrador",
        "Churroberto",
        config.adminEmail,
        null,
        hashearContrasenaSync(config.adminPassword),
        null,
        new Date().toISOString(),
        Roles.ADMIN
    );
    UsuarioRepository.save(administrador);
    CarritoRepository.save(new Carrito(null, administrador.id, new Date().toISOString(), []));
};

// Datos verificables en listados públicos del local. El teléfono y el WhatsApp no se encontraron.
const cargarLocal = () => {
    LocalRepository.save(
        new Local(
            null,
            "Churrería Churroberto",
            "José Pascual Tamborini 6186",
            "Villa Urquiza",
            "Ciudad Autónoma de Buenos Aires",
            -34.572705,
            -58.5038684,
            null,
            null,
            // dias usa la numeración de JavaScript: 0 es domingo y 1 es lunes.
            [
                {
                    etiqueta: "Martes a domingo",
                    dias: [2, 3, 4, 5, 6, 0],
                    franjas: [
                        { desde: "08:00", hasta: "12:00" },
                        { desde: "15:30", hasta: "19:00" }
                    ]
                },
                { etiqueta: "Lunes", dias: [1], franjas: [] }
            ],
            "Churros artesanales hechos a la vista, con relleno de dulce de leche o chocolate."
        )
    );
};

// TODO: textos tomados de reseñas públicas en internet; confirmar con el dueño antes de publicarlos.
const cargarResenas = () => {
    const fuente = "Reseña pública en internet";
    [
        "Excelente lugar para comprar churros, sin dudas son los mejores del barrio y probablemente de la ciudad.",
        "Los hacen a la vista, si uno llega temprano lo ve al dueño y a sus familiares haciendo el trabajo artesanal. Muy recomendable, y a un precio muy accesible.",
        "Excelentes churros… mejor que la costa."
    ].forEach((texto) => {
        ResenaRepository.save(new Resena(null, "Cliente del barrio", texto, null, fuente));
    });
};

export const cargarDatosIniciales = () => {
    REPOSITORIOS.forEach((repositorio) => repositorio.clear());
    cargarMenuDeEjemplo();
    cargarAdministrador();
    cargarLocal();
    cargarResenas();
};

export default cargarDatosIniciales;
