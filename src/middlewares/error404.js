module.exports = (req, res, next) => {
   const error404 = {
      status: 404,
      message: 'Page not found'
   }

   next(error404);
}