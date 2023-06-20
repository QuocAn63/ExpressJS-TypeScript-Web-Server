import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  SchemaTypes,
  Types,
} from "mongoose";

export const userSchema = new Schema(
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
    avatar: {
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
    dob: {
      type: SchemaTypes.Date,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phonenumber: String,
    roles: {
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
    },
    isActived: {
      type: SchemaTypes.Boolean,
      default: true,
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

export type userType = HydratedDocument<InferSchemaType<typeof userSchema>>;

const userModel = model("user", userSchema);

export default userModel;
