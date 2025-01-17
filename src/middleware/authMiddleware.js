import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

export const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) { return res.status(401).json({ message: 'No token provided' }) }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.id = decoded.id
    req.role = decoded.role
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// CHECK STATUS AND ROL FROM USER
export const autorizationUser = (requiredRole) => {
  return async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.id
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Your account is suspended. Please contact support.' })
    }

    if (req.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' })
    }

    next()
  }
}

export const authorizeRole = (req, res, next) => {

}