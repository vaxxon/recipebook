drop database if exists recipe_book;

create database recipe_book;

\c recipe_book

CREATE TABLE "ingredients" (
  "id" serial,
  "name" varchar,
  "vegan" boolean,
  "vegetarian" boolean,
  "dairy_free" boolean,
  "gluten_free" boolean,
  PRIMARY KEY ("id")
);

CREATE TABLE "users_recipes" (
  "id" serial,
  "user_id" int,
  "recipe_id" int,
  "cooked" boolean,
  "favorite" boolean,
  PRIMARY KEY ("id")
);

CREATE INDEX "CCK" ON  "users_recipes" ("user_id", "recipe_id");

CREATE TABLE "recipes" (
  "id" serial,
  "name" varchar,
  "steps" text,
  PRIMARY KEY ("id")
);

CREATE TABLE "recipes_tags" (
  "id" serial,
  "recipe_id" int,
  "tag_id" int,
  PRIMARY KEY ("id")
);

CREATE TABLE "recipes_ingredients" (
  "id" serial,
  "ingredient_id" int,
  "recipe_id" int,
  "measure" float,
  "uom" varchar,
  "instruction" varchar,
  PRIMARY KEY ("id")
);

CREATE INDEX "CCK" ON  "recipes_ingredients" ("ingredient_id", "recipe_id");

CREATE TABLE "users" (
  "id" serial,
  "name" varchar,
  "email" varchar,
  "password" varchar,
  "salt" varchar,
  PRIMARY KEY ("id")
);

CREATE TABLE "tags" (
  "id" serial,
  "name" varchar,
  "type" varchar,
  PRIMARY KEY ("id")
);