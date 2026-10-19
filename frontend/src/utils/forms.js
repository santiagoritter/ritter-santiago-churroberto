// Después de un envío con errores, el foco va al primer campo inválido.
export const enfocarPrimerError = (formulario) => {
    setTimeout(() => formulario?.querySelector('[aria-invalid="true"]')?.focus(), 0);
};
