const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const thresholdSchema = new Schema(
    {
      temperatureMax: {
        type: String,
        required: true
      },
      humidityMax: {
        type: String,
        required: true
      },
      temperatureMin: {
        type: String,
        required: true
      },
      humidityMin: {
        type: String,
        required: true
      }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Threshold', thresholdSchema);