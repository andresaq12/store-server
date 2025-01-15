import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' })
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.body
    const product = await prisma.product.findUnique({
      where: {
        id: id
      }
    })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' })
  }
})

router.post('/products', async (req, res) => {
  try {
    const newProduct = await prisma.product.create({
      data: req.body
    })
    res.json(newProduct)
  } catch (error) {
    res.status(500).json({ message: 'Error saving product' })
  }
})

router.patch('/products', async (req, res) => {
  try {
    const { id } = req.body
    const updateProduct = await prisma.product.update({
      where: {
        id: id
      },
      data: req.body
    })
    res.json(updateProduct)
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' })
  }
})

export default router