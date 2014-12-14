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
    location geography NOT NULL,
    signal real NOT NULL,
    provider character varying(6) NOT NULL,
    model text NOT NULL,
    uuid character varying(16) NOT NULL,
    dbdate timestamp with time zone NOT NULL,
    id integer NOT NULL,
    CONSTRAINT dbdate_check CHECK ((dbdate <= now())),
    CONSTRAINT provider_char_check CHECK (((provider)::text ~ '[0-9]*'::text)),
    CONSTRAINT provider_len_check CHECK ((char_length((provider)::text) >= 5)),
    CONSTRAINT uuid_check CHECK (((uuid)::text ~ '[0-9a-f]*'::text))
);

CREATE SEQUENCE lostsignal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lostsignal_id_seq OWNED BY lostsignal.id;

ALTER TABLE ONLY lostsignal ALTER COLUMN id SET DEFAULT nextval('lostsignal_id_seq'::regclass);

ALTER TABLE ONLY lostsignal
    ADD CONSTRAINT lostsignal_pkey PRIMARY KEY (id);

CREATE INDEX lostsignal_loc_index ON lostsignal USING gist (location);
