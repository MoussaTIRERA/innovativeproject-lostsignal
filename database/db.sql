
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;


CREATE TABLE lostsignal (
    longitude real NOT NULL,
    latitude real NOT NULL,
    provider text NOT NULL,
    strength real NOT NULL,
    uuid uuid NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.lostsignal OWNER TO owner-name;

CREATE SEQUENCE "lostsignal_Index_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public."lostsignal_Index_seq" OWNER TO owner-name;

ALTER SEQUENCE "lostsignal_Index_seq" OWNED BY lostsignal.id;

ALTER TABLE ONLY lostsignal ALTER COLUMN id SET DEFAULT nextval('"lostsignal_Index_seq"'::regclass);

ALTER TABLE ONLY lostsignal
    ADD CONSTRAINT "Pkey" PRIMARY KEY (id);
