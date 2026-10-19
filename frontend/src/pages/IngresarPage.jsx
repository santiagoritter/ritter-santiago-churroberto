import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import SplitText from "../components/effects/SplitText";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTitulo } from "../hooks/useTitulo";
import { enfocarPrimerError } from "../utils/forms";
import { hayErrores, validarIngreso } from "../utils/validation";

export default function IngresarPage() {
    useTitulo("Ingresar");
    const { iniciarSesion, estaLogueado } = useAuth();
    const toast = useToast();
    const navegar = useNavigate();
    const ubicacion = useLocation();
    const desde = ubicacion.state?.desde;

    const [datos, setDatos] = useState({ email: "", contrasena: "" });
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);

    if (estaLogueado && !enviando) return <Navigate to={desde ?? "/"} replace />;

    const cambiar = (campo) => (evento) => setDatos((actual) => ({ ...actual, [campo]: evento.target.value }));

    const enviar = async (evento) => {
        evento.preventDefault();
        const formulario = evento.currentTarget;
        const encontrados = validarIngreso(datos);
        setErrores(encontrados);
        if (hayErrores(encontrados)) {
            enfocarPrimerError(formulario);
            return;
        }

        setEnviando(true);
        try {
            const usuario = await iniciarSesion({ email: datos.email.trim(), contrasena: datos.contrasena });
            toast.exito(`¡Hola, ${usuario.nombre}!`);
            navegar(desde ?? (usuario.rol === "ADMIN" ? "/admin/productos" : "/"), { replace: true });
        } catch (error) {
            toast.error(error.message);
            setEnviando(false);
        }
    };

    return (
        <section className="pagina campo-celeste" aria-labelledby="titulo-ingresar">
            <div className="pagina__interior pagina__interior--angosto">
                <SplitText como="h1" id="titulo-ingresar" className="pagina__titulo" texto="Ingresar" />
                <form className="formulario sticker sticker--formulario" onSubmit={enviar} noValidate>
                    <Input
                        etiqueta="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        inputMode="email"
                        spellCheck={false}
                        value={datos.email}
                        onChange={cambiar("email")}
                        error={errores.email}
                        obligatorio
                    />
                    <Input
                        etiqueta="Contraseña"
                        type="password"
                        name="contrasena"
                        autoComplete="current-password"
                        value={datos.contrasena}
                        onChange={cambiar("contrasena")}
                        error={errores.contrasena}
                        obligatorio
                    />
                    <Button type="submit" tamano="grande" cargando={enviando}>
                        Ingresar
                    </Button>
                </form>
                <p className="pagina__pie">
                    ¿Es tu primera vez?{" "}
                    <Link to="/registrarse" state={{ desde }}>
                        Creá tu cuenta
                    </Link>
                </p>
            </div>
        </section>
    );
}
