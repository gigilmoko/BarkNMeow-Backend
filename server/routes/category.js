import express from "express";
const router = express.Router();
import { multipleUpload, singleUpload } from "../middlewares/multer.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import {
    createcategory,
    addCategoryImage,
    updateCategory,
    getCategoryDetails,
    deleteCategoryImage,
    deleteCategory,
    getAllCategories
} from "../controllers/category.js";

router.get("/all", getAllCategories);
router.post("/new", isAuthenticated, isAdmin, multipleUpload, createcategory);
router
    .route("/single/:id")
    .get(getCategoryDetails)
    .put(isAuthenticated, isAdmin, updateCategory)
    .delete(isAuthenticated, isAdmin, deleteCategory);
router
    .route("/images/:id")
    .post(isAuthenticated, isAdmin, multipleUpload, addCategoryImage)
    .delete(isAuthenticated, isAdmin, deleteCategoryImage);


export default router;
