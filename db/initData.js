import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()


const initializeDB = async () => {
  try {
    const existingData = await prisma.user.findMany()
    if (existingData.length === 0) {
      console.log('No products found, loading initial data...')

      await prisma.user.create({
        data: initialUsers
      })

    } else {
      console.log('Data already exists in the database. No changes were made')
    }
  } catch (error) {

  }
}

initialUsers = {
  name: ADMIN,
  email: 'admin123!@store.com',
}

intialProducts = {

}

initialCategories = [{
  name: 'Polos',
}, {
  name: 'Pantalones'
}]