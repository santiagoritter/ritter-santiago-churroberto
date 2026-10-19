import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import SplitText from "../components/effects/SplitText";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTitulo } from "../hooks/useTitulo";
import { enfocarPrimerError } from "../utils/forms";
import { hayErrores, validarRegistro } from "../utils/validation";

const INICIAL = { nombre: "", apellido: "", email: "", telefono: "", direccion: "", contrasena: "" };

export default function RegistrarsePage() {
    useTitulo("Crear cuenta");
    const { registrarse, estaLogueado } = useAuth();
    const toast = useToast();
    const navegar = useNavigate();
    const desde = useLocation().state?.desde;

    const [datos, setDatos] = useState(INICIAL);
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);

    if (estaLogueado && !enviando) return <Navigate to={desde ?? "/"} replace />;

    const cambiar = (campo) => (evento) => setDatos((actual) => ({ ...actual, [campo]: evento.target.value }));

    const enviar = async (evento) => {
        evento.preventDefault();
        const formulario = evento.currentTarget;
        const encontrados = validarRegistro(datos);
        setErrores(encontrados);
        if (hayErrores(encontrados)) {
            enfocarPrimerError(formulario);
            toast.error("Revisá los campos marcados.");
            return;
        }

        setEnviando(true);
        try {
            const usuario = await registrarse({
                ...datos,
                email: datos.email.trim(),
                nombre: datos.nombre.trim(),
                apellido: datos.apellido.trim()
            });
            toast.exito(`¡Bienvenido, ${usuario.nombre}! Tu cuenta está lista.`);
            navegar(desde ?? "/", { replace: true });
        } catch (error) {
            toast.error(error.message);
            setEnviando(false);
        }
    };

    return (
        <section className="pagina campo-manteca" aria-labelledby="titulo-registro">
            <div className="pagina__interior pagina__interior--angosto">
                <SplitText como="h1" id="titulo-registro" className="pagina__titulo" texto="Crear cuenta" />
                <form className="formulario sticker sticker--formulario" onSubmit={enviar} noValidate>
                    <div className="formulario__fila">
                        <Input
                            etiqueta="Nombre"
                            name="nombre"
                            autoComplete="given-name"
                            value={datos.nombre}
                            onChange={cambiar("nombre")}
                            error={errores.nombre}
                            obligatorio
                        />
                        <Input
                            etiqueta="Apellido"
                            name="apellido"
                            autoComplete="family-name"
                            value={datos.apellido}
                            onChange={cambiar("apellido")}
                            error={errores.apellido}
                            obligatorio
                        />
                    </div>
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
                        etiqueta="Teléfono"
                        type="tel"
                        name="telefono"
                        autoComplete="tel"
                        inputMode="tel"
                        value={datos.telefono}
                        onChange={cambiar("telefono")}
                        error={errores.telefono}
                        ayuda="Lo usamos solo para coordinar la entrega."
                        obligatorio
                    />
                    <Input
                        etiqueta="Dirección (opcional)"
                        name="direccion"
                        autoComplete="street-address"
                        value={datos.direccion}
                        onChange={cambiar("direccion")}
                        ayuda="Si querés envíos a domicilio, la guardamos para tus próximos pedidos."
                    />
                    <Input
                        etiqueta="Contraseña"
                        type="password"
                        name="contrasena"
                        autoComplete="new-password"
                        value={datos.contrasena}
                        onChange={cambiar("contrasena")}
                        error={errores.contrasena}
                        ayuda="Al menos 8 caracteres."
                        obligatorio
                    />
                    <Button type="submit" tamano="grande" cargando={enviando}>
                        Crear cuenta
                    </Button>
                </form>
                <p className="pagina__pie">
                    ¿Ya tenés cuenta?{" "}
                    <Link to="/ingresar" state={{ desde }}>
                        Ingresá
                    </Link>
                </p>
            </div>
        </section>
    );
}
