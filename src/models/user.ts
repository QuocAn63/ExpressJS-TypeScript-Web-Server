import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      minlength: 6,
      maxlength: 25,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
    query: {
      byUserName(name: string) {
        return this.find({ username: { $regex: name } });
      },
      byName(name: string) {
        return this.find({ name: { $regex: name } });
      },
    },
  }
);

const userModel = model("user", userSchema);

export default userModel;
