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



CREATE TABLE IF NOT EXISTS propriedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(150) NOT NULL,
    hectares DECIMAL(10,2) NOT NULL,
    tipo_solo VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


INSERT INTO propriedades 
(usuario_id, nome, localizacao, hectares, tipo_solo) 
VALUES
(1, 'Fazenda Boa Esperança', 'Minas Gerais', 250.50, 'Latossolo Vermelho'),
(2, 'Sítio São João', 'Vespasiano - MG', 80.00, 'Argiloso');






CREATE TABLE IF NOT EXISTS safras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propriedade_id INT NOT NULL,
    cultura VARCHAR(100) NOT NULL,
    ano_safra VARCHAR(20) NOT NULL,
    area_plantada DECIMAL(10,2) NOT NULL,
    data_plantio DATE,
    data_colheita DATE,
    produtividade DECIMAL(10,2),
    custo_total DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Planejamento',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (propriedade_id) REFERENCES propriedades(id)
);


INSERT INTO safras
(propriedade_id, cultura, ano_safra, area_plantada, data_plantio, data_colheita, produtividade, custo_total, status)
VALUES
(1, 'Soja', '2026/2027', 200.00, '2026-10-15', '2027-03-20', 65.50, 350000.00, 'Em andamento'),

(2, 'Milho', '2026/2027', 60.00, '2026-11-01', '2027-04-10', 90.00, 120000.00, 'Planejamento');