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
('Qual a sua cidade natal?'),
('Qual era o nome da sua primeira escola?'),
('Qual o nome da sua mãe?'),
('Qual sua comida favorita?'),
('Qual foi seu primeiro carro?'),
('Qual o nome do seu melhor amigo de infância?'),
('Qual era sua matéria favorita?'),
('Qual o nome da rua onde você cresceu?'),
('Qual o sobrenome da sua avó materna?');



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

INSERT INTO usuarios (
    nome,
    email,
    senha,
    pergunta_secreta,
    resposta_secreta,
    tipo_usuario
)
VALUES
(
'default',
'default@default.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
1,
'Rex',
1
),
(
'admin',
'admin@admin.com',
'$2b$12$Dlm6T2QstEMWeiAw.okII.AAIpZ59GGFTfluxT48cYsUA58UagF2.',
2,
'Bob',
2
),
(
'João Silva',
'joao.silva@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
3,
'Escola Modelo',
1
),
(
'Maria Oliveira',
'maria.oliveira@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
2,
'Campinas',
1
),
(
'Pedro Santos',
'pedro.santos@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
4,
'Ana',
1
),
(
'Ana Souza',
'ana.souza@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
5,
'Lasanha',
1
),
(
'Carlos Pereira',
'carlos.pereira@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
6,
'Gol',
1
),
(
'Fernanda Lima',
'fernanda.lima@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
7,
'Lucas',
1
),
(
'Lucas Martins',
'lucas.martins@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
1,
'Thor',
1
),
(
'Juliana Costa',
'juliana.costa@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
8,
'Matemática',
1
),
(
'Ricardo Gomes',
'ricardo.gomes@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
9,
'Rua das Flores',
1
),
(
'Patrícia Rocha',
'patricia.rocha@email.com',
'$2b$12$a.kpoUMmpuG8jpFnveqtvOs4akP5gUEPK3YaDLPN7S5v2XeW6kBOW',
10,
'Silva',
1
);