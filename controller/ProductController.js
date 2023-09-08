import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

// GET single product
export const getProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params

    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
        userId
      }
    })

    res.status(200).json(product)
  } catch (error) {
    console.log(error)
  }
}

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 0
    const limit = Number(req.query.limit) || 10
    const search = req.query.search_query || ""
    const offset = page * limit
    const totalRows = await prisma.product.count({
      where: {
        name: {
          contains: search
        }
      }
    })
    const totalPage = Math.ceil(totalRows / limit)
    const result = await prisma.product.findMany({
      skip: offset,
      take: limit,
      where: {
        name: {
          contains: search
        }
      }
    })
    
    res.status(200).json({
      result,
      page,
      limit,
      totalRows,
      totalPage,
    })
  } catch (error) {
    console.log(error)
  }
}

// GET user products
export const getUserProducts = async (req, res) => {
  try {
    const userId = req.params.userId
    const page = Number(req.query.page) || 0
    const limit = Number(req.query.limit) || 5
    const search = req.query.search_query || ""
    const offset = page * limit
    const totalRows = await prisma.product.count({
      where: {
        userId,
        name: {
          contains: search
        }
      }
    })
    const totalPage = Math.ceil(totalRows / limit)
    const result = await prisma.product.findMany({
      skip: offset,
      take: limit,
      where: {
        userId,
        name: {
          contains: search
        }
      }
    })

    res.json({
      result,
      page,
      limit,
      totalRows,
      totalPage
    })
  } catch (error) {
    console.log(error)
  }
}

// CREATE user product
export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.sendStatus(401)
    if (!name) return res.status(400).json({ message: "Name is required"})
    if (!price) return res.status(400).json({ message: "Price is required"})

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403)
    })
    
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) return res.sendStatus(404)
    if (user.refresh_token !== refreshToken) return res.sendStatus(403)

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        userId
      }
    })

    res.status(201).json(product)
  } catch (error) {
    console.log(error)
  }
}

// EDIT user product
export const editProduct = async (req, res) => {
  try {
    const { name, price } = req.body
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.sendStatus(401)
    if (!name) return res.status(400).json({ message: "Name is required"})
    if (!price) return res.status(400).json({ message: "Price is required"})

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403)
    })
    
    const { userId, productId } = req.params

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) return res.sendStatus(404)
    if (user.refresh_token !== refreshToken) return res.sendStatus(403)

    const isProductExist = await prisma.product.findUnique({
      where: {
        id: Number(productId),
        userId
      }
    })

    if (!isProductExist) return res.sendStatus(404)

    const product = await prisma.product.update({
      where: {
        id: Number(productId)
      },
      data: {
        name,
        price: Number(price)
      }
    })

    res.status(201).json(product)
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
}

// DELETE user product
export const deleteProduct = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.sendStatus(401)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403)
    })
    
    const { userId, productId } = req.params

    const user = await prisma.user.findUnique({
      where: {
        id: userId  
      }
    })

    if (!user) return res.sendStatus(404)
    if (user.refresh_token !== refreshToken) return res.sendStatus(403)

    const isProductExist = await prisma.product.findUnique({
      where: {
        id: Number(productId),
        userId
      }
    })

    if (!isProductExist) return res.sendStatus(404)

    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(productId),
        userId
      }
    })

    res.status(200).json({
      message: "Product deleted",
      data: deletedProduct
    })
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
}