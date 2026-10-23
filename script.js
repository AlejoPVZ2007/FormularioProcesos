const proceso = document.getElementById("proceso");
const tipo = document.getElementById("tipo");
const cantidad = document.getElementById("cantidad");
const nivelAcademico = document.getElementById("nivelAcademico");
const nivelAcademico2 = document.getElementById("nivelAcademico2");
const sedes = document.querySelector(".sedes");
const costoBase2 = document.getElementById("costo-base");
const costoCursos = document.getElementById("costo-cursos");
const costoRevision = document.getElementById("costo-revision");
const costoVisita = document.getElementById("costo-visita");
const otraConsulta = document.getElementById("otraConsulta");
const codigoProceso = document.getElementById("codigo-proceso");
const costoBase = document.getElementById("costo-base-proceso");
const costoEtapa1 = document.getElementById("costo-etapa1");
const costoEtapa2 = document.getElementById("costo-etapa2");
const tipoCambio = document.getElementById("tipo-cambio");
const totalDolares = document.getElementById("total-dolares");
const totalSoles = document.getElementById("total-soles");
const resumenAplicacion = document.getElementById("resumen-aplicacion");
const resumenRevision = document.getElementById("resumen-revision");
const resumenVisita = document.getElementById("resumen-visita");
const resumenVisitaSubtotal = document.getElementById("resumen-visita-subtotal");
const costosBasePorTipo = {
    "nuevo-programa": "$400.00",
    "nueva-sede": "$750.00",
    "rediseno-no-sustantivo": "$350.00"
};

function crearPlaceholder(texto) {
    const placeholder = new Option(texto, "", true, true);
    placeholder.disabled = true;
    placeholder.hidden = true;
    return placeholder;
}

function obtenerMonto(valor) {
    const monto = Number(valor.replace(/[^\d.-]/g, ""));
    return Number.isFinite(monto) ? monto : 0;
}

