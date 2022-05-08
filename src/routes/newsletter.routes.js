const { Router } = require('express');
const { postNewsletter } = require('../controllers/controllerNewsletter')
const newsletterRouter = Router();

newsletterRouter.post('/', async (req, res, next) => {

    const { nombre, email } = req.body

    console.log(req.body)

    let post = await postNewsletter(nombre, email);
    if (post.error) return next(post.error);

    res.status(201).json(post);
})

module.exports = newsletterRouter;