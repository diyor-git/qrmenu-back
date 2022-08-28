const CafeModel = require("../models/cafe-model");
const { v4 } = require("uuid");
const path = require("path");
const cafeModel = require("../models/cafe-model");
const ApiError = require("../exception/api-error");
const TablesModel = require("../models/tables-model");
const MenusModel = require("../models/menus-model");
const OrdersModel = require("../models/orders-model");
const UserModel = require("../models/user-model");
const tokenService = require("./token-service");
const ordersReadyModel = require("../models/orders-ready-model");

class CafeService {
    async create(img, name) {
        if (!img || !name) {
            throw ApiError.BadRequest("Неполные данные")
        }
        let fileName = v4() + ".jpg";
        img.mv(path.resolve(__dirname, "..", "static", fileName));
        const cafe = new cafeModel({
            img: fileName,
            name,
        });
        await cafe.save();
        return cafe
    }
    async getAll() {
        let allCafe = await CafeModel.find()
        return allCafe
    }
    async createTable(id, number) {
        let table = new TablesModel({
            number,
            isOccupied: false
        })
        let cafe = await CafeModel.findOne({ _id: id })
        cafe.tables.push(table)
        await table.save()
        await cafe.save()
        return cafe
    }
    async createMenu(id, name, price, img, type) {
        if (!id || !price || !name) {
            throw new ApiError.BadRequest()
        }
        let cafe = await CafeModel.findOne({ _id: id });
        if (!cafe) {
            throw new ApiError.BadRequest("Этот кафе не существует")
        }
        let fileName = v4() + ".jpg";
        img.mv(path.resolve(__dirname, "..", "static", fileName));

        let menu = new MenusModel({
            name, price,
            img: fileName,
            type
        })
        cafe.menu.push(menu);
        await menu.save();
        await cafe.save();
        return cafe
    }


    async toOrder(id, productId, tableNum, orderId) {
        if (!id) {
            throw new ApiError.BadRequest()
        }
        let cafe = await CafeModel.findOne({ _id: id }).populate("tables")
        if (!cafe) {
            throw new ApiError.BadRequest("Этот кафе не существует")
        }
        let order
        cafe = cafe.tables.find(el => el._id == tableNum)

        if (orderId == null) {
            order = new OrdersModel({
                // product: productId.map(el => el)
                product: productId, tableNum: cafe.number, tableId: cafe._id.toString()
            })
            cafe.orders = order
        } else {
            order = await OrdersModel.findOne({ _id: orderId })
            order.product.push({ _id: productId })
            // productId.map(el => order.product.push({ _id: el }))
        }
        cafe.isOccupied = true
        await order.save()
        await cafe.save()
        return this.getTableOrders(id, tableNum)
    }

    async getOrdersChef(cafeId) {
        if (!cafeId) {
            throw new ApiError.BadRequest()
        }
        let cafe = await CafeModel.findOne({ _id: cafeId }).populate("tables")
        let ord = []
        for (const el of cafe.tables) {
            if (el.isOccupied == true && el.orders) {
                let orders = await OrdersModel.findOne({ _id: el.orders.toString() }).populate("product");
                ord.tableNum = el.number
                ord.tableId = el._id
                if (orders.checked == true) {
                    ord.push(orders);
                }
            }
        }
        return ord
    }
    async orderReady(cafeId, tableId, checkedProduct = []) {
        if (!tableId || !cafeId) {
            throw new ApiError.BadRequest()
        }
        let cafe = await CafeModel.findOne({ _id: cafeId }).populate("tables")
        cafe = cafe.tables.find(el => el._id == tableId)
        const ord2 = await OrdersModel.findOne({ _id: cafe.orders.toString() }).populate("product")


        checkedProduct.map((el) => {
            ord2.product.map(ele => {
                if (ele._id == el) {
                    if (ord2.ordersReady.indexOf(ele._id) == -1) {
                        ord2.ordersReady.push(ele._id)
                    }
                }
            })
        })
        ord2.save()

        if (ord2.ordersReady.length == ord2.product.length) {
            const orderReady = new ordersReadyModel({
                tableNum: cafe.number, tableId: cafe._id, product: ord2.product.map(el => el), cafeId: cafeId
            })
            cafe.orders = null
            cafe.isOccupied = false
            await orderReady.save()
            await cafe.save()
            this.toWaiter(cafeId, orderReady)
        } else {
            return "Добавлено"
        }

    }
    async getOrdersReady(cafeId) {
        const orderReady = await ordersReadyModel.find({ cafeId }).populate("product")
        return orderReady
    }

    async getTableOrders(id, tableId) {
        if (!id || !tableId) {
            throw new ApiError.BadRequest()
        }
        let myOrders = []
        let ord = []
        let cafe = await CafeModel.findOne({ _id: id }).populate("tables menu")

        let tableOrd = cafe.tables.find(el => el._id == tableId)
        let orders = await OrdersModel.find()
        let menu = cafe.menu

        if (!tableOrd?.orders || !tableOrd) {
            throw new ApiError.BadRequest("Столик не занят")
        }

        orders.find(el => {
            if (el._id.toString() == tableOrd.orders.toString()) {
                ord.push({ orderId: el._id })
                myOrders.push(el.product)
            }
        })
        menu.map(el => {
            if (myOrders.toString().includes(el._id.toString())) {
                ord.push(el)
            }
        })

        return ord
    }
    async checkFood(token, id, orderId, checked) {
        const userData = tokenService.validateAccessToken(token);
        if (userData.role != "admin") {
            throw new ApiError.Forbidden()
        }
        let orders = await OrdersModel.findById(orderId).populate("product")
        orders.checked = checked
        await orders.save()
        return orders
    }
    async toWaiter(cafe_id, orderReady) {
        if (!cafe_id || !orderReady) {
            throw new ApiError.BadRequest()
        }
        let users = await UserModel.findOne({ role: "waiter", cafe_id: cafe_id, isOccupied: false })
        if (!users) {
            throw new ApiError.BadRequest("Все официанты заняты")
        }
        users.order = orderReady
        users.isOccupied = true
        await users.save()
        return users
    }
}

module.exports = new CafeService()