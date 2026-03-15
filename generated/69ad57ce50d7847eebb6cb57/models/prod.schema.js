
import mongoose from "mongoose";

const prodSchema = new mongoose.Schema(
{
  
 name: {
    type: String,
 required: true,
 trim: true,
 enum: [],
 },

 price: {
    type: Number,
 required: true,
 enum: [],
 },

},
{ timestamps: true }
);

export default mongoose.model("prod", prodSchema);
