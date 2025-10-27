import express  from "express";
import { transactionModel } from "../models/Transaction.model.js";
import { addTransaction, getTransaction, getTransactionById, updateTransaction, deleteTransaction } from "../controllers/transaction.controller.js";



const router = express.Router()

router.post('/', addTransaction);
router.get('/', getTransaction);
router.get('/:id', getTransactionById)
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);


export default router;