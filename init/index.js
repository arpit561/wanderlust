// 4.Intitalize Database--->
const mongoose= require("mongoose");
const initData= require("./data");
const Listing= require("../models/listing");

main().then(()=> console.log("Connected to Db")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
} 

const initDb= async() => {
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj) => ({...obj, owner: "67460d2564cadd64c8002422"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
    // console.log(initData.data);
}

initDb();