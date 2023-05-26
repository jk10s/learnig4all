const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.urlencoded({
    extended: true
}));

const session = require('express-session');

app.use(session({
    secret: 'mi-secreto',
    resave: false,
    saveUninitialized: true
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
    });
});
// Ruta para el inicio de sesión
app.get('/sesion.html', (req, res) => {
    res.render('sesion', {
        mensajeError: null
    });
});
// Ruta para el inicio de sesión
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
                const nombreUsuario = results[0].nombre;
                const tipoUsuario = results[0].tipo;

                if (tipoUsuario === 'administrador') {
                    // Redireccionar a la página de administrador
                    res.render('pagina-administrador', {
                        nombreUsuario
                    });
                } else if (tipoUsuario === 'estudiante') {
                    // Redireccionar a la página de estudiante
                    res.render('bienvenido', {
                        nombreUsuario
                    });
                }
            } else {
                // Las credenciales son incorrectas
                res.render('sesion', {
                    mensajeError: 'Credenciales incorrectas.'
                });
            }
        }
    });
});


// Ruta para agregar un nuevo curso
app.post('/cursos/agregar', (req, res) => {
    const {
        nombre,
        descripcion
    } = req.body;

    const query = 'INSERT INTO cursos (nombre, descripcion) VALUES (?, ?)';
    const values = [nombre, descripcion];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al agregar el curso:', error);
            res.send('Error al agregar el curso.');
        } else {
            console.log('Curso agregado exitosamente.');

            // Mostrar el mensaje de éxito utilizando SweetAlert y redirigir a la página de administrar cursos
            const successMessage = encodeURIComponent('Curso agregado exitosamente.');
            const redirectURL = '/administrar-cursos' + '?mensaje=' + successMessage;
            res.redirect(redirectURL);
        }
    });
});


app.get('/cursos', (req, res) => {
    const query = 'SELECT * FROM cursos';
    connection.query(query, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al obtener los cursos');
        } else {
            res.render('cursos', {
                nombreUsuario: req.session.nombreUsuario,
                cursos: results
            });
        }
    });
});

app.get('/perfil', (req, res) => {
    // Verificar si el usuario está autenticado
    if (req.session.nombreUsuario) {
        // Obtener el email del usuario de la sesión
        const correoUsuario = req.session.correoUsuario;
        // Realizar una consulta a la base de datos para obtener la información del usuario
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        connection.query(query, [correoUsuario], (error, results) => {
            if (error) {
                throw error;
            }
            // Renderizar la página de perfil y pasar los datos del usuario como variables
            res.render('/perfil', {
                usuario: results[0]
            });
        });
    } else {
        // Si el usuario no está autenticado, redireccionar al inicio de sesión
        res.redirect('/');
    }
});

// Ruta para administrar estudiantes
// Ruta para administrar estudiantes
app.get('/administrar-estudiantes', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).send('Error al obtener los usuarios.');
        } else {
            res.render('administrar_estudiantes', {
                usuarios: results
            });
        }
    });
});

// Ruta para eliminar un estudiante
app.get('/estudiantes/eliminar/:id', (req, res) => {
    const estudianteId = req.params.id;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    const values = [estudianteId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al eliminar el estudiante:', error);
            res.send('Error al eliminar el estudiante.');
        } else {
            console.log('Estudiante eliminado exitosamente.');

            // Mostrar el mensaje de éxito utilizando SweetAlert y redirigir a la página de administrar estudiantes
            const successMessage = encodeURIComponent('Estudiante eliminado exitosamente.');
            const redirectURL = '/administrar-estudiantes' + '?mensaje=' + successMessage;
            res.redirect(redirectURL);
        }
    });
});


// Ruta para editar un estudiante (GET)
// Ruta para editar un estudiante (POST)
app.post('/estudiantes/editar/:id', (req, res) => {
    const estudianteId = req.params.id;
    const { nombre, email, password, tipo } = req.body;

    const query = 'UPDATE usuarios SET nombre = ?, email = ?, password = ?, tipo = ? WHERE id = ?';
    const values = [nombre, email, password, tipo, estudianteId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al editar el estudiante:', error);
            res.send('Error al editar el estudiante.');
        } else {
            console.log('Estudiante editado exitosamente.');

            // Mostrar el mensaje de éxito utilizando SweetAlert y redirigir a la página de administrar estudiantes
            const successMessage = encodeURIComponent('Estudiante editado exitosamente.');
            const redirectURL = '/administrar-estudiantes' + '?mensaje=' + successMessage;
            res.redirect(redirectURL);
        }
    });
});



