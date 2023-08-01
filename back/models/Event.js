const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema(
    {
      eventName: {
        type: String,
        required: true
      },
      creator: {
        type: String,
        required: true
      },
      eventDate: {type: String,
        required: true}
    }
  );
  
  module.exports = mongoose.model('Event', eventSchema);