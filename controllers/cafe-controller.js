const ApiError = require("../exception/api-error");
const CafeModel = require("../models/cafe-model");
const ordersReadyModel = require("../models/orders-ready-model");
const userModel = require("../models/user-model");
const CafeService = require("../service/cafe-service");
const tokenService = require("../service/token-service");

class CafeController {
  async getAll(req, res, next) {
    try {
      let allCafe = await CafeService.getAll()
      res.json(allCafe);
    } catch (e) {
      next(e);
    }
  }

  async getOrdersChef(req, res, next) {
    try {
      let { id } = req.params
      let order = await CafeService.getOrdersChef(id)
      res.json(order)
    } catch (e) {
      next(e)
    }
  }
  async getTableOrders(req, res, next) {
    try {
      let { id, tableId } = req.params
      let order = await CafeService.getTableOrders(id, tableId)
      res.json(order)
    } catch (e) {
      next(e)
    }
  }
  async getCafeById(req, res, next) {
    try {
      await CafeModel.findOne({ _id: req.params.id }).populate("tables menu").then((response) => {
        res.json(response);
      })
    } catch (e) {
      next(e);
    }
  }

  async createCafe(req, res, next) {
    try {
      const { img } = req.files;
      const cafe = await CafeService.create(img, req.body.name)
      res.json(cafe);
    } catch (e) {
      next(e);
    }
  }
  async createMenu(req, res, next) {
    try {
      const { id } = req.params
      const { name, price, type } = req.body
      const { img } = req.files
      let add = await CafeService.createMenu(id, name, price, img, type)
      res.json(add)
    } catch (e) {
      next(e)
    }
  }
  async createTable(req, res, next) {
    try {
      const { id } = req.params
      const { number } = req.body
      const createTable = await CafeService.createTable(id, number)
      res.json(createTable)
    } catch (e) {
      next(e)
    }
  }
  async toOrder(req, res, next) {
    try {
      const { id, num } = req.params
      const { productId, orderId } = req.body
      const toOrder = await CafeService.toOrder(id, productId, num, orderId)
      res.json(toOrder)
    } catch (e) {
      next(e)
    }
  }
  async orderReady(req, res, next) {
    try {
      const { cafeId, tableId } = req.params;
      const { checkedProduct } = req.body
      const order = await CafeService.orderReady(cafeId, tableId, checkedProduct)
      res.json(order)
    } catch (e) {
      next(e)
    }
  }
  async getOrderReady(req, res, next) {
    try {
      const { cafeId } = req.params;
      const order = await CafeService.getOrdersReady(cafeId)
      res.json(order)
    } catch (e) {
      next(e)
    }
  }
  async toWaiter(req, res, next) {
    try {
      const { cafeId } = req.params;
      const { orderId } = req.body;
      const toWaiter = await CafeService.toWaiter(cafeId, orderId)
      res.json(toWaiter)
    } catch (e) {
      next(e)
    }
  }
  async deleteOrder(req, res, next) {
    try {
      const { id } = req.params
      const authorizationHeader = req.headers.authorization;
      const accessToken = authorizationHeader.split(" ")[1];
      await ordersReadyModel.findByIdAndDelete(id)

      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        throw ApiError.UnauthorizedError();
      }
      let user = await userModel.findById(userData.id);
      if (!user) {
        throw ApiError.UnauthorizedError();
      }
      const order = await ordersReadyModel.findOne({ cafe_id: user.cafe_id })
      if (!order) {
        user.isOccupied = false
        user.order = null
      } else {
        user.isOccupied = true
        user.order = order
      }
      user.save();
      res.json("deleted")
    } catch (e) {
      next(e)
    }
  }
  async checkFood(req, res, next) {
    try {
      const { id } = req.params
      const { orderId, checked } = req.body
      const token = req.headers.authorization.split(" ")[1]
      const check = await CafeService.checkFood(token, id, orderId, checked)
      res.json(check)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new CafeController();
