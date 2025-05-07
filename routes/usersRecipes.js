const express = require('express')
const router = express.Router()

const UserRecipe = require('../models/userRecipe')

router.post('/upsert', async (req, res, next) => {
    await UserRecipe.upsert(req.body)
    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: 'Your recipe has been stored.'
    }
    res.redirect(303, `/recipes/show/${req.body.recipeId}`)
})

module.exports = router