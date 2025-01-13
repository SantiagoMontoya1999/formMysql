const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1087",
    database: "nodejs",
    port: "3306"
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

// 2. Agregar un nuevo estudiante (incluye las nuevas columnas)
app.post("/estudiantes", (req, res) => {
    const { 
        nombre_alumno, 
        email_alumno, 
        curso_alumno, 
        num_calificacion, 
        num_cedula, 
        descripcion_at, 
        numero_telefono, 
        edad_pr, 
        genero_pr, 
        poblacion_pr, 
        zona_pr, 
        tipo, 
        estado,  // Nueva columna
        motivo,  // Nueva columna
        created_at
    } = req.body;

    const query = `
        INSERT INTO estudiantes (
            nombre_alumno, email_alumno, curso_alumno, num_calificacion, 
            num_cedula, descripcion_at, numero_telefono, edad_pr, 
            genero_pr, poblacion_pr, zona_pr, tipo, estado, motivo, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        nombre_alumno, email_alumno, curso_alumno, num_calificacion, 
        num_cedula, descripcion_at, numero_telefono, edad_pr, 
        genero_pr, poblacion_pr, zona_pr, tipo, estado, motivo, created_at
    ], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Estudiante agregado.");
    });
});

// 3. Editar un estudiante (incluye las nuevas columnas)
app.put("/estudiantes/:id", (req, res) => {
    const { id } = req.params;
    const { 
        nombre_alumno, 
        email_alumno, 
        curso_alumno, 
        num_calificacion, 
        num_cedula, 
        descripcion_at, 
        numero_telefono, 
        edad_pr, 
        genero_pr, 
        poblacion_pr, 
        zona_pr, 
        tipo, 
        estado,  // Nueva columna
        motivo,  // Nueva columna
        created_at
    } = req.body;

    const query = `
        UPDATE estudiantes
        SET 
            nombre_alumno = ?, 
            email_alumno = ?, 
            curso_alumno = ?, 
            num_calificacion = ?, 
            num_cedula = ?, 
            descripcion_at = ?, 
            numero_telefono = ?, 
            edad_pr = ?, 
            genero_pr = ?, 
            poblacion_pr = ?, 
            zona_pr = ?,
            tipo = ?, 
            estado = ?,  // Nueva columna
            motivo = ?,  // Nueva columna
            created_at = ?
        WHERE id_estudiante = ?`;

    db.query(query, [
        nombre_alumno, email_alumno, curso_alumno, num_calificacion, 
        num_cedula, descripcion_at, numero_telefono, edad_pr, 
        genero_pr, poblacion_pr, zona_pr, tipo, estado, motivo, created_at, id
    ], (err, result) => {
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


// Obtener datos de la tabla estudiantes simplificados
app.get("/estudiantes/tabla", (req, res) => {
    const query = "SELECT nombre_alumno, tipo, email_alumno, created_at, id_estudiante, estado FROM estudiantes";
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Obtener estudiante por ID
app.get("/estudiantes/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM estudiantes WHERE id_estudiante = ?";
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send("Estudiante no encontrado.");
        res.json(results[0]);
    });
});

app.put('/estudiantes/:id/estado', (req, res) => {
    const { estado, motivo } = req.body;
    const { id } = req.params;

    // Actualizar estado y motivo en la base de datos
    const query = `
        UPDATE estudiantes 
        SET estado = ?, motivo = ? 
        WHERE id_estudiante = ?
    `;
    
    db.query(query, [estado, motivo, id], (error, results) => {
        if (error) {
            console.error("Error al actualizar estado:", error);
            return res.status(500).json({ error: "Error al actualizar estado." });
        }
        res.status(200).json({ message: "Estado y motivo actualizados correctamente." });
    });
});


// Servidor en escucha
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});