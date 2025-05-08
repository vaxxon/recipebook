const db = require('../database')

exports.all = async () => {
    const { rows } = await db.getPool().query('select * from recipes order by id')
    return db.camelize(rows)
}

exports.add = async (recipe) => { // pass ingredients as an array of arrays? or something
    const { rows } = await db.getPool().query('insert into recipes (title) values ($1) returning *', [recipe.title])
    let newRecipe = db.camelize(rows)[0]
    await addTagsToRecipe(newRecipe, recipe.tagIds)
    return newRecipe
}

exports.get = async (id) => {
    const { rows } = await db.getPool().query('select * from recipes where id = $1', [id])
    return db.camelize(rows)[0]
}

exports.update = async (recipe) => {
    const { rows } = await db.getPool().query('update recipes set title = $1, where id = $3 returning *', [recipe.title, recipe.ingredientList, recipe.id])
    let newRecipe = db.camelize(rows)[0]
    await deleteTagsForRecipe(newRecipe)
    await addTagsToRecipe(newRecipe, recipe.tagIds)
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
    tagIds.forEach(async (tagId) => {
        await db.getPool().query('insert into recipe_tags (tag_id, recipe_id) values ($1, $2)', [tagId, recipe.id])
    })
}

const deleteTagsForRecipe = async (recipe) => {
    db.getPool().query('delete from recipes_tags where recipe_id = $1', [recipe.id])
}