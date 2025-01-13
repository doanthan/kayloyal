import connect from "services/db"
import User from "models/user"

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" })
    }

    try {
        const { token } = req.body
        await connect()

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        })

        res.json({ valid: !!user })
    } catch (error) {
        console.error("Token validation error:", error)
        res.status(500).json({ message: "Error validating token" })
    }
}