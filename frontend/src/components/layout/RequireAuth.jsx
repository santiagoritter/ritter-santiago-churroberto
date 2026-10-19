import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Cargando } from "../ui/Estados";
import { EstadoVacio } from "../ui/Estados";
import Button from "../ui/Button";

// Protege un grupo de rutas: exige sesión y, si se pide, un rol.
export default function RequireAuth({ rol }) {
    const { estaLogueado, usuario, cargando } = useAuth();
    const ubicacion = useLocation();

    if (cargando) return <Cargando etiqueta="Verificando tu sesión" />;

    if (!estaLogueado) {
        return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname }} />;
    }

    if (rol && usuario.rol !== rol) {
        return (
            <section className="pagina">
                <EstadoVacio
                    nivel={1}
                    titulo="Esta sección es solo para el equipo del local"
                    mensaje="Tu cuenta no tiene permiso para entrar acá."
                    accion={<Button to="/">Volver al inicio</Button>}
                />
            </section>
        );
    }

    return <Outlet />;
}
