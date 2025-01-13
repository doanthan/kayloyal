import User from "models/user"
import connect from "services/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import FormData from "form-data"
import { Resend } from "resend"
const resend = new Resend(process.env.RESEND_API_KEY)

const emailTemplate = (confirmUrl) => `
<!DOCTYPE html>
  <html>
  <head>
    <title>Welcome to kPush!</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; background-color:#1f1b2d;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
              <td style="padding-bottom: 20px; text-align: center; font-size: 32px; color: #ffffff; font-weight: bold;">
                <img src="/images/logo/kaypush-logo.png" width="50" style="padding-right: 10px;" /> kaypush
              </td>
            </tr>
          </table>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
              <td align="center" style="padding:40px 20px; background-color: #ffffff;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 40px; text-align: center; font-size: 20px; color: #333333; font-weight:bold;">
                      Thanks for signing up with kaypush!
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px; text-align: center; font-size: 16px; color: #333333;">
                      Please confirm your email address by clicking the link below:
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 30px; text-align: center; font-size: 16px; color: #333333;">
                      <a href="${confirmUrl}" style="display: inline-block; padding: 10px 20px; background-color: #fd5631;font-size: 16px; font-weight:bold; color: #ffffff; text-decoration: none; border-radius: 5px;">Confirm Email</a>
                    </td>
                  </tr>
                  <tr>
                  <td style="padding-bottom: 0px; text-align: center; font-size: 16px; color: #333333;">
                      <p>If you did not request this, please ignore this email.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
              <td style="text-align: center; padding-top: 40px; font-size: 14px; color: #ffffff;">
                <p>&copy; kaypush {new Date().getFullYear()}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("SIGNUP")
    const { email, password, company } = req.body

    if (!email || !password || !company) {
      console.log("MISSING FIELDS")
      return res.status(400).json({ message: "Missing required fields" })
    }

    await connect()
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      console.log("USER ALREADU EXISTS")
      return res.status(400).json({ message: "Email is already in use" })
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 5)
      const hashedToken = crypto.randomBytes(16).toString("hex")
      const newUser = new User({
        email,
        password: hashedPassword,
        company: company,
        resetToken: hashedToken,
        resetTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
        isVerified: false,
      })
      console.log("TEST")

      try {
        await newUser.save()
        await resend.emails
          .send({
            from: "KayPush <no-reply@kaypush.com>",
            to: email,
            subject: "Account Confirmation",
            html: emailTemplate(
              `${process.env.WEBSITE}/confirm?token=${hashedToken}`
            ),
          })
          .then((msg) => console.log(msg)) // logs response data
          .catch((err) => console.log(err)) // logs any error

        console.log("here2")
        return res.status(200).json({ message: "User is registered" })
      } catch (err) {
        console.log(err.message)
        return res.status(500).json({ error: err.message })
      }
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}
