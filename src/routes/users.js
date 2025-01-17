import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticateJWT, checkUserStatus } from "../middleware/authMiddleware.js"

const router = Router()
const prisma = new PrismaClient()

// GET ALL USERS
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching users' })
  }
})

// GET USER PROFILE - USER
router.get('/users/profile', authenticateJWT, checkUserStatus, async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      }
    })
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching user' })
  }
})

// GET USER BY ID - ADMIN
router.get('/users/:id', authenticateJWT, checkUserStatus, async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error retrieving user' })
  }
})

// GET ORDERS FROM USER
router.get('/users/:id/orders', async (req, res) => {
  const { id } = req.params
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: Number(id)
      }
    })
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching orders from user' })
  }
})

// POST AN USER
router.post('/users', async (req, res) => {
  try {
    const users = await prisma.user.create({
      data: req.body
    })
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error saving user' })
  }
})

// UPDATE USER
router.patch('/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updateUser = await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: req.body
    })
    res.json(updateUser)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating user' })
  }
})

export default router