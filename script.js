const proceso = document.getElementById("proceso");
        const tipo = document.getElementById("tipo");

        proceso.addEventListener("change", () => {
            tipo.replaceChildren(new Option("-- Selecciona una opción --", ""));

            if (proceso.value === "mayor") {
                tipo.add(new Option("Nuevo programa", "A"));
                tipo.add(new Option("Nueva sede", "B"));
            } else if (proceso.value === "menor") {
                tipo.add(new Option("Rediseño no sustantivo", "A"));
            }
        });