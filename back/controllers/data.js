const Data = require("../models/Data");
exports.getLast = (req, res, next) => {
  const currentDateTime = new Date();
  const currentHour = currentDateTime.getHours();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setHours(currentHour - 5, 0, 0, 0); // Set start time to 1:00 PM
  const end = new Date(today);
  end.setHours(currentHour - 4, 0, 0, 0); // Set end time to 2:00 PM
  let cur1 = 0;
  let cur2 = 0;
  let cur3 = 0;
  let cur4 = 0;
  let cur5 = 0;
  Data.find({ createdAt: { $gte: start, $lt: end } })
    .then((data) => {
      console.log(data, "ddd");
      for (let i = 0; i < data.length; i++) {
        cur1 += Number(data[i].temperature);
      }
      if (data.length > 0){
         cur1 /= data.length
      }
      const start = new Date(today);
      start.setHours(currentHour - 4, 0, 0, 0); // Set start time to 1:00 PM
      const end = new Date(today);
      end.setHours(currentHour - 3, 0, 0, 0); // Se
      Data.find({ createdAt: { $gte: start, $lt: end } })
        .then((dat) => {
          for (let i = 0; i < dat.length; i++) {
            cur2 += Number(dat[i].temperature);
          }
          if (dat.length > 0){
            cur2 /= dat.length
         }
          const start = new Date(today);
          start.setHours(currentHour - 3, 0, 0, 0); // Set start time to 1:00 PM
          const end = new Date(today);
          end.setHours(currentHour - 2, 0, 0, 0); // Se
          Data.find({ createdAt: { $gte: start, $lt: end } })
            .then((dat) => {
              for (let i = 0; i < dat.length; i++) {
                cur3 += Number(dat[i].temperature);
              }
              if (dat.length > 0){
               cur3 /= dat.length
            }
              const start = new Date(today);
              start.setHours(currentHour - 2, 0, 0, 0); // Set start time to 1:00 PM
              const end = new Date(today);
              end.setHours(currentHour - 1, 0, 0, 0); // Se
              Data.find({ createdAt: { $gte: start, $lt: end } })
                .then((dat) => {
                  for (let i = 0; i < dat.length; i++) {
                    cur4 += Number(dat[i].temperature);
                  }
                  if (dat.length > 0){
                     cur4 /= dat.length
                  }
                  const start = new Date(today);
                  start.setHours(currentHour - 1, 0, 0, 0); // Set start time to 1:00 PM
                  const end = new Date(today);
                  end.setHours(currentHour, 0, 0, 0); // Se
                  Data.find({ createdAt: { $gte: start, $lt: end } })
                    .then((dat) => {
                      for (let i = 0; i < dat.length; i++) {
                        cur5 += Number(dat[i].temperature);
                      }
                      if (dat.length > 0){
                        cur5 /= dat.length
                     }
                      res.status(200).json({
                        message: "succcessfull",
                        tot: [
                          {
                            id: "temperature",
                            data: [
                              { x: currentHour - 4, y: cur1 > 0 ? cur1 : 25 },
                              { x: currentHour - 3, y: cur2 > 0 ? cur2 : 25 },
                              { x: currentHour - 2, y: cur3 > 0 ? cur3 : 25 },
                              { x: currentHour - 1, y: cur4 > 0 ? cur4 : 25 },
                              { x: currentHour, y: cur5 > 0 ? cur5 : 25 },
                            ],
                          },
                          {
                            id: "humidity",
                            data: [
                              { x: currentHour - 4, y: cur1 > 0 ? cur1 : 25 },
                              { x: currentHour - 3, y: cur2 > 0 ? cur2 : 25 },
                              { x: currentHour - 2, y: cur3 > 0 ? cur3 : 25 },
                              { x: currentHour - 1, y: cur4 > 0 ? cur4 : 25 },
                              { x: currentHour, y: cur5 > 0 ? cur5 : 25 },
                            ],
                          },
                        ],
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getLastDays =async (req, res) => {
  try {
    const today = new Date();
    const fiveDaysAgo = new Date(today.setDate(today.getDate() - 10));
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: fiveDaysAgo }
        }
      },
      {
        $addFields: {
          numericValue: { $toDouble: "$temperature" },
          numericValueHum: { $toDouble: "$humidity" }
        }
      
      },
      {
        $group: {
          _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } ,
        },
          averageTemp: { $avg: "$numericValue" },
          averageHum: { $avg: "$numericValueHum" }
        
      }
    },
    {
      $sort: {
        "_id": 1 // Sort by hour in ascending order
      }
    }
    ];

    const result = await Data.aggregate(pipeline);
    console.log(result)
    let tot = [{id: "temperature", data: []},{id: "humidity", data: []}]
    for (let i =0; i < result.length;i++){
        tot[0].data.push({x: Number(result[i]._id.slice(result[i]._id.length - 2), result[i]._id.length), y: result[i].averageTemp})
        tot[1].data.push({x: Number(result[i]._id.slice(result[i]._id.length - 2), result[i]._id.length), y: result[i].averageHum})
    }
 
    res.status(200).json({message: "success", tot: tot});
  } catch (error) {
    console.error('Error retrieving average values:', error);
    res.status(500).send('Error retrieving average values');
  }
};
exports.getLastHours =async (req, res) => {
  try {
    const today = new Date();
    const currentHour = today.getHours();
    const SevenHoursAgo = new Date(today.setHours(today.getHours() - 5));
    console.log(today.getHours(), SevenHoursAgo.getHours(), SevenHoursAgo)
    
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: SevenHoursAgo }
        }
      },
      {
        $addFields: {
          numericValue: { $toDouble: "$temperature" },
          numericValueHum: { $toDouble: "$humidity" }
        }
      
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$createdAt' }
      
        },
          averageTemp: { $avg: "$numericValue" },
          averageHum: { $avg: "$numericValueHum" }
        
      }
    },
    {
      $sort: {
        "_id.hour": 1 // Sort by hour in ascending order
      }
    }
    ];

    const result = await Data.aggregate(pipeline);
    console.log(result)
    let tot = [{id: "temperature", data: []},{id: "humidity", data: []}]
    for (let i =0; i < result.length;i++){
        tot[0].data.push({x: result[i]._id["hour"], y: result[i].averageTemp})
        tot[1].data.push({x: result[i]._id["hour"], y: result[i].averageHum})
    }
 
    res.status(200).json({message: "success", tot: tot});
  } catch (error) {
    console.error('Error retrieving average values:', error);
    res.status(500).send('Error retrieving average values');
  }
};