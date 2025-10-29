import express from "express"
import { transactionModel } from "../models/Transaction.model.js";
import type { Request, Response } from "express";
import { log } from "console";
import { start } from "repl";

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
    
    const {title, amount, type, category, description } = req.body;
    
    try {
        
        const newTranscation = await transactionModel.create({
            title, amount, type, category, description
        })

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
        
        const transaction = await transactionModel.findById(id);

        if(!transaction) {
            return res.status(404).json({message: "Transaction not found"});  
        }

        return res.json({  
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

       const updatedData = {
        title : title, 
        amount: amount, 
        type: type, 
        category: category,
        description: description
       }

       const updatedTransaction = await transactionModel.findByIdAndUpdate(id, updatedData, { new: true });

       return res.status(200).json({
        message: "transaction updated successfully",
        data: updatedTransaction
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

interface IgetSummary{
    startDate: any,
    EndDate: any
}

// Income/Expense totals
export const getSummart = async (req:Request<IgetSummary>, res:Response) => {
    try {
            const {startDate , endDate } = req.query;

            const filter:any = {}
            if(startDate && endDate) {
                filter.createdAt = {
                    '$gte': new Date(startDate as string),
                    '$lte': new Date(endDate as string)
                }
            }

            const transaction = await transactionModel.find(filter);

                let totalExpence = 0;
                let totalIncome = 0;
            
                transaction.forEach((tx) => {
                    if (tx.amount != null) {
                        if(tx.type === 'expense') totalExpence += tx.amount;
                        if(tx.type === 'income') totalIncome += tx.amount;
                    }
                })

                const balance = totalIncome - totalExpence;

                res.json({
                    totalExpence,
                    totalIncome,
                    balance,
                    totalTransactions: transaction.length,
                    range: startDate && endDate ? { startDate, endDate } : "All time"
                })



    } catch (error) {
            return res.status(500).json({ message: "Server error" });
    }
}