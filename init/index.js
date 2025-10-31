const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); 

const MONGO__URL = "mongodb://127.0.0.1:27017/Luxe"

main().then(() =>{
    console.log("Connected to DB")
} ).catch(err=>{
    console.log(err);
}) 
async function main() {
    await mongoose.connect(MONGO__URL);
}

const initDB = async () => {
 await Listing.deleteMany({});
 initData.data = initData.data.map((obj) => ({...obj , owner:"68ebae6f1431864bf6a45e4e"}));
 await Listing.insertMany(initData.data);
 console.log("Data was initilized");
}

initDB();
