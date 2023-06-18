import mongoose, { Types } from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    percentage: {
      type: Number,
      max: 100,
      min: 0,
    },
    amount: {
      type: Number,
      min: 0,
    },
    expiredIn: {
      type: Date,
    },
    isExpired: Boolean,
  },
  {
    timestamps: true,
    statics: {
      createPercentage(
        title: string,
        percentage: number,
        expiredIn: Date,
        description?: string
      ) {
        if (percentage <= 0 || percentage > 100)
          throw new Error("Invalid percentage promotion");
        if (expiredIn.getTime() < Date.now())
          throw new Error("Invalid promotion expired date");

        return this.create({ title, percentage, expiredIn, description });
      },
      createAmount(
        title: string,
        amount: number,
        expiredIn: Date,
        description?: string
      ) {
        if (amount <= 0) throw new Error("Invalid amount promotion");
        if (expiredIn.getTime() < Date.now())
          throw new Error("Invalid promotion expired date");

        return this.create({ title, amount, expiredIn, description });
      },
    },
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: String,
    theme: String,
    images: String,
    price: Number,
    promotion: {
      type: Types.ObjectId,
      ref: "promotions",
    },
    solds: Number,
    stocks: Number,
    ratings: [{ type: Types.ObjectId, ref: "users" }],
    comments: [{ type: Types.ObjectId, ref: "comments" }],
    status: {
      type: String,
      enum: ["visible", "invisible"],
      default: "invisible",
    },
  },
  {
    timestamps: true,
    query: {
      byName(name: string) {
        return this.find({ name: { $regex: name } });
      },
      byStatus(status: "visible" | "invinsible" | "all") {
        if (status === "all")
          return this.find({
            $and: [{ status: "visible" }, { status: "invinsible" }],
          });
        return this.find({ status: status });
      },
      sortByPrice(order: "desc" | "asc") {
        return this.sort({ price: order });
      },
      sortByDate(date: "newest" | "oldest") {
        let value: "desc" | "asc" = date === "newest" ? "desc" : "asc";
        return this.sort({ date: value });
      },
      //   sortByRating(order: "desc" | "asc") {
      //     return this.find().populate("users", "_id").projection({
      //       ratings: { $size: "$ratings" },
      //     });
      //   },
      minPrice(price: number | string) {
        let value = typeof price === "string" ? Number.parseInt(price) : price;
        return this.find({ price: { $gt: value } });
      },
      maxPrice(price: number | string) {
        let value = typeof price === "string" ? Number.parseInt(price) : price;
        return this.find({ price: { $lt: value } });
      },
    },
    statics: {
      likeOrUnlikeProduct(slug: string, userId: string) {
        return this.updateOne({ slug }, [
          {
            $set: {
              ratings: {
                $cond: {
                  if: { $exists: userId },
                  then: { $pull: userId },
                  else: { $push: userId },
                },
              },
            },
          },
        ]);
      },
    },
  }
);

export const promotionModel = mongoose.model("promotions", promotionSchema);
const productModel = mongoose.model("products", productSchema);

export default productModel;
