import { Schema, model } from "mongoose";

interface IUser {
  username: string;
  password: string;
  googleId: string;
  facebookId: string;
  githubId: string;
  name: string;
}

const userSchema = new Schema<IUser>(
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
  { timestamps: true }
);

const userModel = model<IUser>("user", userSchema);

export default userModel;
