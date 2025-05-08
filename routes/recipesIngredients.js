const express = require('express')
const router = express.Router()

const RecipeIngredient = require('../models/recipeIngredient')

router.post('/upsert', async (req, res, next) => {
    await RecipeIngredient.upsert(req.body)
    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: 'Your ingredient has been stored.'
    }
    res.redirect(303, `/recipes/show/${req.body.recipeId}`)
})

module.exports = router