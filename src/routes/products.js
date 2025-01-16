import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { v2 as cloudinary } from 'cloudinary'
import multer from "multer"
import fs from 'fs'
import path from 'path'

const router = Router()
const prisma = new PrismaClient()

// GET CURRENT PATH - ES6
const currentPath = new URL(import.meta.url).pathname
const normalizedPath = currentPath.replace(/^\/([A-Za-z]):/, '$1:')
const parentPath = path.resolve(normalizedPath, '../../../')
const filePath = path.join(parentPath, 'uploads');

const upload = multer({ dest: filePath })

// CONFIG CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// Delete temp image
const deleteTempFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err)
        reject(err)
      } else {
        console.log('Temporary file successfully deleted')
        resolve()
      }
    });
  });
};

// GET ALL PRODUCTS
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany()
    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching products' })
  }
})

// GET FILTERED PRODUCTS
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

// GET PRODUCT BY ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id)
      }
    })
    res.json(product)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching product' })
  }
})

// POST A PRODUCT
router.post('/products', upload.single('image'), async (req, res) => {
  const imageFile = req.file
  const imagePath = path.join(filePath, req.file.filename);
  try {
    const { secure_url } = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'ecommerce'
    })
    if (!secure_url) {
      res.status(500).json({ message: 'Image not loaded correctly' })
    }
    deleteTempFile(imagePath).catch((err) => {
      console.error('Error while trying to delete the temporary file: ', err)
    })
    const newBody = {
      ...req.body,
      imageUrl: secure_url,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      categoryId: Number(req.body.categoryId)
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

// UPDATE A PRODUCT
router.patch('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateProduct = await prisma.product.update({
      where: {
        id: Number(id)
      },
      data: req.body
    })
    res.json(updateProduct)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating product' })
  }
})

// DELETE A PRODUCT
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleteProduct = await prisma.product.delete({
      where: {
        id: Number(id)
      }
    })
    res.json(deleteProduct)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error deleting product' })
  }
})

export default router