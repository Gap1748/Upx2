-- 1. Criar o banco de dados
CREATE DATABASE app_carona;

-- 2. Usar o banco
USE app_carona;

-- 3. Criar a tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    nome_completo VARCHAR(150) NOT NULL,
    
    cpf VARCHAR(14) UNIQUE,
    ra VARCHAR(20) UNIQUE,
    
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    endereco VARCHAR(200),
    
    senha VARCHAR(255) NOT NULL,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- isso serve para deixar registrado quando foi cadastrado
);


-- inserindo valores para teste
INSERT INTO usuarios (nome_completo, cpf, ra, email, telefone, endereco, senha)
VALUES 
('Gabriel Augusto', '123.456.789-00', '2023001', 'gabriel@email.com', '11999999999', 'Rua A, 123', '1234'),

('Maria Silva', '987.654.321-00', '2023002', 'maria@email.com', '11988888888', 'Av. Brasil, 456', 'senha123'),

('João Santos', '111.222.333-44', '2023003', 'joao@email.com', '11977777777', 'Rua das Flores, 789', 'abc123'),

('Ana Oliveira', '555.666.777-88', '2023004', 'ana@email.com', '11966666666', 'Rua Central, 321', 'minhasenha');

SELECT * FROM usuarios;-- teste