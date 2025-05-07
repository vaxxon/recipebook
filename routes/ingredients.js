const express = require('express')
const router = express.Router()

const Ingredient = require('../models/ingredient')

router.get('/', async(req, res, next) => { // access db asynchronously
    const ingredients = await Ingredient.all() // wait until you need to get this info
    res.render('ingredients/index', {title: 'Ingredients', ingredients: ingredients})
})

// form submission route
router.get('/form', async(req, res, next) => {
    res.render('ingredients/form', {title: 'Ingredients'})
})

// ingredient creation/update
router.post('/upsert', async(req, res, next) => {
    console.log('body: ' + JSON.stringify(req.body))
    await Ingredient.upsert(req.body)
    let createdOrUpdated = req.body.id ? 'updated' : 'created'
    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: `This ingredient has been ${createdOrUpdated}.`
    }
    res.redirect(303, '/ingredients')
})

// ingredient editing route
router.get('/edit', async (req, res, next) => {
    let ingredient = await Ingredient.get(req.query.id);
    res.render('ingredients/form', { title: "Ingredients", ingredient: ingredient })
})

// no idea what this does
module.exports = router