import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
}

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    res.status(200).json(user)
  } catch (error) {
    console.log(error)
  }
}

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (!name) return res.status(400).json({ message: "Name is required"})
    if (!email) return res.status(400).json({ message: "Email is required"})
    if (!password) return res.status(400).json({ message: "Password is required"})
    if (!confirmPassword) return res.status(400).json({ message: "Confirm Password is required" })
    if (password !== confirmPassword) return res.status(400).json({ message: "Password doesn't match" })

    const isUserExist = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (isUserExist) return res.status(400).json({ message: "Email is already exist" })

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    res.status(201).json({ message: "Register Successfull"})
  } catch (error) {
    console.log(error)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email) return res.status(400).json({ message: "Email is required"})
    if (!password) return res.status(400).json({ message: "Password is required" })
    
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (!user) return res.status(400).json({ message: "Email not found" })

    const isMatched = await bcrypt.compare(password, user.password)
    if (!isMatched) return res.status(400).json({ message: "Password is wrong" })

    const userId = user.id
    const userEmail = user.email
    const userName = user.name

    const accessToken = jwt.sign({ userId, userEmail, userName }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15s'
    })
    const refreshToken = jwt.sign({ userId, userEmail, userName }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    })

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        refresh_token: refreshToken
      } 
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({ accessToken })
  } catch (error) {
    console.log(error)
  }
}

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.sendStatus(401) 
    if (!name) return res.status(400).json({ message: "Name is required"})
    if (!email) return res.status(400).json({ message: "Email is required" })

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403)
    })

    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userId
      }
    })

    if (!user) return res.sendStatus(403)
    if (user.refresh_token !== refreshToken) return res.sendStatus(403)

    await prisma.user.update({
      where: {
        id: req.params.userId
      },
      data: {
        name,
        email,
      }
    })

    res.status(200).json({ message: "User updated"})
  } catch (error) {
    console.log(error)
  }
}

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.sendStatus(204)

    const user = await prisma.user.findFirst({
      where: {
        refresh_token: refreshToken
      }
    })

    if (!user) return res.sendStatus(204)

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        refresh_token: null
      }
    })

    res.clearCookie("refreshToken")
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
  }
}