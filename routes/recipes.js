const express = require('express')
const router = express.Router()
const db = require('../database')

const Recipe = require('../models/recipe')
const Ingredient = require('../models/ingredient')
// const Tag = require('../models/tag')
// const RecipeTag = require('../models/recipeTag')
const RecipeIngredient = require('../models/recipeIngredient')
// const UserRecipe = require('../models/userRecipe')

const UOMS = ['tsp','tbsp', 'cups', 'g', 'mL', 'box', 'package', 'jar']

router.get('/', async (req, res, next) => {
    const recipes = await Recipe.all()
    res.render('recipes/index', {title: 'Recipes', recipes: recipes})
})
router.get('/new/start', (req, res) => {
    res.render('recipes/new-start', { title: 'New Recipe', recipe: {}, csrfToken: req.csrfToken() });
});

router.post('/new/start', async (req, res) => {
  const { name } = req.body;

  // Create a new recipe
  const newRecipe = await Recipe.add({ name });
    console.log("New Recipe ID:", newRecipe.id)
  // Redirect to the ingredient page
  res.redirect(`/recipes/edit/${newRecipe.id}/ingredients`);
});




router.get('/form', async (req, res, next) => {
    res.render('recipes/form', {
        title: 'Recipes',
        ingredients: await Ingredient.all(),
        // tags: await Tag.all()  ← remove this line
    });
});

router.post('/upsert', async (req, res, next) => {
    const recipeId = await Recipe.upsert(req.body)
    console.log('Wrong function?', req.body)
    // Clean up and reinsert tags
    await db.getPool().query('DELETE FROM recipes_tags WHERE recipe_id = $1', [recipeId])

    // if (req.body.tagIds && req.body.tagIds.length > 0) {
    //     const tagIds = Array.isArray(req.body.tagIds) ? req.body.tagIds : [req.body.tagIds]
    //     for (let tagId of tagIds) {
    //         await RecipeTag.add({ recipeId: recipeId, tagId: parseInt(tagId) })
    //     }
    // }

    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: `The recipe has been ${req.body.id ? 'updated' : 'created'}.`,
    }
    res.redirect(303, '/recipes')
})

router.get('/edit/:id/start', async (req, res) => {
    const recipe = await Recipe.get(req.params.id)
    res.render('recipes/edit-start', { title: 'Edit Recipe Title', recipe: recipe, csrfToken: req.csrfToken() })
})

router.post('/edit/:id/start', async (req, res) => {
    await Recipe.update({ id: req.params.id, name: req.body.name })
    res.redirect(`/recipes/edit/${req.params.id}/ingredients`)
})

// This handles the page where users add ingredients
router.get('/edit/:id/ingredients', async (req, res) => {
    const recipe = await Recipe.get(req.params.id);
    const allIngredients = await Ingredient.all();
    const recipeIngredients = await RecipeIngredient.allForRecipe(recipe);
console.log('allIngredients:', allIngredients);
console.log('recipeIngredients:', recipeIngredients);

res.render('recipes/edit-ingredients', {
    title: 'Edit Ingredients',
    recipe: recipe,
    recipeIngredients: recipeIngredients, // <-- Correct variable
    allIngredients: allIngredients,
    uoms: UOMS,
    csrfToken: req.csrfToken(),
});

});

router.post('/edit/:id/ingredients/delete', async (req, res) => {
  const recipeId = req.params.id;
  const riId = req.body.riId;

  if (!riId) {
    return res.status(400).send("Missing recipeIngredient ID");
  }

  // Ideally: you want to delete by `id` of the `recipes_ingredients` row
  await db.getPool().query('DELETE FROM recipes_ingredients WHERE id = $1', [riId]);

  res.redirect(`/recipes/edit/${recipeId}/ingredients`);
});

router.post('/edit/:id/ingredients', async (req, res) => {
    await RecipeIngredient.add({
        recipeId: req.params.id,
        ingredientId: req.body.ingredientId,
        measure: req.body.measure,
        uom: req.body.uom,
        instruction: req.body.instruction,
    });

    res.redirect(`/recipes/edit/${req.params.id}/ingredients`);
});

router.get('/edit/:id/details', async (req, res) => {
    const recipe = await Recipe.get(req.params.id);
    // const tags = await Tag.all();

    // // First get the tags for the recipe
    // const recipeTags = await Tag.allForRecipe(recipe) || [];
    
    // // Now it's safe to use .map
    // recipe.tagIds = recipeTags.map(tag => tag.id);

    res.render('recipes/edit-details', { recipe });
});

router.post('/edit/:id/details', async (req, res) => {
  const recipeId = parseInt(req.params.id);
  const { name, steps } = req.body;

  await Recipe.update({ id: recipeId, name, steps });

  res.redirect('/recipes');
});


router.get('/show/:id', async (req, res, next) => {
    const recipe = await Recipe.get(req.params.id)
    let templateVars = {
        title: 'Recipes',
        recipe: recipe,
        recipeId: req.params.id,
        // tags: await Tag.all()
    }
    recipe.ingredients = await Ingredient.allForRecipe(recipe)
    // recipe.tags = await Tag.allForRecipe(recipe)
    // if (req.session.currentUser) {
    //     templateVars.userRecipe = await UserRecipe.get(recipe, req.session.currentUser)
    // }
    // console.log(recipe.tags)
    res.render('recipes/show', templateVars)
})

module.exports = router