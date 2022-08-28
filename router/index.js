const Router = require("express").Router;
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");

const cafeController = require("../controllers/cafe-controller");
const userController = require("../controllers/user-controller");

router.post("/create-cafe", cafeController.createCafe);

router.get("/get-cafe/", cafeController.getAll);
router.get("/get-cafe/:id", cafeController.getCafeById);

router.post("/create-table/:id", cafeController.createTable)

router.post("/create-menu/:id", cafeController.createMenu)

router.post("/check-order/:id", cafeController.checkFood);

router.post("/to-order/:id/:num", cafeController.toOrder)

router.get("/to-chef/:id", cafeController.getOrdersChef)

router.post("/order-ready/:cafeId/:tableId", cafeController.orderReady)

router.get("/get-order-ready/:cafeId/", cafeController.getOrderReady)

router.get("/my-order/:id/:tableId", cafeController.getTableOrders)

router.get("/delete-order/:id", cafeController.deleteOrder)

router.post("/to-waiter", cafeController.toWaiter);


router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }),
    userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);

router.get("/profile/", authMiddleware,  userController.profile);



module.exports = router;