function actualizarCostosTotales() {
    const total = [costoEtapa1, costoEtapa2, costoVisita]
        .reduce((suma, costo) => suma + obtenerMonto(costo.value), 0);
    const tipoCambioActual = obtenerMonto(tipoCambio.value);

    resumenAplicacion.textContent = costoEtapa1.value;
    resumenRevision.textContent = costoEtapa2.value;
    resumenVisita.textContent = costoVisita.value;
    resumenVisitaSubtotal.textContent = costoVisita.value;
    totalDolares.value = `$ ${total.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    totalSoles.value = `S/ ${(total * tipoCambioActual).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function actualizarOpcionesCantidad() {
    cantidad.replaceChildren(crearPlaceholder("-- Seleccionar número de cursos --"));
    const maximo = nivelAcademico.value === "pregrado" ? 10 : nivelAcademico.value ? 5 : 0;

    if (maximo === 0) {
        cantidad.options[0].textContent = "-- Selecciona primero el nivel académico --";
        return;
    }

    for (let numero = 0; numero <= maximo; numero += 1) {
        cantidad.add(new Option(String(numero), String(numero)));
    }
}

function actualizarCostoEtapa1() {
    if (proceso.value !== "menor" && proceso.value !== "mayor") return;

    const costoBaseTipo = costosBasePorTipo[tipo.value];
    if (!costoBaseTipo) {
        costoEtapa1.value = costoEtapa1.defaultValue;
        actualizarCostosTotales();
        return;
    }

    const costoBaseActual = Number(costoBaseTipo.replace("$", ""));
    const cantidadAdicional = proceso.value === "menor"
        ? (Number(cantidad.value) || 0) * 100
        : sedes.querySelectorAll('input[type="checkbox"]:checked:not(#sede-distancia)').length * 750;
    const total = costoBaseActual + cantidadAdicional;

    costoEtapa1.value = `$ ${total.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    actualizarCostosTotales();
}

function actualizarCostoEtapa2() {
    const total = [costoBase2, costoCursos, costoRevision].reduce((suma, costo) => {
        return suma + Number(costo.value.replace(/[^\d.-]/g, ""));
    }, 0);

    costoEtapa2.value = `$ ${total.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    actualizarCostosTotales();
}

function actualizarCostoCursosPorNivel() {
    if (proceso.value !== "mayor") return;

    const costoBasePorNivel = nivelAcademico2.value === "doctorado" ? 1600 : 1000;
    costoBase2.value = `$${costoBasePorNivel.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    costoCursos.value = nivelAcademico2.value === "pregrado" ? "$1,000.00" : "$500.00";
    costoRevision.value = nivelAcademico2.value === "doctorado" ? "$1,200.00" : "$1,000.00";
    actualizarCostoEtapa2();
}

actualizarCostoEtapa2();
actualizarCostosTotales();

nivelAcademico.addEventListener("change", () => {
    actualizarOpcionesCantidad();
    actualizarCostoEtapa1();
});
cantidad.addEventListener("change", actualizarCostoEtapa1);
nivelAcademico2.addEventListener("change", actualizarCostoCursosPorNivel);

proceso.addEventListener("change", () => {
    tipo.replaceChildren(crearPlaceholder("-- Selecciona Tipo de Proceso --"));
    costoBase.textContent = "";
    costoEtapa1.value = costoEtapa1.defaultValue;
    codigoProceso.textContent = proceso.value === "mayor"
        ? "El proceso toma aproximadamente 11 meses."
        : proceso.value === "menor"
            ? "El proceso toma aproximadamente 2 meses."
            : "";
    const esMenor = proceso.value === "menor";
    const habilitarSedes = proceso.value === "mayor";
    costoVisita.value = proceso.value === "mayor" ? "$12,500.00" : "$0.00";
    costoBase2.value = costoBase2.defaultValue;
    actualizarCostosTotales();
    nivelAcademico.disabled = !esMenor;
    nivelAcademico2.disabled = proceso.value !== "mayor";
    cantidad.disabled = !esMenor;
    nivelAcademico.value = "";
    nivelAcademico2.value = "";
    actualizarOpcionesCantidad();
    sedes.disabled = !habilitarSedes;
    costoCursos.value = esMenor ? "$0.00" : costoCursos.defaultValue;
    costoRevision.value = esMenor ? "$0.00" : costoRevision.defaultValue;
    actualizarCostoEtapa2();

    if (proceso.value === "mayor") {
        tipo.add(new Option("Nuevo programa", "nuevo-programa"));
        tipo.add(new Option("Nueva sede", "nueva-sede"));
    } else if (esMenor) {
        sedes.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = false;
        });
        tipo.add(new Option("Rediseño no sustantivo", "rediseno-no-sustantivo"));
        tipo.value = "rediseno-no-sustantivo";
        tipo.dispatchEvent(new Event("change"));
    }
    actualizarCostosTotales();
});

tipo.addEventListener("change", () => {
    costoBase.textContent = costosBasePorTipo[tipo.value] || "";
    const esNuevaSede = tipo.value === "nueva-sede";
    if (esNuevaSede) {
        sedes.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = false;
        });
    }
    sedes.disabled = proceso.value !== "mayor" || esNuevaSede;
    actualizarCostoEtapa1();
});

sedes.addEventListener("change", actualizarCostoEtapa1);

otraConsulta.addEventListener("click", () => {
    proceso.value = "";
    codigoProceso.textContent = "";
    costoBase.textContent = "";
    costoEtapa1.value = costoEtapa1.defaultValue;
    costoVisita.value = "$0.00";
    tipo.replaceChildren(crearPlaceholder("-- Selecciona Tipo de Proceso --"));
    nivelAcademico.value = "";
    nivelAcademico.disabled = true;
    nivelAcademico2.value = "";
    nivelAcademico2.disabled = true;
    costoBase2.value = costoBase2.defaultValue;
    cantidad.disabled = true;
    actualizarOpcionesCantidad();
    sedes.disabled = true;
    costoCursos.value = costoCursos.defaultValue;
    costoRevision.value = costoRevision.defaultValue;
    actualizarCostoEtapa2();

    sedes.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
    });
    actualizarCostosTotales();
});

(async function contadorVisitas() {
    const el = document.getElementById("visitas");
    if (!el) return;

    const esLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname);
    const contador = el.closest(".contador-visitas");
    if (!contador) return;

    if (esLocal) contador.hidden = false;

    try {
        const workspace = "alejopvz2007s-team-5964";
        const clave = "first-counter-5964";
        const yaContado = esLocal ? null : sessionStorage.getItem("visita-contada");
        const accion = !esLocal && !yaContado ? "/up" : "";

        const res = await fetch(
            `https://api.counterapi.dev/v2/${workspace}/${clave}${accion}`
        );
        if (!res.ok) throw new Error("Respuesta " + res.status);

        const data = await res.json();
        const total = data.count ?? data.value ?? data.data?.up_count;
        if (total === undefined) throw new Error("Formato inesperado");

        if (!esLocal && !yaContado) {
            sessionStorage.setItem("visita-contada", "1");
        }

        if (esLocal) el.textContent = Number(total).toLocaleString("es-PE");
    } catch (error) {
        if (esLocal) el.textContent = "—";
        console.error("No se pudo cargar el contador de visitas", error);
    }
})();