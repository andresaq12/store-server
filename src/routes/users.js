import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticateJWT, autorizationUser } from "../middleware/authMiddleware.js"

const router = Router()
const prisma = new PrismaClient()

// GET ALL USERS - ADMIN
router.get('/users', authenticateJWT, autorizationUser('admin'), async (req, res) => {
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

// GET USER PROFILE - USER AND ADMIN
router.get('/users/profile', authenticateJWT, autorizationUser('user', 'admin'), async (req, res) => {
  const { id, googleId } = req.user
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id || undefined,
        googleId: googleId || undefined
      }
    })
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id
    //   }
    // })
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching user' })
  }
})

// GET USER BY ID - ADMIN
router.get('/users/:id', authenticateJWT, autorizationUser('admin'), async (req, res) => {
  const userId = req.params.id
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId)
      }
    })
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error retrieving user' })
  }
})

// GET ORDERS FROM USER - USER AND ADMIN
router.get('/users/orders', authenticateJWT, autorizationUser('user', 'admin'), async (req, res) => {
  const { id } = req.id
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: id
      }
    })
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching orders from user' })
  }
})

// UPDATE USER - USER
router.patch('/users/update', authenticateJWT, autorizationUser('user'), async (req, res) => {
  const { id } = req.id
  try {
    const updateUser = await prisma.user.update({
      where: {
        id
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