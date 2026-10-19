const ICONOS = {
    carrito: (
        <>
            <path d="M3 4h2.3l1.8 11.4a1.5 1.5 0 0 0 1.5 1.3h8a1.5 1.5 0 0 0 1.5-1.1L19.7 8H6" />
            <circle cx="9.5" cy="20" r="1.2" />
            <circle cx="16.5" cy="20" r="1.2" />
        </>
    ),
    usuario: (
        <>
            <circle cx="12" cy="8" r="3.6" />
            <path d="M4.5 20.5c.8-3.6 3.8-5.6 7.5-5.6s6.7 2 7.5 5.6" />
        </>
    ),
    mas: <path d="M12 5v14M5 12h14" />,
    menos: <path d="M5 12h14" />,
    basura: <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5" />,
    cerrar: <path d="M6 6l12 12M18 6L6 18" />,
    check: <path d="M5 12.5l4.5 4.5L19 7" />,
    alerta: <path d="M12 4l9.5 16h-19L12 4zM12 10v4.5M12 17.4v.01" />,
    info: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5.5M12 7.6v.01" />
        </>
    ),
    flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
    flechaIzquierda: <path d="M19 12H5M11 6l-6 6 6 6" />,
    diagonal: <path d="M7 17L17 7M8 7h9v9" />,
    pin: (
        <>
            <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
            <circle cx="12" cy="10" r="2.3" />
        </>
    ),
    reloj: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    lapiz: <path d="M4 20l1.2-4.2L16 5a2.1 2.1 0 0 1 3 3L8.2 18.8 4 20zM14 7l3 3" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    salir: <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9M15 8l4 4-4 4M19 12H9" />
};

export default function Icon({ nombre, tamano = 22, className }) {
    return (
        <svg
            className={className}
            width={tamano}
            height={tamano}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {ICONOS[nombre]}
        </svg>
    );
}
