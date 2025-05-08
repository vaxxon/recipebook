const db = require('../database')

// get a userRecipe connection
exports.get = async (recipe, user) => {
    const { rows } = await db.getPool().query("select * from users_recipes where recipe_id = $1 and user_id = $2", [recipe.id, user.id])
    return db.camelize(rows)[0]
}

// get all userRecipe connections related to a certain user
exports.allForUser = async (user) => {
    const { rows } = db.getPool().query("select recipes.name, users_recipes.status from users_recipes join recipes on recipes.id = users_recipes.recipe_id where user_id = $1;", [user.id])
    return db.camelize(rows)
}

// add a new userRecipe relationship
exports.add = async (userRecipe) => {
    return db.getPool().query("insert into users_recipes (recipe_id, user_id, status) values ($1, $2, $3) returning *", [userRecipe.recipeId, userRecipe.userId, userRecipe.status])
}

// update an existing userRecipe relationship
exports.update = async (userRecipe) => {
    return await db.getPool().query("update users_recipes set status = $1 where id = $2 returning *", [userRecipe.status, userRecipe.id])
}

// we also have upsert? should I deprecate the above? idk
// oh right we need the above to enable this on the form lolllll
exports.upsert = async (userRecipe) => {
    if (userRecipe.id) {
        return exports.update(userRecipe)
    } else {
        return exports.add(userRecipe)
    }
}