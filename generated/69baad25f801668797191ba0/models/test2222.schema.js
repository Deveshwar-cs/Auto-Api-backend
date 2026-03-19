
import mongoose from "mongoose";

const test2222Schema = new mongoose.Schema(
{
  
 name: {
    type: String,
 required: true,
 trim: true,
 },

 price: {
    type: Number,
 required: true,
 },

},
{ timestamps: true }
);

export default mongoose.model("test2222", test2222Schema);
