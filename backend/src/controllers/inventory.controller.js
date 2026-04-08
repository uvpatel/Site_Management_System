import Item from "../models/item.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { category, search, lowStock } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.itemName = { $regex: search, $options: "i" };
    if (lowStock === "true") filter.$expr = { $lt: ["$currentStock", "$minStockQty"] };
    const items = await Item.find(filter).sort({ itemName: 1 });
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
};

export const addStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    item.currentStock += Number(quantity);
    await item.save();
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, message: "Item deleted" });
  } catch (error) { next(error); }
};
