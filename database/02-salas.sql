CREATE TABLE localizacao (
    cod_localizacao SERIAL PRIMARY KEY,
    localizacao VARCHAR(255) UNIQUE NOT NULL,
    status INT NOT NULL DEFAULT 1 REFERENCES status(cod_status),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO localizacao (localizacao) VALUES
('São Paulo'),
('Curitiba'),
('Rio de Janeiro'),
('Belo Horizonte'),
('Porto Alegre'),
('Brasília'),
('Florianópolis'),
('Campinas'),
('Recife'),
('Salvador');



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

INSERT INTO salas (
    sala,
    descricao,
    localizacao,
    capacidade,
    imagem
)
VALUES

(
'São Paulo - Paulista 101',
'Sala moderna equipada para reuniões executivas.',
1,
8,
'https://images.unsplash.com/photo-1497366754035-f200968a6e72'
),

(
'São Paulo - Paulista 202',
'Sala premium com TV 75 e videoconferência.',
1,
14,
'https://images.unsplash.com/photo-1497366412874-3415097a27e7'
),

(
'Curitiba Centro',
'Sala confortável para equipes pequenas.',
2,
10,
'https://images.unsplash.com/photo-1497366811353-6870744d04b2'
),

(
'Rio Copacabana',
'Sala com vista para o mar.',
3,
20,
'https://images.unsplash.com/photo-1504384308090-c894fdcc538d'
),

(
'BH Savassi',
'Sala ideal para apresentações.',
4,
6,
'https://images.unsplash.com/photo-1524758631624-e2822e304c36'
),

(
'Porto Alegre Norte',
'Sala ampla para treinamentos.',
5,
25,
'https://images.unsplash.com/photo-1517502884422-41eaead166d4'
),

(
'Brasília Corporate',
'Sala executiva para diretoria.',
6,
12,
'https://images.unsplash.com/photo-1497366216548-37526070297c'
),

(
'Florianópolis Tech',
'Sala preparada para apresentações e workshops.',
7,
16,
'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa'
),

(
'Campinas Innovation',
'Sala para reuniões híbridas.',
8,
18,
'https://images.unsplash.com/photo-1497366412874-3415097a27e7'
),

(
'Recife Digital',
'Sala equipada com sistema de videoconferência.',
9,
10,
'https://images.unsplash.com/photo-1497366754035-f200968a6e72'
),

(
'Salvador Bahia',
'Sala destinada a reuniões comerciais.',
10,
12,
'https://images.unsplash.com/photo-1524758631624-e2822e304c36'
),

(
'São Paulo - Faria Lima',
'Sala premium para diretoria.',
1,
30,
'https://images.unsplash.com/photo-1497366216548-37526070297c'
),

(
'Curitiba Auditório',
'Auditório para palestras e treinamentos.',
2,
40,
'https://images.unsplash.com/photo-1504384308090-c894fdcc538d'
),

(
'Rio Barra',
'Sala moderna para equipes ágeis.',
3,
15,
'https://images.unsplash.com/photo-1497366412874-3415097a27e7'
),

(
'Campinas Startup',
'Sala destinada a reuniões rápidas.',
8,
8,
'https://images.unsplash.com/photo-1497366754035-f200968a6e72'
);