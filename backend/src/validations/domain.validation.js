import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export const attendanceValidation = {
  body: Joi.object({
    workerId: objectId.required(),
    projectId: objectId.required(),
    date: Joi.date().required(),
    status: Joi.string().valid("Present", "Half Day", "Absent").required(),
    hoursWorked: Joi.number().min(0).max(24).optional(),
  }),
};

export const procurementValidation = {
  body: Joi.object({
    projectId: objectId.required(),
    vendorId: objectId.required(),
    itemId: objectId.required(),
    quantity: Joi.number().positive().required(),
    unitPrice: Joi.number().min(0).required(),
    deliveryStatus: Joi.string().valid("ordered", "shipped", "delivered", "cancelled").optional(),
    expectedDelivery: Joi.date().optional(),
  }),
};

export const procurementStatusValidation = {
  body: Joi.object({
    deliveryStatus: Joi.string().valid("ordered", "shipped", "delivered", "cancelled").required(),
  }),
};

export const materialIssueValidation = {
  body: Joi.object({
    projectId: objectId.required(),
    taskId: objectId.allow(null, "").optional(),
    itemId: objectId.required(),
    quantity: Joi.number().positive().required(),
    remarks: Joi.string().trim().allow("").max(500).optional(),
  }),
};

export const financeMutationValidation = {
  body: Joi.object({
    projectId: objectId.required(),
    costCategory: Joi.string().valid("Labor", "Material", "Equipment", "Overhead", "Other").required(),
    date: Joi.date().optional(),
    amount: Joi.number().min(0).required(),
    description: Joi.string().trim().allow("").max(300).optional(),
    paymentStatus: Joi.string().valid("Pending", "Paid", "Overdue", "Cancelled").optional(),
    notes: Joi.string().trim().allow("").max(500).optional(),
  }),
};
