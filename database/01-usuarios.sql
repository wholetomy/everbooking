CREATE TABLE status (
    cod_status SERIAL PRIMARY KEY,
    status VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO status (status) VALUES 
('Ativo'), 
('Inativo');

CREATE TABLE tipo_usuarios (
    cod_tipo_usuario SERIAL PRIMARY KEY,
    tipo_usuario VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO tipo_usuarios (tipo_usuario) VALUES 
('Usuário comum'), 
('Administrador');

CREATE TABLE perguntas_secretas (
    cod_pergunta_secreta SERIAL PRIMARY KEY,
    pergunta_secreta VARCHAR(255) UNIQUE NOT NULL,
    status INT NOT NULL DEFAULT 1 REFERENCES status(cod_status)
);

INSERT INTO perguntas_secretas (pergunta_secreta) VALUES 
('Qual o nome do seu pet?'),
('Qual a sua cidade natal?');

CREATE TABLE usuarios (
    cod_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    pergunta_secreta INT NOT NULL REFERENCES perguntas_secretas(cod_pergunta_secreta),
    resposta_secreta VARCHAR(255) NOT NULL,
    tipo_usuario INT NOT NULL DEFAULT 1 REFERENCES tipo_usuarios(cod_tipo_usuario),
    status INT NOT NULL DEFAULT 1 REFERENCES status(cod_status),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha, tipo_usuario, pergunta_secreta, resposta_secreta) VALUES 
('default', 'default@default.com', '$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW', 1, 1, 'Rex'), 
('admin', 'admin@admin.com', '$2b$12$Dlm6T2QstEMWeiAw.okII.AAIpZ59GGFTfluxT48cYsUA58UagF2.', 2, 1, 'Bob');


