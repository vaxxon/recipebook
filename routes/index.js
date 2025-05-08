const express = require("express")
const router = express.Router();

const Recipe = require('../models/recipe')
const Tag = require('../models/tag')
const Ingredient = require('../models/ingredient')

router.get('/', async (req, res, next) => {
    const recipes = await Recipe.all()
    const tags = await Tag.all()
    const ingredients = await Ingredient.all()
    res.render('index', {title: 'Recipe Book', recipes: recipes, tags: tags, ingredients: ingredients})
})

module.exports = router;