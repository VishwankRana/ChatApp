import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password:{
      type: String,
      required: true,
    },

    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ]
    
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model("User", userSchema);

export default User;
