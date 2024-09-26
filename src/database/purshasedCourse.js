import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    userId:{
        type:String,
        required:true 
    },
    language:{
        type:String,
        required:true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true,
    },
    paymentId:{
        type:String,
        required:true
    },
    purchasedAt:{
        type:String,
        required:true
    }
});

const purchasedCourse = mongoose.model("purchasedCourse", Schema);

export default purchasedCourse;
