const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set("useCreateIndex",true);

mongoose.connect(
    process.env.MONGODB_URL,
    { 
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    }).then(succ=>{
        console.log("Successfully Connected to DB " );
    }).catch(err=>{
        console.log("Error: " + err);
    });

const Borrow = require('./model/borrow').Borrow;
// const ObjectId = require('mongoose').Types.ObjectId;

const sample = () => {
    console.log('Reached');
    Borrow.findOne({_id : '5f020d1d4f5a8b63683b1003'})
        .then((borrow) => {
            console.log('reaced');
            return borrow;
        })
        .then((borrow) => {
            console.log('Rea');
            console.log(borrow);
        })
        .catch(err=>next(err));
}

sample();
// mongoose.disconnect().then(()=>console.log('Disconnected!')).catch((err) => console.log(err));