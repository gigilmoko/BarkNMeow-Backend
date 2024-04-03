import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import {
  createOrder,
  getAdminOrders,
  getMyOrders,
  getOrderDetails,
  proccessOrder,
  processPayment,
  getOrderDetailsCount,
  getOrdersSumByMonth,
  getMostOrderedProduct
} from "../controllers/order.js";

const router = express.Router();

router.post("/new", isAuthenticated, createOrder);
router.get("/my", isAuthenticated, getMyOrders);
router.post("/payment", isAuthenticated, processPayment);
router.get("/admin", isAuthenticated, isAdmin, getAdminOrders);
router.get("/Orders-Details-Count", getOrderDetailsCount);
router.get("/Orders-Sum-By-Month", getOrdersSumByMonth);
router.get("/Most-Ordered-Product", getMostOrderedProduct);

router
  .route("/single/:id")
  .get(isAuthenticated, getOrderDetails)
  .put(isAuthenticated, isAdmin, proccessOrder);

export default router;
