import { Router } from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import dotenv from 'dotenv'

dotenv.config()

const router = Router()
const prisma = new PrismaClient()

// LOGIN - USER AND PASSWORD
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) return res.status(400).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    }).send(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error login user' })
  }
})

// REGISTER - USER AND PASSWORD
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (user) return res.status(400).json({ message: 'User already exists' })
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
    const newUserData = {
      email,
      password: hashedPassword
    }
    const newUser = await prisma.user.create({
      data: newUserData
    })

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    }).send(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error register user' })
  }
})

router.get('/auth/google')

router.get('/auth/google/callback', async (req, res) => {
  try {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    }).send(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error callback Google' })
  }
})


export default router