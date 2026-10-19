import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Estrella from "../ui/Estrella";
import Icon from "../ui/Icon";

export default function Header() {
    const { cantidadTotal } = useCart();
    const { estaLogueado, esAdmin, cerrarSesion } = useAuth();
    const [abierto, setAbierto] = useState(false);
    const { pathname, hash } = useLocation();

    // El menú del celular se cierra al navegar.
    useEffect(() => setAbierto(false), [pathname, hash]);

    return (
        <header className="cabecera">
            <nav className="cabecera__isla" aria-label="Principal">
                <Link to="/" className="logo" viewTransition aria-label="Churroberto, ir al inicio">
                    <span className="logo__marca">
                        <Estrella tamano={26} />
                    </span>
                    <span className="logo__nombre" translate="no">
                        Churroberto
                    </span>
                </Link>

                <ul className="cabecera__enlaces" id="menu-principal" data-abierto={abierto}>
                    <li>
                        <NavLink to="/menu" viewTransition>
                            Menú
                        </NavLink>
                    </li>
                    <li>
                        <Link to="/#como-se-hace">Cómo se hace</Link>
                    </li>
                    <li>
                        <Link to="/#local">El local</Link>
                    </li>
                    {esAdmin && (
                        <li>
                            <NavLink to="/admin/productos" viewTransition>
                                Administrar
                            </NavLink>
                        </li>
                    )}
                    {estaLogueado ? (
                        <>
                            <li>
                                <NavLink to="/mis-pedidos" viewTransition>
                                    Mis pedidos
                                </NavLink>
                            </li>
                            <li>
                                <button type="button" className="cabecera__salir" onClick={cerrarSesion}>
                                    <Icon nombre="salir" tamano={18} />
                                    Salir
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <NavLink to="/ingresar" viewTransition>
                                Ingresar
                            </NavLink>
                        </li>
                    )}
                </ul>

                <div className="cabecera__acciones">
                    <Link
                        to="/pedido"
                        className="carrito-boton"
                        viewTransition
                        aria-label={`Mi pedido, ${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"}`}
                    >
                        <Icon nombre="carrito" />
                        <span className="carrito-boton__cuenta" key={cantidadTotal} aria-hidden="true">
                            {cantidadTotal}
                        </span>
                    </Link>
                    <button
                        type="button"
                        className="cabecera__menu"
                        aria-expanded={abierto}
                        aria-controls="menu-principal"
                        onClick={() => setAbierto((actual) => !actual)}
                    >
                        <Icon nombre={abierto ? "cerrar" : "menu"} />
                        <span className="visualmente-oculto">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
                    </button>
                </div>
            </nav>
        </header>
    );
}
