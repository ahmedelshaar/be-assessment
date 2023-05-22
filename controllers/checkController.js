import Check from '../models/checkModel.js';
import Report from '../models/reportModel.js';
import { cronJob } from '../services/cronJob.js';
import {
  createCheckValidation,
  updateCheckValidation,
} from '../validators/checkValidator.js';
import validateRequest from '../utils/validationUtils.js';
import idParamValidation from '../validators/idParamValidation.js';

const getAllChecks = async (req, res, next) => {
  try {
    const { decodedData: user } = req;
    const checks = await Check.find({ createdBy: user._id });

    if (checks.length === 0) {
      return res.status(200).json({ message: 'No URLs to check' });
    }

    return res.status(200).json(checks);
  } catch (error) {
    next(error);
  }
};

const getCheck = async (req, res, next) => {
  try {
    const idValidationError = validateRequest(req.params, idParamValidation);
    if (idValidationError) {
      return res.status(400).json({ errors: idValidationError });
    }

    const { decodedData: user } = req;
    const check = await Check.findOne({
      createdBy: user._id,
      _id: req.params.id,
    });

    if (!check) {
      return res.status(200).json({ message: 'Check not found' });
    }

    return res.status(200).json(check);
  } catch (error) {
    next(error);
  }
};

const createCheck = async (req, res, next) => {
  try {
    const validationErrors = validateRequest(req.body, createCheckValidation);
    if (validationErrors) {
      return res.status(400).json({ errors: validationErrors });
    }

    const isCheckExists = await Check.findOne({
      name: req.body.name,
      url: req.body.url,
    });

    if (isCheckExists) {
      return res.status(400).json({ errors: 'Check already exists' });
    }

    const { decodedData: user } = req;

    const check = new Check({
      createdBy: user._id,
      ...req.body,
    });

    await check.save();

    const report = new Report({
      checkId: check._id,
      availability: 0,
    });

    await report.save();

    cronJob.addTask(check);

    return res.status(201).json({
      message: `Check: ${check._id} has been created by ${user.email}, with report: ${report._id}`,
    });
  } catch (error) {
    next(error);
  }
};

const updateCheck = async (req, res, next) => {
  try {
    const idValidationError = validateRequest(req.params, idParamValidation);
    if (idValidationError) {
      return res.status(400).json({ errors: idValidationError });
    }

    const validationErrors = validateRequest(req.body, updateCheckValidation);
    if (validationErrors) {
      return res.status(400).json({ errors: validationErrors });
    }

    const { decodedData: user } = req;

    const check = await Check.findOneAndUpdate(
      { createdBy: user._id, _id: req.params.id },
      { $set: req.body },
    );

    if (!check) {
      return res.status(200).json({ message: 'Check not found' });
    }

    return res.status(200).json({ message: 'Check updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteCheck = async (req, res, next) => {
  try {
    const idValidationError = validateRequest(req.params, idParamValidation);
    if (idValidationError) {
      return res.status(400).json({ errors: idValidationError });
    }

    const { decodedData: user } = req;

    const check = await Check.findOneAndDelete({
      createdBy: user._id,
      _id: req.params.id,
    });

    if (!check) {
      return res.status(200).json({ message: 'Check not found' });
    }

    await Report.findOneAndDelete({ checkId: req.params.id });
    cronJob.removeTask(check._id);

    return res.status(200).json({
      message: 'Check and its report have been deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { getCheck, getAllChecks, createCheck, updateCheck, deleteCheck };
