import Button from "../components/ui/Button";
import { EstadoVacio } from "../components/ui/Estados";
import ProductoArte from "../components/ui/ProductoArte";
import { useTitulo } from "../hooks/useTitulo";

export default function NotFoundPage() {
    useTitulo("No encontramos esa página");

    return (
        <section className="pagina campo-frutilla">
            <div className="pagina__interior">
                <EstadoVacio
                    nivel={1}
                    titulo="Esta página se quemó en el aceite"
                    mensaje="No existe o se movió. Volvé al inicio y seguimos."
                    accion={
                        <Button to="/" iconoDespues="flecha">
                            Volver al inicio
                        </Button>
                    }
                >
                    <ProductoArte nombre="Churros" />
                </EstadoVacio>
            </div>
        </section>
    );
}
