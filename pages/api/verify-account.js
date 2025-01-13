
import connect from "services/db"
import { hash } from "bcryptjs"
import crypto from "crypto"
import User from "models/user"


export default async function verify(req, res) {

    const { token } = await req.body
    console.log(token)
    await connect()

    const user = await User.findOneAndUpdate({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    }, { isVerified: true, resetToken: null, resetTokenExpiry: null })

    if (!user) {
        console.log("ERROR")
        return res.status(400).json({ error: "Invalid token or has expired" });
    }
    console.log("found")
    return res.status(200).json(user)
}
