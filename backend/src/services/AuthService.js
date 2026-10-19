import Usuario from "../models/Usuario.js";
import Carrito from "../models/Carrito.js";
import { Messages } from "../enums/Messages.js";
import { Roles } from "../enums/Roles.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../exceptions/AppError.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import CarritoRepository from "../repositories/CarritoRepository.js";
import { compararContrasena, hashearContrasena, hashearContrasenaSync } from "../utils/password.js";
import { firmarToken } from "../utils/token.js";
import { toUsuarioPublico } from "../utils/mappers.js";

// Se compara contra un hash falso cuando el email no existe, para que ambos casos tarden lo mismo.
const HASH_FALSO = hashearContrasenaSync("contrasena-que-nadie-usa");

const armarSesion = (usuario) => ({
    usuario: toUsuarioPublico(usuario),
    token: firmarToken(usuario)
});

class AuthService {
    async registrar(datos) {
        if (UsuarioRepository.findByEmail(datos.email)) {
            throw new ConflictError(Messages.EMAIL_ALREADY_REGISTERED);
        }
        const hash = await hashearContrasena(datos.contrasena);
        const fecha = new Date().toISOString();
        const usuario = UsuarioRepository.save(
            new Usuario(null, datos.nombre, datos.apellido, datos.email, datos.telefono, hash, datos.direccion, fecha, Roles.CLIENTE)
        );
        CarritoRepository.save(new Carrito(null, usuario.id, fecha, []));
        return armarSesion(usuario);
    }

    async iniciarSesion({ email, contrasena }) {
        const usuario = UsuarioRepository.findByEmail(email);
        const esValida = await compararContrasena(contrasena, usuario?.contrasena ?? HASH_FALSO);
        if (!usuario || !esValida) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }
        return armarSesion(usuario);
    }

    perfil(usuarioId) {
        const usuario = UsuarioRepository.findById(usuarioId);
        if (!usuario) {
            throw new NotFoundError(Messages.USER_NOT_FOUND);
        }
        return toUsuarioPublico(usuario);
    }
}

export default new AuthService();
