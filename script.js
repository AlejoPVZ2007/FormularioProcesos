const proceso = document.getElementById("proceso");
const tipo = document.getElementById("tipo");
const cantidad = document.getElementById("cantidad");
const nivelAcademico = document.getElementById("nivelAcademico");
const sedes = document.querySelector(".sedes");
const costoCursos = document.getElementById("costo-cursos");
const costoRevision = document.getElementById("costo-revision");
const otraConsulta = document.getElementById("otraConsulta");

cantidad.addEventListener("input", () => {
    cantidad.value = cantidad.value.replace(/\D/g, "");
});

proceso.addEventListener("change", () => {
    tipo.replaceChildren(new Option("-- Selecciona Tipo de Proceso --", ""));
    cantidad.readOnly = proceso.value === "mayor";
    const bloquearSedesYNivel = proceso.value === "menor";
    sedes.disabled = bloquearSedesYNivel;
    nivelAcademico.disabled = bloquearSedesYNivel;
    costoCursos.value = bloquearSedesYNivel ? "$0.00" : costoCursos.defaultValue;
    costoRevision.value = bloquearSedesYNivel ? "$0.00" : costoRevision.defaultValue;

    if (proceso.value === "mayor") {
        cantidad.value = "";
        tipo.add(new Option("Nuevo programa"));
        tipo.add(new Option("Nueva sede"));
    } else if (proceso.value === "menor") {
        sedes.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = false;
        });
        nivelAcademico.value = "";
        tipo.add(new Option("Rediseño no sustantivo"));
    }
});

otraConsulta.addEventListener("click", () => {
    proceso.value = "";
    tipo.replaceChildren(new Option("-- Selecciona Tipo de Proceso --", ""));
    nivelAcademico.value = "";
    nivelAcademico.disabled = false;
    cantidad.value = "";
    cantidad.readOnly = false;
    sedes.disabled = false;
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