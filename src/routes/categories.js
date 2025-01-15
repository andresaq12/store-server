import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get('/categories', async (req, res) => {
  try {
    const category = await prisma.category.findMany()
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' })
  }
})

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.body
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      }
    })
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' })
  }
})

router.post('/categories', async (req, res) => {
  try {
    const newCategory = await prisma.category.create({
      data: req.body
    })
    res.json(newCategory)
  } catch (error) {
    res.status(500).json({ message: 'Error saving category' })
  }
})

router.patch('/categories', async (req, res) => {
  try {
    const { id } = req.body
    const updateCategory = await prisma.category.update({
      where: {
        id: id
      },
      data: req.body
    })
    res.json(updateCategory)
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' })
  }
})

export default router