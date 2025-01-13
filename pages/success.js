import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import ImageLoader from "components/library/ImageLoader"
import PasswordToggle from "components/library/PasswordToggle"
import Spinner from "react-bootstrap/Spinner" // import Spinner
import { useForm } from "react-hook-form"
import axios from "axios"
import { useAuth } from "services/AuthProvider"

const Login = () => {
  // Add class to body to enable gray background
  useEffect(() => {
    const body = document.querySelector("body")
    document.body.classList.add("bg-dark")
    return () => body.classList.remove("bg-dark")
  })
  return (
    <>
      <Head>
        <title>Kaypush | Account Confirmation</title>
      </Head>

      {/* Page wrapper */}
      <main className="page-wrapper">
        <div className="container-fluid d-flex h-100 align-items-center justify-content-center py-4 py-sm-5">
          {/* Sign in card */}
          <div
            className="card card-body text-center"
            style={{ maxWidth: "940px" }}
          >
            <Link href="/">
              <h3 className="d-inline-block mb-5">Ktools</h3>
            </Link>
            <h4>Just one more step!</h4>
            <p className="fs-lg mb-3">
              Check your inbox for an email confirmation
            </p>
            <div className="d-flex justify-content-center">
              <ImageLoader
                src="/images/job-board/illustrations/mail.svg"
                width={344}
                height={292}
                alt="Illusration"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Login
