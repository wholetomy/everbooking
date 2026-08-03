CREATE TABLE agendamentos_status (
    cod_status_agendamento SERIAL PRIMARY KEY,
    status_agendamento VARCHAR(255) NOT NULL
);

INSERT INTO agendamentos_status (status_agendamento)
VALUES
('Agendado'),
('Cancelado'),
('Concluído');

CREATE TABLE agendamentos (
    cod_agendamento SERIAL PRIMARY KEY,
    agendado_por INT NOT NULL REFERENCES usuarios(cod_usuario),
    sala INT NOT NULL REFERENCES salas(cod_sala),
    horario_inicial TIMESTAMP NOT NULL,
    horario_final TIMESTAMP NOT NULL,
    status_agendamento INT NOT NULL DEFAULT 1 REFERENCES agendamentos_status(cod_status_agendamento),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

