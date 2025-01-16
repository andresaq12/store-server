import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

// GET ALL CATEGORIES
router.get('/categories', async (req, res) => {
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

// GET CATEGORY BY ID
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      }
    })
    res.json(category)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching category' })
  }
})

// POST A CATEGORY
router.post('/categories', async (req, res) => {
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

// UPDATE A CATEGORY
router.patch('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateCategory = await prisma.category.update({
      where: {
        id: id
      },
      data: req.body
    })
    res.json(updateCategory)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating category' })
  }
})

// DELETE A CATEGORY
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteCategory = await prisma.category.findUnique({
      where: {
        id: id
      }
    })
    res.json(deleteCategory)
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' })
  }
})

export default router