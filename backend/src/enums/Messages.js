export const Messages = Object.freeze({
    // Generales
    INVALID_DATA: "Los datos enviados son inválidos.",
    INVALID_ID: "El identificador enviado es inválido.",
    DUPLICATED_RESOURCE: "El recurso ya existe.",
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INTERNAL_ERROR: "Ocurrió un error inesperado. Intentá de nuevo más tarde.",
    TOO_MANY_REQUESTS: "Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo.",
    ENV_MISSING: "Faltan variables de entorno obligatorias para producción: JWT_SECRET y ADMIN_PASSWORD.",

    // Autenticación y permisos
    TOKEN_REQUIRED: "Tenés que iniciar sesión para continuar.",
    TOKEN_INVALID: "Tu sesión no es válida o venció. Iniciá sesión de nuevo.",
    FORBIDDEN: "No tenés permiso para realizar esta acción.",
    INVALID_CREDENTIALS: "El email o la contraseña son incorrectos.",
    EMAIL_ALREADY_REGISTERED: "Ya existe una cuenta con ese email.",
    USER_NOT_FOUND: "El usuario no existe.",

    // Validaciones de campos
    NAME_REQUIRED: "El nombre es obligatorio.",
    LAST_NAME_REQUIRED: "El apellido es obligatorio.",
    EMAIL_INVALID: "El email no es válido.",
    PASSWORD_INVALID: "La contraseña debe tener al menos 8 caracteres.",
    PHONE_INVALID: "El teléfono no es válido.",
    PRICE_INVALID: "El precio debe ser un número mayor a 0.",
    STOCK_INVALID: "El stock debe ser un número entero mayor o igual a 0.",
    QUANTITY_INVALID: "La cantidad debe ser un número entero mayor a 0.",
    CATEGORY_REQUIRED: "La categoría es obligatoria.",
    DELIVERY_TYPE_INVALID: "El tipo de entrega debe ser RETIRO o ENVIO.",
    PAYMENT_METHOD_INVALID: "El método de pago debe ser EFECTIVO, TRANSFERENCIA o MERCADO_PAGO.",
    ADDRESS_REQUIRED: "La dirección de entrega es obligatoria para los envíos.",
    STATUS_INVALID: "El estado del pedido no es válido.",

    // Productos
    PRODUCT_NOT_FOUND: "El producto no existe.",
    PRODUCT_DUPLICATED: "Ya existe un producto con ese nombre.",
    PRODUCT_OUT_OF_STOCK: "No hay stock suficiente de este producto.",

    // Categorías
    CATEGORY_NOT_FOUND: "La categoría no existe.",
    CATEGORY_DUPLICATED: "Ya existe una categoría con ese nombre.",
    CATEGORY_HAS_PRODUCTS: "No se puede eliminar una categoría que tiene productos.",

    // Carrito
    CART_ITEM_NOT_FOUND: "El producto no está en el carrito.",
    CART_EMPTY: "El carrito está vacío.",

    // Pedidos
    ORDER_NOT_FOUND: "El pedido no existe.",
    ORDER_INVALID_TRANSITION: "El pedido no puede pasar a ese estado desde el estado actual.",
    ORDER_CANNOT_CANCEL: "Solo se puede cancelar un pedido pendiente.",

    // Local y reseñas
    LOCAL_NOT_FOUND: "No hay información cargada del local."
});

export default Messages;
