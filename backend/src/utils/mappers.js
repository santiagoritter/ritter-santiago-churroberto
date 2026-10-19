// Nunca se devuelve el hash de la contraseña al cliente.
export const toUsuarioPublico = (usuario) => ({
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    fechaRegistro: usuario.fechaRegistro,
    rol: usuario.rol
});
