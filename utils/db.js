const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("connection to DB".bgGreen);
  } catch (error) {
    console.log("error: ", error);
    console.log("database connection failed");
    process.exit(0);
  }
};

module.exports = connectDb;
