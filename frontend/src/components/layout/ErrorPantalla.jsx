import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Button from "../ui/Button";
import ProductoArte from "../ui/ProductoArte";

// Pantalla de último recurso: si algo se rompe al dibujar una página, el sitio no queda en blanco.
export default function ErrorPantalla() {
    const error = useRouteError();
    const noExiste = isRouteErrorResponse(error) && error.status === 404;

    return (
        <section className="pagina campo-frutilla" role="alert">
            <div className="pagina__interior">
                <div className="estado estado--vacio">
                    <ProductoArte nombre="Churros" />
                    <h1 className="estado__titulo">
                        {noExiste ? "Esta página no existe" : "Algo se quemó en la cocina"}
                    </h1>
                    <p>
                        {noExiste
                            ? "Puede que el enlace esté mal escrito."
                            : "Tuvimos un problema al mostrar esta pantalla. Probá recargar o volver al inicio."}
                    </p>
                    <div className="pagina__acciones">
                        <Button onClick={() => window.location.reload()}>Recargar</Button>
                        <Button to="/" variante="secundario">
                            Volver al inicio
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
