const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const checkoutRoutes = require('./routes/checkoutRoutes')
const orderRoutes = require('./routes/orderRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const subscribeRoute = require("./routes/subscribeRoute")
const adminRoutes = require('./routes/adminRoutes')
const adminProductRoutes = require('./routes/adminProductRoutes')
const adminOrderRoutes = require('./routes/adminOrderRoutes')
const replicateRoutes = require('./routes/replicateRoutes')

const app = express()

dotenv.config()
connectDB()


const allowedOrigins = [
    'http://localhost:5173', // Your React local port (or 3000)
    'https://e-commerce-web-application-frontend.onrender.com' // Replace with your actual deployed Render URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// app.use(express.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000

app.use((req, res, next) => {
    // This will run on every request
    if (req.method === 'POST' && req.path === '/api/users/login') {
        // Check if the JSON body parser worked
        if (Object.keys(req.body).length === 0) {
            console.error("DEBUG: req.body IS EMPTY! JSON Parser failed or ran too late.");
        } else {
            console.log("DEBUG: req.body is populated successfully.");
        }
    }
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api', subscribeRoute)
app.use('/api/replicate', replicateRoutes)


// Admin
app.use('/api/admin/users', adminRoutes)
app.use('/api/admin/products', adminProductRoutes)
app.use('/api/admin/orders', adminOrderRoutes)


app.listen(port, () => {
    console.log(`Server app listening on port ${port}`)
})
