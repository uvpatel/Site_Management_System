import Vendor from "../models/vendor.model.js";

export const getAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) filter.vendorName = { $regex: search, $options: "i" };
    const vendors = await Vendor.find(filter).sort({ vendorName: 1 });
    res.json({ success: true, data: vendors });
  } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  } catch (error) { next(error); }
};

export const create = async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, message: "Vendor deleted" });
  } catch (error) { next(error); }
};
