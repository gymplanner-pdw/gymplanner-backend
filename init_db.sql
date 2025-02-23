DROP TABLE IF EXISTS public.agendamentos CASCADE;
DROP TABLE IF EXISTS public.exercicios CASCADE;
DROP TABLE IF EXISTS public.treinos CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.maquinas CASCADE;

CREATE TABLE public.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('usuario', 'admin'))
);

CREATE TABLE public.maquinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    grupo_muscular VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('disponivel', 'indisponivel', 'em manutencao')),
    ultima_manutencao DATE
);

CREATE TABLE public.treinos (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    duracao INTERVAL NOT NULL
);

CREATE TABLE public.exercicios (
    id SERIAL PRIMARY KEY,
    id_treino INT REFERENCES public.treinos(id) ON DELETE CASCADE,
    id_maquina INT REFERENCES public.maquinas(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    repeticoes INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL
);

CREATE TABLE public.agendamentos (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES public.usuarios(id) ON DELETE CASCADE,
    id_maquina INT REFERENCES public.maquinas(id) ON DELETE CASCADE,
    data TIMESTAMP NOT NULL,
    CONSTRAINT check_tempo_agendamento CHECK (EXTRACT(MINUTE FROM data) <= 10)
);
