import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ErrorPantalla from "./components/layout/ErrorPantalla";
import RequireAuth from "./components/layout/RequireAuth";
import { Cargando } from "./components/ui/Estados";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { ToastProvider } from "./context/ToastContext";

// Cada pantalla se baja cuando se necesita, para que la primera carga sea liviana.
const pagina = (cargar) => async () => ({ Component: (await cargar()).default });

const router = createBrowserRouter([
    {
        path: "/",
        Component: AppLayout,
        ErrorBoundary: ErrorPantalla,
        HydrateFallback: () => <Cargando />,
        // Los errores de una página se muestran dentro del marco del sitio, con cabecera y pie.
        children: [
            {
                ErrorBoundary: ErrorPantalla,
                children: [
                    { index: true, lazy: pagina(() => import("./pages/Home")) },
                    { path: "menu", lazy: pagina(() => import("./pages/MenuPage")) },
                    { path: "menu/:id", lazy: pagina(() => import("./pages/ProductoPage")) },
                    { path: "pedido", lazy: pagina(() => import("./pages/PedidoPage")) },
                    { path: "ingresar", lazy: pagina(() => import("./pages/IngresarPage")) },
                    { path: "registrarse", lazy: pagina(() => import("./pages/RegistrarsePage")) },
                    {
                        Component: RequireAuth,
                        children: [
                            {
                                path: "pedido/confirmado/:id",
                                lazy: pagina(() => import("./pages/PedidoConfirmadoPage"))
                            },
                            { path: "mis-pedidos", lazy: pagina(() => import("./pages/MisPedidosPage")) }
                        ]
                    },
                    {
                        element: <RequireAuth rol="ADMIN" />,
                        children: [
                            {
                                path: "admin",
                                lazy: pagina(() => import("./pages/admin/AdminLayout")),
                                children: [
                                    { index: true, element: <Navigate to="productos" replace /> },
                                    {
                                        path: "productos",
                                        lazy: pagina(() => import("./pages/admin/AdminProductosPage"))
                                    },
                                    {
                                        path: "productos/nuevo",
                                        lazy: pagina(() => import("./pages/admin/ProductoFormPage"))
                                    },
                                    {
                                        path: "productos/:id/editar",
                                        lazy: pagina(() => import("./pages/admin/ProductoFormPage"))
                                    },
                                    { path: "pedidos", lazy: pagina(() => import("./pages/admin/AdminPedidosPage")) }
                                ]
                            }
                        ]
                    },
                    { path: "*", lazy: pagina(() => import("./pages/NotFoundPage")) }
                ]
            }
        ]
    }
]);

export default function App() {
    return (
        <ToastProvider>
            <ConfirmProvider>
                <AuthProvider>
                    <CartProvider>
                        <RouterProvider router={router} />
                    </CartProvider>
                </AuthProvider>
            </ConfirmProvider>
        </ToastProvider>
    );
}
