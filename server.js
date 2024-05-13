const express =require('express');
const app = express();

// const fs = require('fs');
// const path = require('path');
// let rawdata = fs.readFileSync(path.resolve(__dirname, 'jsondata.json'));
// let data = JSON.parse(rawdata);

const DataModel = require('./models/data');
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log("MongoDB connected...");
    
    
    app.listen(PORT,() => console.log(`Server running on port ${PORT}`))

  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
connectDB();

app.use(express.json());

app.get('/api/data',(req,res)=>{
  DataModel.find()
  .then(data => res.json(data))
  .catch(err => console.log(err))
})