app.post('/usuarios/editar/:id', (req, res) => {
    const usuarioId = req.params.id;
    const { nombre, email } = req.body;

    const query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
    const values = [nombre, email, usuarioId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al editar el usuario:', error);
            res.status(500).send('Error al editar el usuario.');
        } else {
            // Redireccionar al listado de usuarios o mostrar un mensaje de éxito
            res.redirect('/usuarios');
        }
    });
});




// Ruta para editar un estudiante (POST)
app.post('/estudiantes/editar/:id', (req, res) => {
    const estudianteId = req.params.id;
    const { nombre, email, password } = req.body;

    const query = 'UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?';
    const values = [nombre, email, password, estudianteId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al editar el estudiante:', error);
            res.send('Error al editar el estudiante.');
        } else {
            console.log('Estudiante editado exitosamente.');

            // Mostrar el mensaje de éxito utilizando SweetAlert y redirigir a la página de administrar estudiantes
            const successMessage = encodeURIComponent('Estudiante editado exitosamente.');
            const redirectURL = '/administrar-estudiantes' + '?mensaje=' + successMessage;
            res.redirect(redirectURL);
        }
    });
});




// Ruta para administrar cursos
app.get('/administrar-cursos', (req, res) => {
    const query = 'SELECT * FROM cursos';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los cursos:', error);
            res.status(500).send('Error al obtener los cursos.');
        } else {
            const successMessage = req.query.mensaje;

            res.render('administrar_cursos', {
                cursos: results,
                mensaje: successMessage
            });
        }
    });
});


app.get('/cursos/editar/:id', (req, res) => {
    const cursoId = req.params.id;

    // Lógica para obtener los datos del curso con el ID proporcionado
    const query = 'SELECT * FROM cursos WHERE id = ?';
    connection.query(query, [cursoId], (error, results) => {
        if (error) {
            console.error('Error al obtener el curso:', error);
            res.status(500).send('Error al obtener el curso.');
        } else {
            if (results.length > 0) {
                const curso = results[0];

                // Renderizar la plantilla y pasar los datos del curso y el mensaje
                res.render('editar_curso', {
                    curso,
                    mensaje: null // Puedes cambiar null por el mensaje que desees mostrar
                });
            } else {
                res.status(404).send('Curso no encontrado.');
            }
        }
    });
});

// Ruta para editar un curso (POST)
app.post('/cursos/editar/:id', (req, res) => {
    const courseId = req.params.id;
    const {
        nombre,
        descripcion
    } = req.body;

    const query = 'UPDATE cursos SET nombre = ?, descripcion = ? WHERE id = ?';
    const values = [nombre, descripcion, courseId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al editar el curso:', error);
            res.send('Error al editar el curso.');
        } else {
            console.log('Curso editado exitosamente.');

            // Mostrar el mensaje de éxito utilizando SweetAlert
            res.render('editar_curso', {
                curso: {
                    id: courseId,
                    nombre,
                    descripcion
                },
                mensaje: 'Curso editado exitosamente.'
            }, (err, html) => {
                if (err) {
                    console.error('Error al renderizar la plantilla:', err);
                    res.send('Error al editar el curso.');
                } else {
                    // Agregar el código de SweetAlert al HTML renderizado
                    const modifiedHTML = `${html}
                        <script>
                            Swal.fire({
                                title: 'Éxito',
                                text: 'Curso editado exitosamente.',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                window.location.href = '/administrar-cursos'; // Redirigir a la página de administrar cursos
                            });
                        </script>
                    `;
                    res.send(modifiedHTML);
                }
            });
        }
    });
});



// Ruta para eliminar un curso
app.get('/cursos/eliminar/:id', (req, res) => {
    const cursoId = req.params.id;

    const query = 'DELETE FROM cursos WHERE id = ?';
    const values = [cursoId];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error al eliminar el curso:', error);
            res.send('Error al eliminar el curso.');
        } else {
            console.log('Curso eliminado exitosamente.');

            // Mostrar el mensaje de éxito utilizando SweetAlert y redirigir a la página de administrar cursos
            const successMessage = encodeURIComponent('Curso eliminado exitosamente.');
            const redirectURL = '/administrar-cursos' + '?mensaje=' + successMessage;
            res.redirect(redirectURL);
        }
    });
});







// Configuración de la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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


app.get('/bienvenido', (req, res) => {
    res.render('bienvenido', {
        nombreUsuario: 'John Doe'
    }); // Reemplaza 'John Doe' con el nombre de usuario real
});

app.get('/course-details.html', (req, res) => {
    res.render('course-details');
});

app.get('/usuarios.html', (req, res) => {
    res.render('usuarios');
});

app.get('/cerrar-sesion', (req, res) => {
    // Eliminar la sesión
    req.session.destroy();
    // Redireccionar al inicio
    res.redirect('/');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});


// Cerrar la conexión al final del archivo
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});