import { Schema, model, InferSchemaType } from "mongoose";

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

export type userType = InferSchemaType<typeof userSchema>;

const userModel = model("user", userSchema);

export default userModel;
