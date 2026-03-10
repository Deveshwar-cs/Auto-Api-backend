
import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
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

export default mongoose.model("users", usersSchema);
