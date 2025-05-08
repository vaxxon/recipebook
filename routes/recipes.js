const express = require('express')
const router = express.Router()

const Recipe = require('../models/recipe')
const Ingredient = require('../models/ingredient')
const Tag = require('../models/tag')
const RecipeTag = require('../models/recipeTag')
// const UserRecipe = require('../models/userRecipe')

router.get('/', async (req, res, next) => {
    const recipes = await Recipe.all()
    res.render('recipes/index', {title: 'Recipes', recipes: recipes})
})

router.get('/form', async (req, res, next) => {
    res.render('recipes/form', {title: 'Recipes', ingredients: await Ingredient.all(), tags: await Tag.all()})
})

router.post('/upsert', async (req, res, next) => {
    await Recipe.upsert(req.body)
    let createdOrUpdated = req.body.id ? 'updated' : 'created'
    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: `The recipe has been ${createdOrUpdated}.`,
    }
    res.redirect(303, '/recipes')
})

router.get('/edit', async (req, res, next) => {
    let recipeId = req.query.id
    let recipe = await Recipe.get(recipeId)
    recipe.ingredientIds = (await Ingredient.allForRecipe(recipe)).map(ingredient => ingredient.id)
    recipe.tagIds = (await Tag.allForRecipe(recipe)).map(tag => tag.id)
    res.render('recipes/form', {
        title: 'Edit Recipe',
        recipe: recipe,
        ingredients: await Ingredient.all(),
        tags: await Tag.all()
    })
})

router.get('/show/:id', async (req, res, next) => {
    const recipe = await Recipe.get(req.params.id)
    let templateVars = {
        title: 'Recipes',
        recipe: recipe,
        recipeId: req.params.id,
        tags: RecipeTag.tags
    }
    recipe.ingredients = await Ingredient.allForRecipe(recipe)
    // if (req.session.currentUser) {
    //     templateVars.userRecipe = await UserRecipe.get(recipe, req.session.currentUser)
    // }
    res.render('recipes/show', templateVars)
})

module.exports = router