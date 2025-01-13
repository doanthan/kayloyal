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
  // Router
  const router = useRouter()
  const authService = useAuth()
  const [isLoading, setIsLoading] = useState(false) // new state variable

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true) // set loading to true when request starts
    try {
      const response = await axios.post("/api/login", data)
      await authService.login(response.data.token)
      router.push(`dashboard`)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false) // set loading to false when request ends
    }
  }
  return (
    <>
      {/* Custom page title attribute */}
      <Head>
        <title>kayloyal | Login</title>
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
                  <h3 className="d-inline-block mb-5">kayloyal</h3>
                </Link>
                <h4 className="mb-4 mb-sm-5">Welcome back 👋</h4>
                <div className="d-flex justify-content-center">
                  <ImageLoader
                    src="/images/signin-modal/signin.svg"
                    width={344}
                    height={292}
                    alt="Illusration"
                  />
                </div>
              </div>
              <div className="col-md-6 px-2 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group controlId="si-email" className="mb-4">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", { required: true })}
                    />
                    {errors.email && <span>This field is required</span>}
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <Form.Label htmlFor="si-password" className="mb-0">
                        Password
                      </Form.Label>
                      <Link href="#" className="fs-sm">
                        Forgot password?
                      </Link>
                    </div>
                    <PasswordToggle
                      id="si-password"
                      placeholder="Enter password"
                      required
                      {...register("password", { required: true })}
                    />
                    {errors.password && <span>This field is required</span>}
                  </Form.Group>
                  <Button type="submit" size="lg" variant="primary w-100">
                    {isLoading ? (
                      <Spinner animation="border" role="status">
                        <span className="sr-only"></span>
                      </Spinner>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                  <div className="d-flex align-items-center py-3 my-4">
                    <hr className="w-100" />
                    <div className="px-3">Or</div>
                    <hr className="w-100" />
                  </div>
                  <div className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup">Sign up here</Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Login
