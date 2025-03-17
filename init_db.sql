DROP TABLE IF EXISTS public.agendamentos CASCADE;
DROP TABLE IF EXISTS public.exercicios CASCADE;
DROP TABLE IF EXISTS public.treinos CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.maquinas CASCADE;


CREATE TABLE public.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(10) NOT NULL DEFAULT 'usuario' CHECK (tipo_usuario IN ('usuario', 'admin'))
);


CREATE TABLE public.maquinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    grupo_muscular VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'indisponivel', 'em manutencao')),
    ultima_manutencao DATE
);


CREATE TABLE public.treinos (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    duracao INTERVAL NOT NULL CHECK (EXTRACT(EPOCH FROM duracao) <= 10800)
);


CREATE TABLE public.exercicios (
    id SERIAL PRIMARY KEY,
    id_treino INT REFERENCES public.treinos(id) ON DELETE CASCADE,
    id_maquina INT REFERENCES public.maquinas(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    repeticoes INT NOT NULL CHECK (repeticoes > 0),
    peso NUMERIC(6,2) NOT NULL CHECK (peso >= 0) 
);


CREATE TABLE public.agendamentos (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES public.usuarios(id) ON DELETE CASCADE,
    id_maquina INT REFERENCES public.maquinas(id) ON DELETE SET NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    CHECK (data_fim > data_inicio),
    CHECK (EXTRACT(EPOCH FROM (data_fim - data_inicio)) <= 600) -- Garante que o agendamento dure no máximo 10 minutos
);
