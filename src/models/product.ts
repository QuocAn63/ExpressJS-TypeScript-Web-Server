import mongoose, { HydratedDocument, InferSchemaType, Types } from "mongoose";

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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    query: {
      sortByDate(date: "newest" | "oldest") {
        let value: "desc" | "asc" = date === "newest" ? "desc" : "asc";
        return this.sort({ createdAt: value });
      },
      byType(type: "percentage" | "amount") {
        return this.find({ [type]: { $exists: true } });
      },
      sortByPercentage(order: "desc" | "asc") {
        return this.find({ percentage: { $exists: true } }).sort({
          percentage: order,
        });
      },
      sortByAmount(order: "desc" | "asc") {
        return this.find({ amount: { $exists: true } }).sort({ amount: order });
      },
      byStatus(expired: boolean) {
        if (expired) return this.find({ isExpired: { $exists: true } });
        return this.find({ isExpired: { $exists: false } });
      },
    },
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
    price: {
      type: Number,
      min: 1,
    },
    promotion: {
      type: Types.ObjectId,
      ref: "promotions",
    },
    solds: {
      type: Number,
      min: 0,
      default: 0,
    },
    stocks: {
      type: Number,
      min: 1,
    },
    ratings: [{ type: Types.ObjectId, ref: "user" }],
    comments: [{ type: Types.ObjectId, ref: "comment" }],
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
      sortByRating(order: "desc" | "asc") {
        return this.sort({ ratingCounts: order });
      },
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
      async likeOrUnlikeProduct(slug: string, userId: string) {
        const isLiked = await this.findOne({ slug, ratings: { $in: userId } });

        if (!isLiked)
          return this.updateOne({ slug }, { $push: { ratings: userId } });
        return this.updateOne({ slug }, { $pull: { ratings: userId } });
      },
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

productSchema.virtual("ratingCounts", {
  ref: "user",
  localField: "ratings._id",
  foreignField: "_id",
  count: true,
});

productSchema.pre("find", function () {
  this.populate("ratingCounts");
});

export type promotionType = HydratedDocument<
  InferSchemaType<typeof promotionSchema>
>;

export type productType = HydratedDocument<
  InferSchemaType<typeof productSchema>
>;

export const promotionModel = mongoose.model("promotions", promotionSchema);
const productModel = mongoose.model("products", productSchema);

export default productModel;
