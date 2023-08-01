const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Data = require("./models/Data");
const Threshold = require("./models/Threshold");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const eventRoutes = require("./routes/event");
const app = express();
const cors = require('cors');
const io = require("./socket")
const port = 3000;
const regression = require('regression');
const MONGODB_URI = `mongodb+srv://kidus72:1221*abcd@cluster0.klqasxp.mongodb.net/thesis?retryWrites=true&w=majority`;
// const result = regression.linear([[0, 25], [1, 24], [2, 25], [3,26], [4,55]]);
// const gradient = result.equation[0];
// const yIntercept = result.equation[1];
// const pred = result.predict(5)
// console.log(gradient, yIntercept, pred)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
app.use("/", userRoutes);
app.use("/", dataRoutes);
app.use("/", eventRoutes);
app.use("/auth", authRoutes);

app.use("/thresh", (req, res, next) => {
  Threshold.findOne().sort({ createdAt: -1 }).then(thresh => {
    if (thresh !== null){
      res.status(200).json({message: "success", threshold: thresh})
    }
      else{
        res.status(200).json({message: "success", threshold: {
          temperatureMax: 30,
          temperatureMin: 20,
          humidityMax: 60,
          humidityMin: 40
        }})
      }
  }).catch(err => {
    console.log(err)
  })
});
app.get('/all-data', (req, res, next) => {
  Data.find()
  .then(result => {
    res.status(200).json({message: "succesfully fetched", result: result});
  }).catch(err => {
    console.log(err)
  })
});
app.post('/sensor-data', (req, res) => {
  const { temperature, humidity, analogValue } = req.body;
  console.log(`Received Temperature: ${temperature} °C, Humidity: ${humidity}%`, analogValue);
  Threshold.find().then(result => {
    
    const tempMax = result[0].temperatureMax;
    const humMax = result[0].humidityMax;
    const tempMin = result[0].temperatureMin;
    const humMin = result[0].humidityMin;
    if (temperature && humidity){
      const data = new Data({
        temperature: temperature, 
        humidity: humidity,
        analogValue: analogValue
      });
    let signal = 200;
    console.log(tempMax , tempMin, temperature)
    if (temperature > tempMax){
      signal = 400;
    }
    else if (temperature < tempMin){
      signal = 201;
    }
    console.log(signal)
    Data.findOne().sort({ createdAt: -1 }).then(last => {
      
      if (!last || last.temperature != temperature || last.humidity != humidity || (last.analogValue - analogValue) > 50 || (analogValue - last.analogValue) > 50){
        data.save().then(result => {
          // Data.deleteMany({ _id: { $ne: result._id } }).then(res => {
          //   console.log(res)
          // }).catch(err => {
          //   console.log(err)
          // })
          io.getIO().emit("temp", {
            data: data});
          res
          .status(signal)
          .json({
            message: 'Fetched posts successfully.',
            data: result,
            signal: signal
          });
        }).catch(err => { console.log(err)})
      }
    else{
      res
          .status(signal)
          .json({
            message: 'Fetched posts successfully.',
            data: result,
            signal: signal
          });
    } 
    }).catch(err => {
      console.log(err)
    });
      
    }
  }).catch(err => {
    console.log(err)
  })
});
app.get('/latest', (req, res) => {
  console.log("dd")
  Data.findOne().sort({ createdAt: -1 }).then(result => {
    console.log(result)
    if (result){
      res.status(200).json({
        message: "succcess",
        data: result
      })
    }
    else {
      res.status(200).json({
        message: "succcess",
        data: {}
      })
    }
   
   
  })
  
});
app.post('/threshold-save', (req, res) => {
 const temperatureMax = req.body.tempMax;
 const humidityMax = req.body.humMax;
 const temperatureMin = req.body.tempMin;
 const humidityMin = req.body.humMin;
 const thershold = new Threshold({temperatureMax: req.body.tempMax, 
  humidityMax: req.body.humMax, 
  temperatureMin: req.body.tempMin, 
  humidityMin: req.body.humMin
});
thershold.save().then(result => {
  Threshold.deleteMany({ _id: { $ne: result._id } }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  });
  res.status(200).json({message: "success", data: result})
}).catch(err => {
  console.log(err)
})

});

mongoose
  .connect(
   MONGODB_URI
  )
  .then(result => {
    console.log("connected")
    const server = app.listen(8080);
    const io = require("./socket").init(server);
    io.on('connection', socket => {
      console.log("conne")
    })
  })
  .catch(err => console.log(err));