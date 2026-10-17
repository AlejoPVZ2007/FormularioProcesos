const proceso = document.getElementById("proceso");
        const tipo = document.getElementById("tipo");
        const cantidad = document.getElementById("cantidad");

        proceso.addEventListener("change", () => {
            tipo.replaceChildren(new Option("-- Selecciona una opción --", ""));
            cantidad.readOnly = proceso.value === "mayor";

            if (proceso.value === "mayor") {
                tipo.add(new Option("Nuevo programa"));
                tipo.add(new Option("Nueva sede"));
            } else if (proceso.value === "menor") {
                tipo.add(new Option("Rediseño no sustantivo"));
            }
        });