import Check from '../models/checkModel.js';
import Report from '../models/reportModel.js';
import validateRequest from '../utils/validationUtils.js';
import idParamValidation from '../validators/idParamValidation.js';
import { reportByTagsValidation } from './../validators/reportValidator.js';

const getReportByCheckId = async (req, res, next) => {
  try {
    const idValidationError = validateRequest(req.params, idParamValidation);
    if (idValidationError) {
      return res.status(400).json({ errors: idValidationError });
    }
    const user = req.decodedData;
    const check = await Check.findOne({
      createdBy: user._id,
      _id: req.params.id,
    });
    if (!check) return res.json({ message: 'Check not found' });

    const report = await Report.findOne({ checkId: check._id });
    if (!report) return res.json({ message: 'Report not found' });

    return res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

const getReportsByTags = async (req, res) => {
  try {
    const validationErrors = validateRequest(req.body, reportByTagsValidation);
    if (validationErrors)
      return res.status(400).json({ errors: validationErrors });

    const user = req.decodedData;

    var checks = await Check.find({
      createdBy: user._id,
      tags: { $in: req.body.tags },
    });
    if (!checks) return res.status(200).json({ message: 'No reports found' });

    let checkIds = [];
    checks.forEach((check) => {
      checkIds.push(check._id);
    });

    const reports = await Report.find({ checkId: { $in: checkIds } });

    return res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export { getReportByCheckId, getReportsByTags };
