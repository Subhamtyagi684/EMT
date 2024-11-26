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
      let uri = createMongoDBURI();
      const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName:process.env.MONGODB_DBNAME
      });

      console.log(`MongoDB Connected With Host: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }


function createMongoDBURI(){
  let uri = null;
  switch(process.env.ENVIRONMENT){
    case("dev"):{
      uri = process.env.MONGODB_DBNAME_DEV;
      break;
    }
    default:{
      uri = "mongodb://localhost:27017"
    }
  }
  if(!uri){
    throw new Error("Please pass correct mongodb uri")
  }

  return uri;
}

module.exports = connectDB;

