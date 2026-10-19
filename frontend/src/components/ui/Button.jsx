import { Link } from "react-router-dom";
import Icon from "./Icon";
import Spinner from "./Spinner";

// Un solo botón para toda la app. Si recibe `to` es un enlace de la app, si recibe `href` un enlace externo.
export default function Button({
    variante = "primario",
    tamano = "normal",
    icono,
    iconoDespues,
    cargando = false,
    to,
    href,
    type = "button",
    className = "",
    children,
    ...resto
}) {
    const clases = `boton boton--${variante} boton--${tamano} ${className}`.trim();
    const contenido = (
        <>
            {cargando ? <Spinner etiqueta="Procesando" tamano={20} /> : icono && <Icon nombre={icono} />}
            <span className="boton__texto">{children}</span>
            {iconoDespues && !cargando && <Icon nombre={iconoDespues} />}
        </>
    );

    if (to) {
        return (
            <Link className={clases} to={to} viewTransition {...resto}>
                {contenido}
            </Link>
        );
    }
    if (href) {
        return (
            <a className={clases} href={href} {...resto}>
                {contenido}
            </a>
        );
    }
    return (
        <button
            className={clases}
            type={type}
            disabled={cargando || resto.disabled}
            aria-busy={cargando || undefined}
            {...resto}
        >
            {contenido}
        </button>
    );
}
