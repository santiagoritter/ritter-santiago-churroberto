class Usuario {
    constructor(id, nombre, apellido, email, telefono, contrasena, direccion, fechaRegistro, rol) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.contrasena = contrasena;
        this.direccion = direccion;
        this.fechaRegistro = fechaRegistro;
        this.rol = rol;
    }
}

export default Usuario;
