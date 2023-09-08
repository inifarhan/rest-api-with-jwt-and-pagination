import express from "express"
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProduct,
  getUserProducts
} from "../controller/ProductController.js"
import { verifyToken } from "../middlewares/verifyToken.js"

const router = express.Router()

router.get("/products", getAllProducts)
router.get("/:userId/products", getUserProducts)
router.get("/:userId/products/:productId", getProduct)
router.post("/:userId/products", verifyToken, createProduct)
router.put("/:userId/products/:productId", verifyToken, editProduct)
router.delete("/:userId/products/:productId", verifyToken, deleteProduct)

export default router