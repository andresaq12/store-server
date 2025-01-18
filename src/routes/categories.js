import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticateJWT, autorizationUser } from '../middleware/authMiddleware.js'

const router = Router()
const prisma = new PrismaClient()

// GET ALL CATEGORIES - USER AND ADMIN
router.get('/categories', authenticateJWT, autorizationUser('user', 'admin'), async (req, res) => {
  try {
    const category = await prisma.category.findMany({
      orderBy: {
        id: 'asc'
      }
    })
    res.json(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching categories' })
  }
})

// GET CATEGORY BY ID - ADMIN
router.get('/categories/:id', authenticateJWT, autorizationUser('admin'), async (req, res) => {
  const categoryId = req.params.id
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId)
      }
    })
    res.json(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching category' })
  }
})

// POST A CATEGORY - ADMIN
router.post('/categories', authenticateJWT, autorizationUser('admin'), async (req, res) => {
  try {
    const newCategory = await prisma.category.create({
      data: req.body
    })
    res.json(newCategory)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error saving category' })
  }
})

// UPDATE A CATEGORY - ADMIN
router.patch('/categories/:id', authenticateJWT, autorizationUser('admin'), async (req, res) => {
  const categoryId = req.params.id
  try {
    const updateCategory = await prisma.category.update({
      where: {
        id: Number(categoryId)
      },
      data: req.body
    })
    res.json(updateCategory)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating category' })
  }
})

// DELETE A CATEGORY - ADMIN
router.delete('/categories/:id', authenticateJWT, autorizationUser('admin'), async (req, res) => {
  const categoryId = req.params.id
  try {
    const deleteCategory = await prisma.category.findUnique({
      where: {
        id: Number(categoryId)
      }
    })
    res.json(deleteCategory)
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' })
  }
})

export default router