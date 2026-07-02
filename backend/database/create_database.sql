CREATE DATABASE IF NOT EXISTS agrorisk
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE agrorisk;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (nome, email, senha) VALUES
('Administrador', 'admin@agrorisk.com', '123456'),
('João Silva', 'joao@agrorisk.com', '123456');