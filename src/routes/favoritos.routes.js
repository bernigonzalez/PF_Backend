const { Router } = require("express");
const { Favoritos } = require("../db");
const { Op } = require("sequelize");
const favsRouter = Router();
//@ /favs
favsRouter.get('/:usuarioId', async (req, res) => {
    try{
         let {usuarioId} = req.params
    const dbUsuarioFav = await Favoritos.findAll({
        where: {
            usuarioId:{
                [Op.eq]: usuarioId
              }
        },
        
    })
    res.send(dbUsuarioFav)
    }catch(err){
        console.log(err)
    }
   
})

favsRouter.post('/', async (req, res) => {
try{
    const {usuarioId, productoId} = req.body
    await Favoritos.create({
        usuarioId: usuarioId,
        productoId: productoId
    })
res.send("new fav added")

}catch(err){
    console.log(err)
}

})

favsRouter.delete('/:productoId', async(req, res) => {
try{
    let {productoId} = req.params
    await Favoritos.destroy({
        where: {
            productoId: productoId
        }
    })
    res.send('fav deleted')
}catch(err){
    console.log(err)
}
})

 module.exports = favsRouter;