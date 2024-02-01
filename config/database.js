const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async(req, res)=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("DB connection successfull");
    })
    .catch((err)=>{
        console.log("DB connection issues");
        console.log(err);
        process.exit(1);
    })
}

module.exports = connectDB;

// // config/database.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const mongoURI = 'your-mongodb-connection-uri';
//     await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     });
//     console.log('MongoDB Connected');
//   } catch (error) {
//     console.error('MongoDB Connection Failed:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
