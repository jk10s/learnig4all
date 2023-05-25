const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.urlencoded({
    extended: true
}));

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'learning',
});

// Ruta para manejar el registro de usuarios
app.post('/registrar', (req, res) => {
    const {
        nombre,
        email,
        password
    } = req.body;

    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    const values = [nombre, email, password];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al guardar el usuario:', error);
            res.send('Error al registrar el usuario.');
        } else {
            console.log('Usuario registrado exitosamente.');
            res.send('Usuario registrado exitosamente.');
        }

        connection.end(); // Cierra la conexión después de realizar la consulta
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la plataforma de registro de usuarios!');
});

app.get('/usuarios.html', (req, res) => {
    res.sendFile(__dirname + '/usuarios.html');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});