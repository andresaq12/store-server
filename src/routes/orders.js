import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' })
  }
})

router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.body
    const order = await prisma.order.findUnique({
      where: {
        id: id
      }
    })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' })
  }
})

router.post('/orders', async (req, res) => {
  try {
    const newOrder = await prisma.order.create({
      data: req.body
    })
    res.json(newOrder)
  } catch (error) {
    res.status(500).json({ message: 'Error saving order' })
  }
})

router.patch('/orders', async (req, res) => {
  try {
    const { id } = req.body
    const updateOrder = await prisma.order.update({
      where: {
        id: id
      },
      data: req.body
    })
    res.json(updateOrder)
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' })
  }
})

export default router