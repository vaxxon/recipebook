const express = require('express')
const router = express.Router()
const helpers = require('./helpers') // bring in functions stored in the helpers function

const User = require('../models/user')
const Recipe = require('../models/recipe')
const UserRecipe = require('../models/userRecipe')

router.get('/', function(req, res, next) {
    const users = User.all
    res.render('users/index', {title: 'Users', users: users})
})

// registration

router.get('/register', async (req, res, next) => {
    if (helpers.isLoggedIn(req, res)) { // if the user is logged in, return before rendering
        return
    }
    res.render('users/register', {title: 'Registration'})
})

router.post('/register', async (req, res, next) => {
    if (helpers.isLoggedIn(req, res)) {
        return
    }
    // console.log('body: ' + JSON.stringify(req.body))
    const user = await User.getByEmail(req.body.email)
    if (user) {
        res.render('users/register', {
            title: 'Registration',
            flash: {
                type: 'danger',
                intro: 'Error!',
                message: 'This email is being used by a user.'
            }
        })
    } else {
        await User.register(req.body)
        req.session.flash = {
            type: 'info',
            intro: 'Success!',
            message: `The user has been created.`
        }
        res.redirect(303, '/')
    }
})

// login

router.get('/login', async (req, res, next) => {
    if (helpers.isLoggedIn(req, res)) {
        return
    }
    res.render('users/login', {title: 'Login'})
})

router.post('/login', async(req, res, next) => {
    if (helpers.isLoggedIn(req, res)) {
        return
    }
    // console.log('body: ' + JSON.stringify(req.body))
    const user = await User.login(req.body)
    if (user) {
        req.session.currentUser = user
        req.session.flash = {
            type: 'info',
            intro: 'Success!',
            message: `You are now logged in, user.`
        }
        res.redirect(303, "/")
    } else {
        res.render('users/login', {
            title: 'Login',
            flash: {
                type: 'danger',
                intro: 'Error!',
                message: `Wrong email or password, or you are not a user.`
            }
        })
    }
})

// profile

router.get('/profile', async (req, res, next) => {
    if (helpers.isNotLoggedIn(req, res)) {
        return
    }
    const userRecipes = await UserRecipe.allForUser(req.session.currentUser)
    userRecipes.forEach((userRecipe) => {
        userRecipe.recipe = Recipe.get(userRecipe.recipeId)
    })
    res.render('users/profile', {
        title: 'Profile',
        user: req.session.currentUser,
        userRecipes: userRecipes
    })
})

// logout

router.post('/logout', async (req, res, next) => {
    delete req.session.currentUser
    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: 'You have been logged out.'
    }
    res.redirect(303, '/')
})

// user editing route
router.get('/edit', async (req, res, next) => {
    let userIndex = req.query.id;
    let user = User.get(userIndex);
    res.render('users/form', { title: "Recipe Book / users", user: user, userIndex: userIndex })
})

module.exports = router