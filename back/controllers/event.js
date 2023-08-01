const Event = require("../models/Event");

exports.getEvents = (req, res, next) => {
    
    Event.find().then(events => {
        res.status(200).json({message: "successfully fetched", events: events})
    }).catch(err => {
        console.log(err)
    });
};

exports.postEvent = (req, res, next) => {
    
    const eventName = req.body.eventName;
    const creator = req.body.creator;
    const eventDate = req.body.eventDate;
    
    const event = new Event({
        eventName: eventName, 
        creator: creator,
        eventDate: eventDate
    });
    event.save().then(result => {
        res.status(200).json({
            message: "succesfully created an event",
            event: result
        })
    }).catch(err => {
        console.log(err)
    })
};
exports.deleteEvent = (req, res, next) => {
    const userId = req.params.userId;
    Event.deleteOne({_id: userId}).then(result => {
        console.log(result)
        res.status(200).json({message: "successfully deleted"})
    }).catch(err => {
        console.log(err)
    })
};