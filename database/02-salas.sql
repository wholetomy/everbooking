CREATE TABLE localizacao (
    cod_localizacao SERIAL PRIMARY KEY,
    localizacao VARCHAR(255) UNIQUE NOT NULL,
    status INT NOT NULL DEFAULT 1 REFERENCES status(cod_status),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO localizacao (localizacao) VALUES 
('São Paulo'), 
('Curitiba');

CREATE TABLE salas (
    cod_sala SERIAL PRIMARY KEY,
    sala VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    localizacao INT NOT NULL REFERENCES localizacao(cod_localizacao),
    capacidade INT NOT NULL CHECK (capacidade > 0),
    imagem TEXT NOT NULL,
    status INT NOT NULL DEFAULT 1 REFERENCES status(cod_status),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO salas (sala, descricao, localizacao, capacidade, imagem) VALUES 
('São Paulo', 'Sala muito legal em SP', 1, 12, 'https://funcional.wpcdn.com.br/blog/2023/05/FUNCIONAL_blog_16-05-1.png'), 
('Curitiba', 'Sala muito legal em CWB', 2, 6, 'https://images.tcdn.com.br/img/img_prod/1435346/conjunto_sala_de_reuniao_mesa_2_70m_painel_para_tv_ng_f5_437_variacao_2145_1_9652c3897b422e0c61be94b8292ab042.jpg');