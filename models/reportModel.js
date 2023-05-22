import { Schema, model, SchemaTypes } from 'mongoose';

const reportSchema = new Schema({
  checkId: {
    type: SchemaTypes.ObjectId,
    ref: 'Check',
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  availability: {
    type: Number,
    default: 0,
  },
  outages: {
    type: Number,
    default: 0,
  },
  downtime: {
    type: Number,
    default: 0,
  },
  uptime: {
    type: Number,
    default: 0,
  },
  averageResponseTime: {
    type: Number,
    default: 0,
  },
  history: {
    type: [Object],
    required: false,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
});

export default model('Report', reportSchema);
