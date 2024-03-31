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

router.get("/all", getAllCategories); // Get all categories
router.post("/new", isAuthenticated, isAdmin, multipleUpload, createcategory); // Create a new category
router
    .route("/single/:id")
    .get(getCategoryDetails) // Get details of a single category
    .put(isAuthenticated, isAdmin, updateCategory) // Update a single category
    .delete(isAuthenticated, isAdmin, deleteCategory); // Delete a single category

router
    .route("/images/:id")
    .post(isAuthenticated, isAdmin, multipleUpload, addCategoryImage) // Add images to a category
    .delete(isAuthenticated, isAdmin, deleteCategoryImage); // Delete an image from a category



export default router;
