
import mongoose from "mongoose";

const prodSchema = new mongoose.Schema(
{
  
 name: {
    type: String,
 required: true,
 trim: true,
 enum: [],
 },

},
{ timestamps: true }
);

export default mongoose.model("prod", prodSchema);
