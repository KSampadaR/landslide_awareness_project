const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;


mongoose.connect("mongodb://localhost:27017/LoginSignup", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Failed to connect to MongoDB:", err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sampada.khopade22@gmail.com', 
        pass: 'npxd dtkl dxew vhxz' 
    }
});


app.get("/", (req, res) => {
    res.render("home"); 
});


app.get("/signup", (req, res) => {
    res.render("signup",{ message: null }); 
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!email.includes("@")) {
        return res.status(400).render("signup", { message: "Email must contain @" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render("signup", { message: "User already exists. Please log in." });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        const mailOptions = {
            from: 'ramdeshpande2918@gmail.com',
            to: email,
            subject: 'Registration Successful',
            text: `Hello ${name},\n\nYou have successfully registered!\n\nThank you for joining us.\n\nBest regards,`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.render("login", { message: null });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Error occurred during signup");
    }
});

app.get("/login", (req, res) => {
    res.render("login",{ message: null }); 
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found. Please register first.");
        }


        if (user.password === password) {
            res.render("home", { name: user.name });
        } else {
            res.send("Incorrect password.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.send("Error occurred during login.");
    }
});

app.listen(PORT, () => {
    console.log(`EJS server running on port ${PORT}`);
});
