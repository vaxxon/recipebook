const express = require('express')
const router = express.Router()

const RecipeIngredient = require('../models/recipeIngredient')

router.get('/edit/:id/ingredients', async (req, res) => {
    const recipe = await Recipe.get(req.params.id);
    const allIngredients = await Ingredient.all();
    const recipeIngredients = await RecipeIngredient.allForRecipe(recipe);
    console.log('allIngredients:', allIngredients);
    console.log('recipeIngredients:', recipeIngredients);


    // You probably want to use `recipeIngredients` in the form, not `ingredients`
    res.render('recipes/edit-ingredients', {
        title: 'Edit Ingredients',
        recipe: recipe,
        recipeIngredients: recipeIngredients,       // used in the top section
        allIngredients: allIngredients,       // used in the <select> below
        uoms: UOMS,
        csrfToken: req.csrfToken(),
    });
});

// router.get('/edit/:id/ingredients/new', async (req, res) => {
//     const allIngredients = await Ingredient.all()
//     res.render('recipes/edit-ingredient-form', { recipeId: req.params.id, ingredients: allIngredients })
// })


router.post('/edit/:id/ingredients/delete', async (req, res) => {
    await RecipeIngredient.delete({ id: req.body.riId }) // You'll need to add this method to your model
    res.redirect(`/recipes/edit/${req.params.id}/ingredients`)
})

// router.post('/edit/:id/ingredients/update', async (req, res) => {
//   const toArray = (val) => Array.isArray(val) ? val : [val]
//   console.log('Wrong function?', req.body)
//   const riIds = toArray(req.body.riIds).map(id => parseInt(id, 10)).filter(id => !isNaN(id));
//   const measures = toArray(req.body.measures)
//   const uoms = toArray(req.body.uoms)
//   const instructions = toArray(req.body.instructions)

//   for (let i = 0; i < riIds.length; i++) {
//     await RecipeIngredient.update({
//       id: riIds[i],
//       measure: measures[i],
//       uom: uoms[i],
//       instruction: instructions[i]
//     })
//   }

//   res.redirect(`/recipes/edit/${req.params.id}/ingredients`)
// })

module.exports = router