
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
{
  
 name: {
    type: String,
 required: true,
 trim: true,
 },

 number: {
    type: Number,
 required: true,
 },

},
{ timestamps: true }
);

export default mongoose.model("customer", customerSchema);
