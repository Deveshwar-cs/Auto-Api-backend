
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
{
  
 name: {
    type: String,
 required: true,
 trim: true,
 },

 professioin: {
    type: String,
 required: true,
 trim: true,
 },

},
{ timestamps: true }
);

export default mongoose.model("customer", customerSchema);
