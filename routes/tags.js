const express = require('express')
const router = express.Router()

const Tag = require('../models/tag')

router.get('/', async(req, res, next) => { // access db asynchronously
    const tags = await Tag.all() // wait until you need to get this info
    res.render('tags/index', {title: 'tags', tags: tags})
})

// form submission route
router.get('/form', async(req, res, next) => {
    res.render('tags/form', {title: 'tags'})
})

// tag creation/update
router.post('/upsert', async(req, res, next) => {
    console.log('body: ' + JSON.stringify(req.body))
    await Tag.upsert(req.body)
    let createdOrUpdated = req.body.id ? 'updated' : 'created'
    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: `This tag has been ${createdOrUpdated}.`
    }
    res.redirect(303, '/tags')
})

// tag editing route
router.get('/edit', async (req, res, next) => {
    let tag = await Tag.get(req.query.id);
    res.render('tags/form', { title: "tags", tag: tag })
})

// no idea what this does
module.exports = router