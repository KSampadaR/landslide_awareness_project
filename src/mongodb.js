const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/LoginSignupmon")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(() => {
        console.log("Failed to connect to MongoDB");
    });

const LogInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /.+@.+\..+/.test(v); 
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    }
});

const collection = mongoose.model("Collection1", LogInSchema);
module.exports = collection;
