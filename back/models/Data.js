const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dataSchema = new Schema(
    {
      temperature: {
        type: String,
        required: true
      },
      humidity: {
        type: String,
        required: true
      },
      analogValue: {
        type: String,
        required: true
      }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Data', dataSchema);