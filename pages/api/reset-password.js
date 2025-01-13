import connect from "services/db"
import User from "models/user"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" })
    }

    try {
        await connect()
        const { token, password } = req.body

        // Validate inputs
        if (!token || !password) {
            return res.status(400).json({
                message: "Missing required fields"
            })
        }

        // Find user with valid reset token that hasn't expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({
                message: "This password reset link has expired or is invalid."
            })
        }

        // Validate password requirements
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and contain at least one letter and one number"
            })
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user's password and remove reset token fields
        await User.findByIdAndUpdate(user._id, {
            $set: { password: hashedPassword, isVerified: true },
            $unset: { resetToken: "", resetTokenExpiry: "" }
        })

        return res.status(200).json({
            message: "Password successfully reset"
        })

    } catch (error) {
        console.error("Reset password error:", error)
        return res.status(500).json({
            message: "An error occurred while resetting your password. Please try again."
        })
    }
}