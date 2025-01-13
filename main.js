document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("students-table");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const modal = document.getElementById("details-modal");
    const closeModal = document.getElementById("close-modal");
    const detailsContainer = document.getElementById("student-details");
    const searchInput = document.getElementById("search-input");
    const panel = document.getElementById("status-panel");
    const overlay = document.querySelector(".overlay");
    const closeButton = panel.querySelector(".close");
    const solveButton = panel.querySelector(".solve");
    const rejectButton = panel.querySelector(".reject");
    const studentNameDisplay = document.getElementById("student-name");


    function cargarDatos(tipo = "Todas", nombre = "") {
        fetch("http://localhost:3000/estudiantes/tabla")
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = "";

                let filteredData = data;

                // Filtrar por tipo
                if (tipo !== "Todas") {
                    filteredData = filteredData.filter(student => student.tipo === tipo);
                }

                // Filtrar por nombre
                if (nombre) {
                    filteredData = filteredData.filter(student =>
                        student.nombre_alumno.toLowerCase().includes(nombre.toLowerCase())
                    );
                }

                filteredData.forEach(student => {
                    const row = document.createElement("tr");
                    row.setAttribute("data-id", student.id_estudiante);

                    const nameCell = document.createElement("td");
                    nameCell.textContent = student.nombre_alumno;
                    row.appendChild(nameCell);

                    const typeCell = document.createElement("td");
                    typeCell.textContent = student.tipo;
                    row.appendChild(typeCell);

                    const emailCell = document.createElement("td");
                    emailCell.textContent = student.email_alumno;
                    row.appendChild(emailCell);

                    const stateCell = document.createElement("td"); // Nueva celda para estado
                    stateCell.textContent = student.estado;
                    row.appendChild(stateCell);

                    const dateCell = document.createElement("td");
                    dateCell.textContent = new Date(student.created_at).toLocaleDateString();
                    row.appendChild(dateCell);

                    const actionsCell = document.createElement("td");

                    // Botón para abrir el panel de estado
                    const stateButton = document.createElement("button");
                    stateButton.innerHTML = '<i class="fas fa-exchange-alt"></i>'; // Ícono para "cambiar estado"
                    stateButton.classList.add("state-btn");
                    stateButton.addEventListener("click", () => {
                        selectedStudentId = student.id_estudiante;
                        studentNameDisplay.textContent = `Nombre: ${student.nombre_alumno}`;
                        abrirPanel();
                    });
                    actionsCell.appendChild(stateButton);

                    row.appendChild(actionsCell);
                    tableBody.appendChild(row);

                    // Botón de editar
                    const editButton = document.createElement("button");
                    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Ícono de lápiz
                    editButton.classList.add("edit-btn");
                    editButton.addEventListener("click", () => {
                        alert(`Editar: ${student.nombre_alumno}`);
                    });
                    actionsCell.appendChild(editButton);

                    // Botón de ver
                    const viewButton = document.createElement("button");
                    viewButton.innerHTML = '<i class="fas fa-eye"></i>'; // Ícono de ojo
                    viewButton.classList.add("view-btn");
                    viewButton.addEventListener("click", () => {
                        mostrarDetalles(student.id_estudiante);
                    });
                    actionsCell.appendChild(viewButton);
                    // Botón de eliminar
                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("delete-btn");
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteButton.addEventListener("click", () => {
                        confirmarEliminar(student.id_estudiante);
                    });
                    actionsCell.appendChild(deleteButton);

                    row.appendChild(actionsCell);
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error al cargar los datos:", error));
    }

    // Buscar datos al escribir en el input de búsqueda
    searchInput.addEventListener("input", () => {
        const nombre = searchInput.value.trim();
        cargarDatos("Todas", nombre);
    });

    // Mostrar detalles en el modal
    function mostrarDetalles(id) {
        fetch(`http://localhost:3000/estudiantes/${id}`)
            .then(response => response.json())
            .then(student => {
                detailsContainer.innerHTML = `
                    <strong>Nombre:</strong> ${student.nombre_alumno}<br>
                    <strong>Tipo:</strong> ${student.tipo}<br>
                    <strong>Email:</strong> ${student.email_alumno}<br>
                    <strong>Estado:</strong> ${student.estado}<br>
                    <strong>Fecha de Creación:</strong> ${new Date(student.created_at).toLocaleDateString()}<br>
                    <strong>Edad:</strong> ${student.edad_pr}<br>
                    <strong>Género:</strong> ${student.genero_pr}<br>
                    <strong>Población:</strong> ${student.poblacion_pr}<br>
                    <strong>Zona:</strong> ${student.zona_pr}<br>
                    <strong>Teléfono:</strong> ${student.numero_telefono}<br>
                    <strong>- Motivo de Solicitud:</strong> ${student.descripcion_at}<br>
                    <strong>Numero de Identificación:</strong> ${student.num_cedula}<br>
                    <strong>Barrio:</strong> ${student.curso_alumno}<br>
                    <strong>Calificación:</strong> ${student.num_calificacion}<br>
                    <strong>- Respuesta a Solicitud :</strong> ${student.motivo}<br>
                `;
                modal.style.display = "block";
            })
            .catch(error => console.error("Error al cargar detalles:", error));
    }

    // Confirmar y eliminar estudiante
    function confirmarEliminar(id) {
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta encuesta?");
        if (confirmacion) {
            eliminarEstudiante(id);
        }
    }

    // Eliminar estudiante
    function eliminarEstudiante(id) {
        fetch(`http://localhost:3000/estudiantes/${id}`, { method: "DELETE" })
            .then(() => {
                alert("Estudiante eliminado.");
                const row = document.querySelector(`tr[data-id='${id}']`);
                if (row) row.remove();
            })
            .catch(error => console.error("Error al eliminar estudiante:", error));
    }

    // Cerrar modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Asignar eventos a los botones de filtro
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const tipo = button.getAttribute("data-type");
            cargarDatos(tipo);
        });
    });

    function abrirPanel() {
        panel.style.display = "block";
        overlay.style.display = "block";
    }

    function cerrarPanel() {
        panel.style.display = "none";
        overlay.style.display = "none";
    }

    function actualizarEstado(nuevoEstado) {
        const motivo = document.getElementById("motivo").value.trim();  // Capturar el motivo ingresado
        if (!selectedStudentId || !motivo) {
            alert("Por favor, ingresa un motivo.");
            return;
        }

        fetch(`http://localhost:3000/estudiantes/${selectedStudentId}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                estado: nuevoEstado,
                motivo: motivo  // Enviar el motivo al backend
            })
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al actualizar el estado.");
                return response.json();
            })
            .then(() => {
                alert(`Estado cambiado a ${nuevoEstado}.`);
                cargarDatos("Todas");
                cerrarPanel();
            })
            .catch(error => console.error("Error al actualizar estado:", error));
    }

    closeButton.addEventListener("click", cerrarPanel);
    overlay.addEventListener("click", cerrarPanel);
    solveButton.addEventListener("click", () => actualizarEstado("Solucionado"));
    rejectButton.addEventListener("click", () => actualizarEstado("Rechazado"));

    // Cargar todos los datos al inicio
    cargarDatos("Todas");
});