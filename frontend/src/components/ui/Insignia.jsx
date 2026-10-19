// Etiqueta de estado. El color nunca es lo único que informa: siempre lleva texto.
export default function Insignia({ tono = "neutro", children }) {
    return <span className={`insignia insignia--${tono}`}>{children}</span>;
}
