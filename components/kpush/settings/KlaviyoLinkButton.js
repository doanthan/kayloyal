import React, { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import { getConfigToken } from "services/library"
import axios from "axios"

const KlaviyoLinkButton = ({ name }) => {
  // Helper function to generate a random string
  const generateRandomString = () => {
    const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43 // Random length between 43 and 128
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((byte) => possible.charAt(byte % possible.length))
      .join("")
  }

  const [pkce, setPkce] = useState({ verifier: "", challenge: "" })

  // Function to generate code verifier and code challenge
  const usePkce = async () => {
    useEffect(() => {
      const verifier = generateRandomString(128)
      crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(verifier))
        .then((hashed) => {
          const base64Digest = btoa(
            String.fromCharCode(...new Uint8Array(hashed))
          )
          const challenge = base64Digest
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")
          setPkce({ verifier, challenge })
        })
    }, [])
    return pkce
  }

  const onSubmit = async () => {
    try {
      const response = await axios.post(
        `/api/account`,
        { name, klaviyoVerification: pkce.verifier },
        getConfigToken()
      )

      if (response.status === 200) {
        const authUrl = `https://www.klaviyo.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&code_challenge_method=S256&code_challenge=${pkce.challenge}&state=${response.data.userId}`
        window.location.href = authUrl
      } else {
        console.error("Failed to update:", data.message)
      }
    } catch (error) {
      console.error("Error making the API call:", error)
    }
  }

  const { verifier, challenge } = usePkce()
  const clientId = process.env.NEXT_PUBLIC_KLAVIYO_APP_CLIENT_ID // Replace with your actual client ID
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_ENV === "DEV"
      ? "http://localhost:3000/api/callback"
      : "https://kaypush.com/api/callback"
  ) // Replace with your actual redirect URI
  const scope = encodeURIComponent("accounts:read campaigns:read campaigns:write profiles:read profiles:write subscriptions:read subscriptions:write events:read events:write metrics:read campaigns:read campaigns:write flows:read segments:read lists:read templates:read templates:write tags:read tags:write")

  return (
    <Button onClick={() => onSubmit(name)} variant="outline-primary">
      <i className="fi-link me-2"></i>Link Klaviyo Account
    </Button>
  )
}

export default KlaviyoLinkButton
