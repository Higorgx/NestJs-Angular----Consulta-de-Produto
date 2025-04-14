-- docker/postgres/init.sql
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'cadastro_produto'
   ) THEN
      CREATE DATABASE cadastro_produto;
   END IF;
END
$$;
