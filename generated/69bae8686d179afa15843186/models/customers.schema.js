
import mongoose from "mongoose";

const customersSchema = new mongoose.Schema(
{
  
 name: {
    type: String,
 required: true,
 trim: true,
 },

 gmail: {
    type: String,
 required: true,
 trim: true,
 },

 role: {
    type: String,
 required: true,
 trim: true,
 },

},
{ timestamps: true }
);

export default mongoose.model("customers", customersSchema);
