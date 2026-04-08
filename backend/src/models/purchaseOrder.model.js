import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor ID is required"],
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: [0, "Unit price cannot be negative"],
    },
    deliveryStatus: {
      type: String,
      enum: ["ordered", "shipped", "delivered", "cancelled"],
      default: "ordered",
    },
    expectedDelivery: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total cost
purchaseOrderSchema.virtual("totalCost").get(function () {
  return this.quantity * this.unitPrice;
});

purchaseOrderSchema.index({ projectId: 1 });
purchaseOrderSchema.index({ deliveryStatus: 1 });

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);
export default PurchaseOrder;
