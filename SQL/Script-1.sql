
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

-- um monte de select para testes

SELECT * FROM usuarios;

SELECT * FROM corridas;

SELECT * FROM motoristas;

SELECT * FROM veiculos;

SELECT * FROM disponibilidades_motorista;


-- isso é para adicionar as colunas para mudar a entrada do tempo da disponibilidade
ALTER TABLE disponibilidades_motorista
  ADD COLUMN data_inicio DATE NULL,
  ADD COLUMN data_fim DATE NULL;

UPDATE disponibilidades_motorista
SET data_inicio = CURDATE(),
    data_fim = DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
WHERE data_inicio IS NULL;