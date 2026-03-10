
import mongoose from "mongoose";

const p2Schema = new mongoose.Schema(
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

export default mongoose.model("p2", p2Schema);
