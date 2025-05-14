const db = require('../database')

// Get a recipeTag relationship
exports.get = async (recipe, tag) => {
    const { rows } = await db.getPool().query(
        'SELECT * FROM recipes_tags WHERE recipe_id = $1 AND tag_id = $2',
        [recipe.id, tag.id]
    )
    return db.camelize(rows)[0]
}

// Get all recipeTag connections for a given tag
exports.allForTag = async (tag) => {
    const { rows } = await db.getPool().query(
        'SELECT recipes.name, recipes_tags.* FROM recipes_tags JOIN recipes ON recipes.id = recipes_tags.recipe_id WHERE tag_id = $1',
        [tag.id]
    )
    return db.camelize(rows)
}

// Get all tags for a recipe
exports.allForRecipe = async (recipe) => {
    const { rows } = await db.getPool().query(
        'SELECT tags.* FROM tags JOIN recipes_tags ON tags.id = recipes_tags.tag_id WHERE recipes_tags.recipe_id = $1',
        [recipe.id]
    )
    return db.camelize(rows)
}

// Add a new recipeTag relationship
exports.add = async (recipeTag) => {
    return db.getPool().query(
        'INSERT INTO recipes_tags (recipe_id, tag_id) VALUES ($1, $2) RETURNING *',
        [recipeTag.recipeId, recipeTag.tagId]
    )
}

// Update is optional if there's nothing to change besides the relationship,
// but you could add metadata columns to recipes_tags if needed.
exports.update = async (recipeTag) => {
    // placeholder for potential updates
    return db.getPool().query(
        'UPDATE recipes_tags SET recipe_id = $1, tag_id = $2 WHERE id = $3 RETURNING *',
        [recipeTag.recipeId, recipeTag.tagId, recipeTag.id]
    )
}

// Upsert for tag relationships
exports.upsert = async (recipeTag) => {
    if (recipeTag.id) {
        return exports.update(recipeTag)
    } else {
        return exports.add(recipeTag)
    }
}