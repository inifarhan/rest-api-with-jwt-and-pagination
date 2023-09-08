import express from "express"
import {
  getAllUsers,
  getUserById,
  login,
  logout,
  register,
  updateUser
} from "../controller/UserController.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { refreshToken } from "../controller/refreshToken.js"

const router = express.Router()

router.get("/users", getAllUsers)
router.get("/users/:userId", getUserById)
router.put("/users/:userId", verifyToken, updateUser)

router.post("/auth/register", register)
router.post("/auth/login", login)
router.delete("/auth/logout", logout)
router.get("/token", refreshToken)

export default router