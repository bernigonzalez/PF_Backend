const {Router} = require('express');
const { addAdmin } = require('../controllers/controllerAdmin');
const adminRouter = Router();

adminRouter.post('/addAdmin', addAdmin)


module.exports = adminRouter