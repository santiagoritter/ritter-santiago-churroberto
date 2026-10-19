const ZONA = "America/Argentina/Buenos_Aires";
const DIAS_CORTOS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const NOMBRES_DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const aMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
};

const formatoBuenosAires = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
});

// Hora y día actuales en Buenos Aires, sin importar la zona del navegador.
const ahoraEnBuenosAires = (fecha) => {
    const partes = formatoBuenosAires.formatToParts(fecha);
    const valor = (tipo) => partes.find((parte) => parte.type === tipo)?.value ?? "0";
    return {
        dia: DIAS_CORTOS[valor("weekday")],
        minutos: Number(valor("hour")) * 60 + Number(valor("minute"))
    };
};

const franjasDelDia = (horarios, dia) =>
    horarios
        .filter((horario) => horario.dias.includes(dia))
        .flatMap((horario) => horario.franjas)
        .sort((a, b) => aMinutos(a.desde) - aMinutos(b.desde));

export const estadoDelLocal = (horarios, fecha = new Date()) => {
    const { dia, minutos } = ahoraEnBuenosAires(fecha);
    const franjas = franjasDelDia(horarios, dia);

    const abierta = franjas.find((f) => minutos >= aMinutos(f.desde) && minutos < aMinutos(f.hasta));
    if (abierta) {
        return { abierto: true, texto: `Abierto hasta las ${abierta.hasta}` };
    }

    const proxima = franjas.find((f) => aMinutos(f.desde) > minutos);
    if (proxima) {
        return { abierto: false, texto: `Cerrado ahora, abre a las ${proxima.desde}` };
    }

    for (let salto = 1; salto <= 7; salto += 1) {
        const diaSiguiente = (dia + salto) % 7;
        const siguientes = franjasDelDia(horarios, diaSiguiente);
        if (siguientes.length > 0) {
            const cuando = salto === 1 ? "mañana" : `el ${NOMBRES_DIAS[diaSiguiente]}`;
            return { abierto: false, texto: `Cerrado ahora, abre ${cuando} a las ${siguientes[0].desde}` };
        }
    }
    return { abierto: false, texto: "Cerrado" };
};

export const formatearFranjas = (franjas) =>
    franjas.length === 0 ? "Cerrado" : franjas.map((f) => `${f.desde} a ${f.hasta}`).join(" y ");
