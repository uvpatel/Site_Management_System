import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    uom: {
      type: String,
      required: [true, "Unit of measurement is required"],
      trim: true,
    },
    unitCost: {
      type: Number,
      required: [true, "Unit cost is required"],
      min: [0, "Unit cost cannot be negative"],
    },
    minStockQty: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    supplier: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

itemSchema.index({ category: 1 });

const Item = mongoose.model("Item", itemSchema);
export default Item;
