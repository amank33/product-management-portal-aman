const mongoose = require('mongoose');


// Connect to the database

const connectDb=async()=>{

    try{
        const connectdatabase=await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected`);

    }catch(e){  
        console.log(e);
        
    }

}

module.exports=connectDb;