import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// CHECK JWT AND GET INFO FROM USER
export const authenticateJWT = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) { return res.status(401).json({ message: 'No token provided' }) }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role }

    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// CHECK ROL FROM USER
export const autorizationUser = (requiredRoles) => {
  return (req, res, next) => {
    const { role } = req.user

    if (!requiredRoles.includes(role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource.' })
    }

    next()
  }
}