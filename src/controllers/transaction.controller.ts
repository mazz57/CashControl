import express from "express"
import { transactionModel } from "../models/Transaction.model.js";
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

interface ITransactionBody{
    title?: String,
    amount?: Number,
    type?: 'income' | 'expense',
    category?: String,
    description?: String
}

interface ITransactionPrams{
    id : String;
}
//Add a new transaction
export const addTransaction = async (req:Request<ITransactionBody>, res:Response) => {
    console.log("initial")
    const {title, amount, type, category, description } = req.body;
    console.log("before1")
    try {
        console.log("reached1")
        const newTranscation = await transactionModel.create({
            title, amount, type, category, description
        })
console.log("reached2")
        res.status(201).json({
            message: "transaction was successful",
            data: newTranscation
        })
    } catch(error) {
        console.error("Error creating transcation:", error);

        res.status(500).json({
        message:"Transaction failed"
        })
    }
}

//List or filter
export const getTransaction = async (req:Request<ITransactionPrams>, res:Response) => {
    try {
    const transaction = await transactionModel.find();

    res.json({ transaction })

    } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

//Single record
export const getTransactionById = async (req:Request<ITransactionPrams>, res:Response) => {
    try {
        const id = req.params.id;
        const transaction = await transactionModel.findById(id)

        if(!transaction) {
            res.json({message: "Transaction not found"})
        }

        res.json({
            transaction
        })
   } catch (error) {
        res.status(500).json({
            message: "server error"
        })
   }
}

//Edit
export const updateTransaction = async (req:Request<ITransactionPrams, ITransactionBody>, res:Response) => {
    try {
        const id = req.params.id;
        const {title, amount, type, category, description } = req.body; 

        const transaction = await transactionModel.findById(id);
        if(!transaction){
            return res.status(404).json({message: "Transaction not found"});
        }

        if (title) transaction.title = title;
        if (amount) transaction.amount = amount;
        if (type) transaction.type = type;
        if (category) transaction.category = category;
        if (description) transaction.description = description;

       const updatedTransaction = await transaction.save()

       return res.status(200).json({
        message: "transaction updated successfully",
        data: updateTransaction
       })
    } catch (error) {
        return res.status(500).json({message: "server error"});
    }
}

//Remove
export const deleteTransaction = async (req:Request<ITransactionPrams>, res:Response) => {
    try {
        const id = req.params.id;
        
        const deleteTransaction = await transactionModel.findByIdAndDelete(id);
        if(!deleteTransaction) {
            return res.status(404).json({message: "transaction not found"});
        }

        return res.status(200).json({
            message: "Transaction deleted successfully.",
            data: deleteTransaction,
        })
    }catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
}

// Income/Expense totals
export const getSummart = async (req:Request, res:Response) => {

}