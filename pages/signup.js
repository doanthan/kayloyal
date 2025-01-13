import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import ImageLoader from "components/library/ImageLoader"
import PasswordToggle from "components/library/SignUpPassword"
import axios from "axios"

const SignupLightPage = () => {
  // Add class to body to enable gray background
  useEffect(() => {
    const body = document.querySelector("body")
    document.body.classList.add("bg-dark")
    return () => body.classList.remove("bg-dark")
  })
  // Router
  const router = useRouter()
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState()

  // Form validation
  const [validated, setValidated] = useState(false)
  const onSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    console.log(form.checkValidity())
    if (form.checkValidity()) {
      const email = form.elements["email"].value
      const password = form.elements["password"].value
      const company = form.elements["company"].value
      event.preventDefault()
      // Make the POST request
      try {
        const response = await axios.post("/api/sign-up", {
          email,
          password,
          company,
        })
        // Redirect to success page
        router.push("success")
      } catch (error) {
        setError(error.response.data.message)
      }
    }
  }

  // ... existing state ...
  const [passwordStrength, setPasswordStrength] = useState("")

  const checkPasswordStrength = (password) => {
    if (!password) return ""
    if (password.length < 8) return "weak"
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return "strong"
    if (password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) return "medium"
    return "weak"
  }

  return (
    <>
      {/* Custom page title attribute */}
      <Head>
        <title>kaypush | Sign Up</title>
      </Head>

      {/* Page wrapper */}
      <main className="page-wrapper">
        <div className="container-fluid d-flex h-100 align-items-center justify-content-center py-4 py-sm-5">
          {/* Sign in card */}
          <div className="card card-body" style={{ maxWidth: "940px" }}>
            <div
              className="position-absolute top-0 end-0 nav-link fs-sm py-1 px-2 mt-3 me-3"
              onClick={() => router.back()}
            >
              <i className="fi-arrow-long-left fs-base me-2"></i>
              Go back
            </div>
            <div className="row mx-0 align-items-center">
              <div className="col-md-6 border-end-md p-2 p-sm-5 text-center">
                <Link href="/">
                  <img
                    src="/images/logo/kpush-logo.svg"
                    width={45}
                    alt="Finder"
                    className="me-2"
                  />
                  <h3 className="d-inline-block mb-5">kaypush</h3>
                </Link>
                <h5 className="mb-4 text-left">We're so glad you're here!</h5>

                <div className="d-flex justify-content-center">
                  <ImageLoader
                    src="/images/signin-modal/signup.svg"
                    width={300}
                    height={350}
                    alt="Illusration"
                  />
                </div>
                <ul className="list-unstyled mb-4">
                  <li className="d-flex mb-2">
                    <i className="fi-check-circle text-primary mt-1 me-2"></i>
                    <span>Get an account set up in minutes</span>
                  </li>
                  <li className="d-flex mb-2">
                    <i className="fi-check-circle text-primary mt-1 me-2"></i>
                    <span>Integrate your customer data in no time</span>
                  </li>
                  <li className="d-flex mb-2">
                    <i className="fi-check-circle text-primary mt-1 me-2"></i>
                    <span>Build campaigns quickly and easily</span>
                  </li>
                  <li className="d-flex mb-0">
                    <i className="fi-check-circle text-primary mt-1 me-2"></i>
                    <span>Deliver valuable experiences!</span>
                  </li>
                </ul>
              </div>
              <div className="col-md-6 px-2 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5">
                <Form noValidate validated={validated} onSubmit={onSubmit}>
                  <Form.Group controlId="su-email" className="mb-4">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>
                  {/* ... other form groups ... */}

                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="su-password">
                      Password{" "}
                      <span className="fs-sm text-muted">min. 8 char</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      id="su-password"
                      name="password"
                      required
                      pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
                      onChange={(e) => setPasswordStrength(checkPasswordStrength(e.target.value))}
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 8 characters and contain at least one letter and one number
                    </Form.Control.Feedback>

                    {/* Password strength indicator */}
                    {passwordStrength && (
                      <div className="password-strength mt-2">
                        <div className="d-flex align-items-center">
                          <div className="me-2 small">Password strength:</div>
                          <div className={`badge bg-${passwordStrength === "strong" ? "success" :
                            passwordStrength === "medium" ? "warning" :
                              "danger"
                            }`}>
                            {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Password requirements helper text */}
                    <div className="mt-2 small text-muted">
                      Password requirements:
                      <ul className="mt-1 ps-3 mb-0">
                        <li>Minimum 8 characters</li>
                        <li>Must contain at least one letter</li>
                        <li>Must contain at least one number</li>
                      </ul>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="su-name" className="mb-4">
                    <Form.Label>Company Name </Form.Label>
                    <Form.Control
                      placeholder="Enter the name of your company"
                      name="company"
                      required
                    />
                  </Form.Group>
                  <Form.Check
                    type="checkbox"
                    id="terms-agree"
                    label={[
                      <span key={1}>By joining, I agree to the </span>,
                      <Link key={2} href="/terms-of-use">
                        Terms of use
                      </Link>,
                      <span key={3}> and </span>,
                      <Link key={4} href="/privacy-policy">
                        Privacy policy
                      </Link>,
                    ]}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mb-4"
                  />
                  <Button
                    type="submit"
                    disabled={!agree}
                    size="lg"
                    variant="primary w-100"
                  >
                    Sign up
                  </Button>
                  {error && <div className="text-danger">{error}</div>}
                </Form>
                <div className="d-flex align-items-center py-3 my-4">
                  <hr className="w-100" />
                  <div className="px-3">Or</div>
                  <hr className="w-100" />
                </div>
                <div className="text-center">
                  Already have an account? <Link href="/login">Log in</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupLightPage
