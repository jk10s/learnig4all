const express = require('express');
const mysql = require('mysql2');
const path = require('path');

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

// Ruta para el inicio de sesión
app.get('/sesion', (req, res) => {
    res.render('sesion', {
        mensajeError: null
    });
});

app.post('/iniciar-sesion', (req, res) => {
    const {
        email,
        password
    } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
    const values = [email, password];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            res.render('sesion', {
                mensajeError: 'Error al iniciar sesión.'
            });
        } else {
            if (results.length > 0) {
                // El usuario ha iniciado sesión correctamente
                // Puedes redirigirlo a la página principal u otra página de tu elección
                res.redirect('/'); // Ejemplo: redirige a la página principal
            } else {
                // Las credenciales son incorrectas
                res.render('sesion', {
                    mensajeError: 'Credenciales incorrectas.'
                });
            }
        }
    });
});


// Configuración de la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('index');
});
// Ruta para mostrar la página de registro
app.get('/registrarse.html', (req, res) => {
    res.render('registrarse'); // Renderiza el archivo "registrarse.ejs"
});
app.get('/courses.html', (req, res) => {
    res.render('courses');
});
app.get('/about.html', (req, res) => {
    res.render('about');
});

app.get('/sesion.html', (req, res) => {
    res.render('sesion');
});

app.get('/course-details.html', (req, res) => {
    res.render('course-details');
});

app.get('/usuarios.html', (req, res) => {
    res.render('usuarios');
});

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});