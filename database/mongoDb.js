const mongoose =require('mongoose');

const connectDB = async () => {
    try {
      // const conn = await mongoose.connect(process.env.MONGODB_URI, {
      //   useNewUrlParser: true,
      //   // useFindAndModify: false,
      //   useUnifiedTopology: true,
      //   user:process.env.MONGODB_USERNAME,
      //   pass:process.env.MONGODB_PASSWORD,
      //   dbName:"trangile_delivery"
      // });
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName:process.env.MONGODB_DBNAME
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }


module.exports = connectDB;

