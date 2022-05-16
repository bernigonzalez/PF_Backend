const { Router } = require("express");

// Importamos todos los routers;
const userRouter = require("./usuario.routes");
const productRouter = require("./producto.routes");
const pedidoRouter = require("./pedido.routes");
const categoryRouter = require("./categoria.routes");
const subcategoryRouter = require("./subcategoria.route");
const carritoRouter = require("./carrito.routes");
const pagosRouter = require("./pagos.routes");
const offersRouter = require("./oferta.routes");
const comentariosRouter = require("./comentario.routes");
const forgotPasswordRouter = require("./forgotPassword.routes");
const resetPasswordRouter = require("./resetPassword.routes");
const pagoRouter = require("./mercadoPago.routes")
const wapRouter = require("./whatsapp.routes")
const newsletterRouter = require("./newsletter.routes")

const conversationRouter = require("./conversation.routes")
const messageRouter = require("./message.routes")

const googleRouter = require("./loginGoogle.routes")
const favsRouter = require("./favoritos.routes")
const adminRouter = require("./admin.routes")
const notifRouter = require("./notifications.routes")
const router = Router();

// Configuramos los routers
router.use("/user", userRouter);
router.use("/products", productRouter);
router.use("/pedidos", pedidoRouter);
router.use("/categories", categoryRouter);
router.use("/subcategories", subcategoryRouter);
router.use("/offers", offersRouter);
router.use("/carritos", carritoRouter);
router.use("/pagos", pagosRouter);
router.use("/comments", comentariosRouter);
router.use("/password", forgotPasswordRouter);
router.use("/resetPassword", resetPasswordRouter);
router.use("/pago", pagoRouter)
router.use("/whatsapp", wapRouter)
router.use("/newsletter", newsletterRouter);

router.use("/chatconversation", conversationRouter);
router.use("/chatmessage", messageRouter);
router.use("/favs", favsRouter);
router.use("/admin", adminRouter)
router.use("/notifications", notifRouter)


router.use("/loginGoogle" , googleRouter)
module.exports = router;
