import { Schema , model} from 'mongoose';

const TransactionSchema = new Schema({
  title: String,
  amount: Number,
  type: {
    type: String,
    enum: ['income', 'expense'],
    require: true
  },
  category: String,
  description: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require:true
  }
},{ timestamps: true });



export const transactionModel = model("transactions", TransactionSchema);