const express = require('express')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const { credentials } = require('./config')
const csrf = require('csurf')
const path = require('path')
const handlebars = require('express-handlebars').create({
    helpers: {
      eq: (v1, v2) => v1 == v2,
      ne: (v1, v2) => v1 != v2,
      lt: (v1, v2) => v1 < v2,
      gt: (v1, v2) => v1 > v2,
      lte: (v1, v2) => v1 <= v2,
      gte: (v1, v2) => v1 >= v2,
      and() {
          return Array.prototype.every.call(arguments, Boolean);
      },
      or() {
          return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
      },
      someId: (arr, id) => arr && arr.some(obj => obj.id == id),
      in: (arr, obj) => arr && arr.some(val => val == obj),
      dateStr: (v) => v && v.toLocaleDateString("en-US")
    }
  });
const bodyParser = require('body-parser')

const usersRouter = require('./routes/users')
const indexRouter = require('./routes/index')
const recipeRouter = require('./routes/recipes')
const ingredientRouter = require('./routes/ingredients')
const tagRouter = require('./routes/tags')
const recipeIngredientRouter = require('./routes/recipesIngredients')
const userRecipeRouter = require('./routes/usersRecipes')
// const recipeTagRouter = require('./routes/recipesTags')

const app = express()
const port = 3000
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
  secret: credentials.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}))
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser
  next()
})
app.use(csrf({ cookie: true }))
app.use((req, res, next) => {
  res.locals._csrfToken = req.csrfToken()
  next()
})
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})
app.use('/', indexRouter)
app.use('/recipes', recipeRouter)
app.use('/ingredients', ingredientRouter)
app.use('/tags', tagRouter)
app.use('/users', usersRouter)
app.use('/usersRecipes', userRecipeRouter)
app.use('/recipesIngredients', recipeIngredientRouter)
// app.use('/recipesTags', recipeTagRouter)

app.use((req, res) => {
  res.status(404)
  console.log('Trying to access ', req.path, ' with method ', req.method)
  res.send('<h1 style="color:crimson">404 &mdash; Not Found</h1>')
})
app.use((err, req, res, next) => {
  console.error(err.message)
  res.type('text/plain')
  res.status(500)
  res.send('<h1 style="color:darkgreen">500 &mdash; Server Error</h1>')
})

app.listen(port, () => console.log(
  `Express started on localhost:${port}. Press control-C to terminate.`
))