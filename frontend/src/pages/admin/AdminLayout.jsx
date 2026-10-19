import { NavLink, Outlet } from "react-router-dom";

// Marco común del panel: dos pestañas y el contenido de cada una.
export default function AdminLayout() {
    return (
        <section className="pagina campo-celeste admin" aria-labelledby="titulo-admin">
            <div className="pagina__interior">
                <h1 className="pagina__titulo pagina__titulo--chico" id="titulo-admin">
                    Panel del local
                </h1>
                <nav className="admin__pestanas" aria-label="Secciones del panel">
                    <NavLink to="/admin/productos" className="admin__pestana">
                        Productos
                    </NavLink>
                    <NavLink to="/admin/pedidos" className="admin__pestana">
                        Pedidos
                    </NavLink>
                </nav>
                <Outlet />
            </div>
        </section>
    );
}
