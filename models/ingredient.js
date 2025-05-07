const db = require('../database')

exports.all = async () => {
    const { rows } = await db.getPool().query("select * from ingredients order by id")
    return db.camelize(rows)
}

// add check that there really is a row to return
exports.get = async (id) => {
    const { rows } = await db.getPool().query("select * from ingredients where id = $1", [id])
    return db.camelize(rows)[0]
}

exports.add = async (ingredient) => {
    return await db.getPool().query("insert into ingredients (name, vegan, vegetarian, dairy_free, gluten_free) values ($1, $2, $3, $4) returning *", [ingredient.name, ingredient.vegan, ingredient.vegetarian, ingredient.dairyFree, ingredient.glutenFree])
}

exports.update = async (ingredient) => {
    return await db.getPool().query("update ingredients set name = $1, vegan = $2, vegetarian = $3, dairy_free = $4, gluten_free = $5 where id = $6 returning *", [ingredient.name, ingredient.vegan, ingredient.vegetarian, ingredient.dairyFree, ingredient.glutenFree, ingredient.id])
}

exports.upsert = async (ingredient) => {
    if (ingredient.id) {
        exports.update(ingredient)
    } else {
        exports.add(ingredient)
    }
}

exports.allForRecipe = async (recipe) => {
    const { rows } = await db.getPool().query("select ingredients.* from ingredients join recipes_ingredients on recipes_ingredients.ingredient_id = ingredients.id where recipes_ingredients.recipe_id = $1;", [recipe.id])
    return db.camelize(rows)
}