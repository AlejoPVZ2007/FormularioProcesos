const proceso = document.getElementById("proceso");
const tipo = document.getElementById("tipo");
const cantidad = document.getElementById("cantidad");
const nivelAcademico = document.getElementById("nivelAcademico");
const sedes = document.querySelector(".sedes");
const costoCursos = document.getElementById("costo-cursos");
const costoRevision = document.getElementById("costo-revision");
const otraConsulta = document.getElementById("otraConsulta");
const codigoProceso = document.getElementById("codigo-proceso");
const costoBase = document.getElementById("costo-base");
const costoEtapa1 = document.getElementById("costo-etapa1");
const costosBasePorTipo = {
    "nuevo-programa": "$300.00",
    "nueva-sede": "$100.00",
    "nuevo-programa-y-nueva-sede": "$400.00",
    "rediseno-no-sustantivo": "$350.00"
};

function crearPlaceholder(texto) {
    const placeholder = new Option(texto, "", true, true);
    placeholder.disabled = true;
    placeholder.hidden = true;
    return placeholder;
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
    if (proceso.value !== "menor") return;

    const costoBaseActual = Number(costosBasePorTipo[tipo.value]?.replace("$", ""));
    const numeroCursos = Number(cantidad.value) || 0;
    const total = costoBaseActual + numeroCursos * 100;

    costoEtapa1.value = `$ ${total.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

nivelAcademico.addEventListener("change", () => {
    actualizarOpcionesCantidad();
    actualizarCostoEtapa1();
});
cantidad.addEventListener("change", actualizarCostoEtapa1);

proceso.addEventListener("change", () => {
    tipo.replaceChildren(crearPlaceholder("-- Selecciona Tipo de Proceso --"));
    costoBase.textContent = "";
    costoEtapa1.value = costoEtapa1.defaultValue;
    codigoProceso.textContent = proceso.value === "mayor" ? "A" : proceso.value === "menor" ? "B" : "";
    const esMenor = proceso.value === "menor";
    const habilitarSedes = proceso.value === "mayor";
    nivelAcademico.disabled = !esMenor;
    cantidad.disabled = !esMenor;
    nivelAcademico.value = "";
    actualizarOpcionesCantidad();
    sedes.disabled = !habilitarSedes;
    costoCursos.value = esMenor ? "$0.00" : costoCursos.defaultValue;
    costoRevision.value = esMenor ? "$0.00" : costoRevision.defaultValue;

    if (proceso.value === "mayor") {
        tipo.add(new Option("Nuevo programa", "nuevo-programa"));
        tipo.add(new Option("Nueva sede", "nueva-sede"));
        tipo.add(new Option("Nuevo programa y nueva sede", "nuevo-programa-y-nueva-sede"));
    } else if (esMenor) {
        sedes.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = false;
        });
        tipo.add(new Option("Rediseño no sustantivo", "rediseno-no-sustantivo"));
        tipo.value = "rediseno-no-sustantivo";
        tipo.dispatchEvent(new Event("change"));
    }
});

tipo.addEventListener("change", () => {
    costoBase.textContent = costosBasePorTipo[tipo.value] || "";
    actualizarCostoEtapa1();
});

otraConsulta.addEventListener("click", () => {
    proceso.value = "";
    codigoProceso.textContent = "";
    costoBase.textContent = "";
    costoEtapa1.value = costoEtapa1.defaultValue;
    tipo.replaceChildren(crearPlaceholder("-- Selecciona Tipo de Proceso --"));
    nivelAcademico.value = "";
    nivelAcademico.disabled = true;
    cantidad.disabled = true;
    actualizarOpcionesCantidad();
    sedes.disabled = true;
    costoCursos.value = costoCursos.defaultValue;
    costoRevision.value = costoRevision.defaultValue;

    sedes.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
    });
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