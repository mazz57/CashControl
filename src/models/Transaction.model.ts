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
  }
},{ timestamps: true });



export const transactionModel = model("transctions", TransactionSchema);