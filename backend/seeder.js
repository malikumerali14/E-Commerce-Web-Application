const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require("./models/Product")
const User = require("./models/User")
const Cart = require('./models/Cart')
const products = require("./data/product")

dotenv.config()

// Connecting with the database
mongoose.connect(process.env.MONGO_URI)


//Function to seed data
const seedData = async () => {
    try {
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany()

        // Creating a default admin user 
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@gmail.com",
            password: "123456",
            role: "admin"
        })

        //Assign the default user id to each product
        const userId = createdUser._id

        const sampleProducts = products.map((product) => {
            return { ...product, user: userId } 
        })

        // Seeding into the database
        await Product.insertMany(sampleProducts)
        console.log("Product Data Seeded Successfully")

        process.exit()

    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
        process.exit(1)
    }


}

seedData()