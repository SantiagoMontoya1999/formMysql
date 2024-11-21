const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: "sql206.infinityfree.com", // Host remoto
    user: "if0_37755257",           // Usuario de la base de datos
    password: "i5QH0nDlna7",        // Contraseña de la base de datos
    database: "if0_37755257_nodejs", // Nombre de la base de datos
    port: "3306" // Asegúrate de que sea el nombre correcto de tu base de datos
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conexión exitosa a la base de datos.");
});

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
// 1. Obtener todos los estudiantes
app.get("/estudiantes", (req, res) => {
    const query = "SELECT * FROM estudiantes";
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. Agregar un nuevo estudiante
app.post("/estudiantes", (req, res) => {
    const { nombre_alumno, email_alumno, curso_alumno, num_calificacion, num_cedula, descripcion_at, numero_telefono } = req.body;
    const query = `
        INSERT INTO estudiantes (nombre_alumno, email_alumno, curso_alumno, num_calificacion, num_cedula, descripcion_at, numero_telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [nombre_alumno, email_alumno, curso_alumno, num_calificacion, num_cedula, descripcion_at, numero_telefono], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Estudiante agregado.");
    });
});

// 3. Editar un estudiante
app.put("/estudiantes/:id", (req, res) => {
    const { id } = req.params;
    const { nombre_alumno, email_alumno, curso_alumno, num_calificacion, num_cedula, descripcion_at, numero_telefono } = req.body;
    const query = `
        UPDATE estudiantes
        SET nombre_alumno = ?, email_alumno = ?, curso_alumno = ?, num_calificacion = ?, num_cedula = ?, descripcion_at = ?, numero_telefono = ?
        WHERE id_estudiante = ?`;
    db.query(query, [nombre_alumno, email_alumno, curso_alumno, num_calificacion, num_cedula, descripcion_at, numero_telefono, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Estudiante actualizado.");
    });
});

// 4. Eliminar un estudiante
app.delete("/estudiantes/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM estudiantes WHERE id_estudiante = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Estudiante eliminado.");
    });
});

// 5. Obtener datos para gráfico de calificaciones
app.get("/grafico-calificaciones", (req, res) => {
    const query = `
        SELECT num_calificacion, COUNT(*) AS cantidad
        FROM estudiantes
        GROUP BY num_calificacion`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 6. Obtener datos para gráfico de cursos
app.get("/grafico-cursos", (req, res) => {
    const query = `
        SELECT curso_alumno, COUNT(*) AS cantidad
        FROM estudiantes
        GROUP BY curso_alumno`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Servidor en escucha
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});