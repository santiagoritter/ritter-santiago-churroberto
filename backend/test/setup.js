// Debe importarse antes que la app: define el entorno de pruebas antes de leer la configuración.
process.env.NODE_ENV = "test";
process.env.BCRYPT_ROUNDS = "4";
process.env.JWT_SECRET = "secreto-solo-para-tests";
process.env.ADMIN_EMAIL = "admin@churroberto.com";
process.env.ADMIN_PASSWORD = "admin-de-prueba-123";
