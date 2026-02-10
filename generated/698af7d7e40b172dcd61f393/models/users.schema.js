
  import mongoose from "mongoose";
  const usersSchema = new mongoose.Schema(
  {
  
 name: {
 type: String,
 required: true,
 trim: true,
 },
 email: {
 type: String,
 required: true,
 trim: true,
 },
 password: {
 type: String,
 required: true,
 trim: true,
 },
  },
  {timestamps: true}
  );
  export default mongoose.model("users",usersSchema);
  