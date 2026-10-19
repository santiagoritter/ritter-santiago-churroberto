// La estrella del perfil del churro, girando.
export default function Spinner({ etiqueta = "Cargando", tamano = 28 }) {
    return (
        <span className="spinner" role="status">
            <svg width={tamano} height={tamano} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
                <polygon
                    points="37,20 31.8,22.9 36.6,28.5 28.4,27.4 28.7,35.5 22.1,31.4 19.7,38.8 17.4,31.4 10.8,35.5 11.1,27.4 2.9,28.5 7.7,22.9 2.5,20 7.7,17.1 2.9,11.5 11.1,12.6 10.8,4.5 17.4,8.6 20,1.2 22.1,8.6 28.7,4.5 28.4,12.6 36.6,11.5 31.8,17.1"
                    fill="currentColor"
                />
            </svg>
            <span className="visualmente-oculto">{etiqueta}</span>
        </span>
    );
}
