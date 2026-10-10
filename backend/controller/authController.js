const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");

const genrateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user"
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const message = `Your OTP for registration is ${otp}`;

        await sendEmail(
            normalizedEmail,
            "OTP for registration",
            message
        );

        return res.status(201).json({
            message: "OTP sent to your email",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = genrateToken(user._id);
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        }

        return res.status(400).json({ message: "Invalid email or password" });
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
};

// user list
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
};

module.exports = { registerUser, loginUser, getUsers };