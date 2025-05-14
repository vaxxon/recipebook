const db = require('../database')
const Tag = require('../models/tag')
const RecipeTag = require('../models/recipeTag')

exports.all = async () => {
    const { rows } = await db.getPool().query('select * from recipes order by id')
    return db.camelize(rows)
}

exports.get = async (id) => {
    const { rows } = await db.getPool().query('select * from recipes where id = $1', [id])
    return db.camelize(rows)[0]
}

exports.add = async (recipe) => { // pass ingredients as an array of arrays? or something
    const { rows } = await db.getPool().query('insert into recipes (name) values ($1) returning *', [recipe.name])
    let newRecipe = db.camelize(rows)[0]
    console.log('New Recipe: ', newRecipe)
    if (recipe.tagIds && recipe.tagIds.length > 0) {
        await addTagsToRecipe(newRecipe, recipe.tagIds)
    }
    return newRecipe
}

exports.create = async (name) => {
    const { rows } = await db.getPool().query('insert into recipes (name) values ($1) returning *', [name])
    return db.camelize(rows)[0]
}

exports.updatename = async (id, name) => {
    const { rows } = await db.getPool().query('update recipes set name = $1 where id = $2 returning *', [name, id])
    return db.camelize(rows)[0]
}

exports.updateSteps = async (id, steps) => {
    const { rows } = await db.getPool().query('update recipes set steps = $1 where id = $2 returning *', [steps, id])
    return db.camelize(rows)[0]
}

exports.clearIngredients = async (recipeId) => {
  await db.getPool().query('DELETE FROM recipes_ingredients WHERE recipe_id = $1', [recipeId])
}

exports.addIngredient = async ({ recipeId, ingredientId, measure, uom, instruction }) => {
  const { rows } = await db.getPool().query(
    'INSERT INTO recipes_ingredients (recipe_id, ingredient_id, measure, uom, instruction) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [recipeId, ingredientId, measure, uom, instruction]
  )
  return db.camelize(rows)[0]
}

exports.ingredientsForRecipe = async (recipeId) => {
  const { rows } = await db.getPool().query(
    'SELECT ri.*, i.name FROM recipes_ingredients ri JOIN ingredients i ON i.id = ri.ingredient_id WHERE ri.recipe_id = $1',
    [recipeId]
  )
  return db.camelize(rows)
}

exports.deleteIngredient = async (recipeId, ingredientId) => {
  await db.getPool().query('DELETE FROM recipes_ingredients WHERE recipe_id = $1 AND ingredient_id = $2', [recipeId, ingredientId])
}

exports.setTags = async (recipeId, tagIds) => {
  await db.getPool().query('DELETE FROM recipes_tags WHERE recipe_id = $1', [recipeId])
  for (const tagId of tagIds) {
    await RecipeTag.add({ recipeId, tagId })
  }
}

exports.update = async (recipe) => {
    const { rows } = await db.getPool().query('update recipes set name = $1 where id = $2 returning *', [recipe.name, recipe.id])
    let newRecipe = db.camelize(rows)[0]
    await deleteTagsForRecipe(newRecipe)
    if (recipe.tagIds && recipe.tagIds.length > 0) {
        await addTagsToRecipe(newRecipe, recipe.tagIds)
    }
    return newRecipe
}

exports.upsert = async (recipe) => {
    if (recipe.tagIds && !Array.isArray(recipe.tagIds)) {
        recipe.tagIds = [recipe.tagIds]
    }
    if (recipe.id) {
        exports.update(recipe)
    } else {
        exports.add(recipe)
    }
}

const addTagsToRecipe = async (recipe, tagIds) => {
    for (const tagId of tagIds) {
        await db.getPool().query(
            'insert into recipes_tags (tag_id, recipe_id) values ($1, $2)',
            [tagId, recipe.id]
        )
    }
}

const deleteTagsForRecipe = async (recipe) => {
    await db.getPool().query('delete from recipes_tags where recipe_id = $1', [recipe.id])
}