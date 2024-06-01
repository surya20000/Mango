import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "https://webstockreview.net/images/profile-icon-png-9.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

export default User;
