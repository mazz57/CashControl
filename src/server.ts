import express from "express";
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transaction.routes.js"

const app = express()
app.use(express.json());

// Routes
app.use("/api/transactions", transactionRoutes)

// connect DB
connectDB()

app.listen(process.env.PORT)




