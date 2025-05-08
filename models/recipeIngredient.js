const db = require('../database')

// get a recipeIngredient connection
exports.get = async (recipe, ingredient) => {
    const { rows } = await db.getPool().query("select * from recipes_ingredients where recipe_id = $1 and ingredient_id = $2", [recipe.id, ingredient.id])
    return db.camelize(rows)[0]
}

// get all recipeIngredient connections related to a certain Ingredient
exports.allForRecipe = async (ingredient) => {
    const { rows } = db.getPool().query("select recipes.name, recipes_ingredients.* from recipes_ingredients join recipes on recipes.id = recipes_ingredients.recipe_id where ingredient_id = $1;", [ingredient.id])
    return db.camelize(rows)
}

// add a new recipeIngredient relationship
exports.add = async (recipeIngredient) => {
    return db.getPool().query("insert into recipes_ingredients (recipe_id, ingredient_id, measure, uom, instruction) values ($1, $2, $3, $4, $5) returning *", [recipeIngredient.recipeId, recipeIngredient.ingredientId, recipeIngredient.measure, recipeIngredient.uom, recipeIngredient.instruction])
}

// update an existing recipeIngredient relationship
exports.update = async (recipeIngredient) => {
    return await db.getPool().query("update recipes_ingredients set status = $1 where id = $2 returning *", [recipeIngredient.status, recipeIngredient.id])
}

// we also have upsert? should I deprecate the above? idk
// oh right we need the above to enable this on the form lolllll
exports.upsert = async (recipeIngredient) => {
    if (recipeIngredient.id) {
        return exports.update(recipeIngredient)
    } else {
        return exports.add(recipeIngredient)
    }
}