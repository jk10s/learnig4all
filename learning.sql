-- Creación de la base de datos 'learning'
CREATE DATABASE learning;

-- Cambio al contexto de la base de datos 'learning'
USE learning;

-- Creación de la tabla 'usuarios'
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  tipo ENUM('estudiante', 'administrador') DEFAULT 'estudiante'
);

-- Inserción de 5 registros en la tabla 'usuarios'
INSERT INTO usuarios (nombre, email, password, tipo) VALUES
  ('Carlos', 'carlos@example.com', '123456', 'estudiante'),
  ('María', 'maria@example.com', 'abcdef', 'estudiante'),
  ('Javier', 'javier@example.com', 'qwerty', 'estudiante'),
  ('Laura', 'laura@example.com', 'password', 'estudiante'),
  ('Andrés', 'andres@example.com', 'secret', 'administrador');

-- Creación de la tabla 'cursos'
CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  duracion INT,
  fecha_inicio DATE
);

-- Inserción de 5 registros en la tabla 'cursos'
INSERT INTO cursos (nombre, descripcion, duracion, fecha_inicio) VALUES
  ('Programación', 'Curso de programación básica', 8, '2023-06-01'),
  ('Diseño Gráfico', 'Curso de diseño gráfico profesional', 12, '2023-07-15'),
  ('Inglés Avanzado', 'Curso de inglés nivel avanzado', 10, '2023-05-30'),
  ('Marketing Digital', 'Curso de marketing digital para negocios', 6, '2023-06-10'),
  ('Finanzas Personales', 'Curso de educación financiera', 4, '2023-06-05');
