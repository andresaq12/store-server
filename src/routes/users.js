import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' })
  }
})

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.body
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      }
    })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' })
  }
})

router.post('/users', async (req, res) => {
  try {
    const users = await prisma.user.create({
      data: req.body
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error saving user' })
  }
})

router.patch('/users', async (req, res) => {
  try {
    const { id } = req.body
    const updateUser = await prisma.user.update({
      where: {
        id: id
      },
      data: req.body
    })
    res.json(updateUser)
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' })
  }
})

export default router