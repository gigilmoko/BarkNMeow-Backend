import express from "express";
import { getAllComments, addComment, deleteComment, getProductRatings } from "../controllers/comment.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// API endpoints
router.get("/all/:productId", getAllComments);
router.post("/create", isAuthenticated, addComment);
router.delete("/:id", isAuthenticated, deleteComment);
router.get('/products/:productId/ratings', getProductRatings);

export default router;