import express from "express";
import {
  addProductImage,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
  getAllProducts,
  getProductDetails,
  updateProduct,
} from "../controllers/product.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { multipleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.get("/admin", isAuthenticated, isAdmin, getAdminProducts);

router
  .route("/single/:id")
  .get(getProductDetails)
  .put(isAuthenticated, isAdmin, updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);

router.post("/new", isAuthenticated, isAdmin, multipleUpload, createProduct);

router
  .route("/images/:id")
  .post(isAuthenticated, isAdmin, multipleUpload, addProductImage)
  .delete(isAuthenticated, isAdmin, deleteProductImage);


export default router;
