const mongoose = require("mongoose"),
{ Schema } = require("mongoose"),
Subscriber = require("./subscriber"),
userSchema = new Schema(
    {
            name: {
                first: {
                    type: String,
                    required: true
                },
                last: {
                    type: String,
                    required: true
                }
            },
            maxStudents:{
                type: Number,
                default: 0,
                min = [0, "Course cannot have a negative number of students"]
            },
            cost: {
                type: Number,
                default: 0,
                min = [0, "Course cannot cost a negative amount"]
            }
    },
    {
        timestamps = true
    }
)

module.exports = mongoose.model("User", courseSchema);