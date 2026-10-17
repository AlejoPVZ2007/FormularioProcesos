const proceso = document.getElementById("proceso");
        const tipo = document.getElementById("tipo");
        const cantidad = document.getElementById("cantidad");
        const nivelAcademico = document.getElementById("nivelAcademico");
        const otraConsulta = document.getElementById("otraConsulta");

        proceso.addEventListener("change", () => {
            tipo.replaceChildren(new Option("-- Selecciona una opción --", ""));
            cantidad.readOnly = proceso.value === "mayor";

            if (proceso.value === "mayor") {
                cantidad.value = "";
                tipo.add(new Option("Nuevo programa"));
                tipo.add(new Option("Nueva sede"));
            } else if (proceso.value === "menor") {
                tipo.add(new Option("Rediseño no sustantivo"));
            }
        });

        otraConsulta.addEventListener("click", () => {
            proceso.value = "";
            tipo.replaceChildren(new Option("-- Selecciona Tipo de Proceso --", ""));
            nivelAcademico.value = "";
            cantidad.value = "";
            cantidad.readOnly = false;

            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                checkbox.checked = false;
            });
        });