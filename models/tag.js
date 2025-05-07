const db = require('../database')

exports.all = async () => {
    const { rows } = await db.getPool().query("select * from tags order by name")
    return db.camelize(rows)
}

// add check that there really is a row to return
exports.get = async (id) => {
    const { rows } = await db.getPool().query("select * from tags where id = $1", [id])
    return db.camelize(rows)[0]
}

exports.add = async (tag) => {
    return await db.getPool().query("insert into tags (name) values ($1) returning *", [tag.name])
}

exports.update = async (tag) => {
    return await db.getPool().query("update tags set name = $1 where id = $2 returning *", [tag.name, tag.id])
}

exports.upsert = async (tag) => {
    if (tag.id) {
        exports.update(tag)
    } else {
        exports.add(tag)
    }
}

exports.allForRecipe = async (recipe) => {
    const { rows } = await db.getPool().query("select tags.* from tags join recipes_tags on recipes_tags.author_id = tags.id where recipes_tags.recipe_id = $1;", [recipe.id])
    return db.camelize(rows)
}