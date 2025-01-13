import User from "models/user"
import jwt from 'jsonwebtoken';
import connect from "services/db"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        console.log("HERERERERERe")
        await connect()

        console.log("WWWWWWW")

        const user = await User.findOneAndUpdate({
            email,
            isVerified: true,
        }, {
            lastLogin: Date.now(), lastTokenRefreshTime: new Date(Date.now() + 20000) // Adds 20 seconds to the current time
        })
        if (!user) {
            return res.status(400).json({ error: "Email not found" });
        }
        console.log("WWWWWWW")

        bcrypt.compare(password, user.password, async function (err, isMatch) {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            } else if (isMatch) {
                // Passwords match
                const cookieToken = { userId: user._id }
                const token = jwt.sign(cookieToken, process.env.JWT_TOKEN_KEY, { expiresIn: '3h' });
                console.log("WWWWWWW")

                return res.status(200).json({ message: 'Login successful', token: token });
            } else {
                // Passwords don't match
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        })
    } else {
        // Handle other HTTP methods
        console.log("NOT ALLOWED")
        res.status(405).json({ error: 'Method not allowed' });
    }
}

