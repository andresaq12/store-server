import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { v2 as cloudinary } from 'cloudinary'
import { authenticateJWT, autorizationUser } from "../middleware/authMiddleware"
import multer from "multer"

const router = Router()
const prisma = new PrismaClient()
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

// FILTER FOR MULTER - ONLY IMAGES
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Allowed images files (jpeg, png, gif, webp, avif)'), false)
  }
}

// CONFIG MULTER
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
})

// CONFIG CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// GET ALL PRODUCTS - PUBLIC
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany()
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching products' })
  }
})

// GET FILTERED PRODUCTS - PUBLIC
router.get('/products/filter', async (req, res) => {
  const { brand, min, max } = req.query
  try {
    const filters = {}
    if (brand) {
      filters.brand = brand
    }
    if (min !== undefined || max !== undefined) {
      filters.price = {}
      if (min !== undefined) filters.price.gte = Number(min)
      if (max !== undefined) filters.price.lte = Number(max)
    }
    const products = await prisma.product.findMany({
      where: filters
    })
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error filtering products' })
  }
})

// GET PRODUCT BY ID - PUBLIC
router.get('/products/:id', async (req, res) => {
  const productId = req.params.id
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      }
    })
    res.json(product)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching product' })
  }
})

// POST A PRODUCT - ADMIN
router.post('/products', authenticateJWT, autorizationUser('admin'), upload.single('image'), async (req, res) => {
  const imageFile = req.file
  const { price, stock, categoryId } = req.body
  try {
    if (!imageFile) {
      return res.status(400).json({ message: 'Image not found' })
    }

    const { secure_url } = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'ecommerce'
    })
    if (!secure_url) {
      return res.status(500).json({ message: 'Image not loaded correctly' })
    }

    const newBody = {
      ...req.body,
      imageUrl: secure_url,
      price: Number(price),
      stock: Number(stock),
      categoryId: Number(categoryId)
    }
    const newProduct = await prisma.product.create({
      data: newBody
    })
    res.json(newProduct)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error saving product', error: error })
  }
})

// UPDATE A PRODUCT - ADMIN
// verificar si 'id' es numero o string
router.patch('/products/:id', authenticateJWT, autorizationUser('admin'), async (req, res) => {
  const productId = req.params
  try {
    const updateProduct = await prisma.product.update({
      where: {
        id: productId
      },
      data: req.body
    })
    res.json(updateProduct)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating product' })
  }
})

// DELETE A PRODUCT - ADMIN
router.delete('/products/:id', authenticateJWT, autorizationUser('admin'), async (req, res) => {
  const productId = req.params.id
  try {
    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId
      }
    })
    res.json(deleteProduct)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error deleting product' })
  }
})

export default router