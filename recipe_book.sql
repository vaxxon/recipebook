drop database if exists recipe_book;

create database recipe_book;

\c recipe_book

CREATE TABLE "ingredient" (
  "id" serial,
  "name" varchar,
  PRIMARY KEY ("id")
);

CREATE TABLE "recipe" (
  "id" serial,
  "name" varchar,
  "measure" float,
  "instructions" text,
  PRIMARY KEY ("id")
);

CREATE TABLE "recipe_tag" (
  "id" serial,
  "recipe_id" int,
  "tag_id" int,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_recipe_tag.recipe_id" NOT NULL,
  CONSTRAINT "FK_recipe_tag.tag_id" NOT NULL
);

CREATE TABLE "recipe_ingredient" (
  "id" serial,
  "ingredient_id" int,
  "recipe_id" int,
  "measure" float,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_recipe_ingredient.ingredient_id" NOT NULL,
  CONSTRAINT "FK_recipe_ingredient.recipe_id" NOT NULL
);

CREATE TABLE "tag" (
  "id" serial,
  "name" varchar,
  PRIMARY KEY ("id")
);