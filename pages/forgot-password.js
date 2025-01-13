import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import ImageLoader from "components/library/ImageLoader"
import Spinner from "react-bootstrap/Spinner"
import { useForm } from "react-hook-form"
import axios from "axios"

const ForgotPassword = () => {
    // Add class to body to enable gray background
    useEffect(() => {
        const body = document.querySelector("body")
        document.body.classList.add("bg-dark")
        return () => body.classList.remove("bg-dark")
    })

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setIsLoading(true)
        setMessage({ type: "", text: "" })
        try {
            await axios.post("/api/forgot-password", data)
            setMessage({
                type: "success",
                text: "If an account exists with this email, you will receive password reset instructions.",
            })
        } catch (err) {
            console.error(err)
            setMessage({
                type: "danger",
                text: "An error occurred. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Head>
                <title>Kaypush | Forgot Password</title>
            </Head>

            <main className="page-wrapper">
                <div className="container-fluid d-flex h-100 align-items-center justify-content-center py-4 py-sm-5">
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
                                <h4 className="mb-4 mb-sm-5">Reset Password</h4>
                                <div className="d-flex justify-content-center">
                                    <ImageLoader
                                        src="/images/signin-modal/signin.svg"
                                        width={344}
                                        height={292}
                                        alt="Illustration"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 px-2 pt-2 pb-4 px-sm-5 pb-sm-5 pt-md-5">
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group controlId="fp-email" className="mb-4">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address",
                                                },
                                            })}
                                        />
                                        {errors.email && (
                                            <Form.Text className="text-danger">
                                                {errors.email.message}
                                            </Form.Text>
                                        )}
                                    </Form.Group>

                                    {message.text && (
                                        <div className={`text-${message.type} mb-4`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <Button type="submit" size="lg" variant="primary w-100">
                                        {isLoading ? (
                                            <Spinner animation="border" role="status">
                                                <span className="sr-only"></span>
                                            </Spinner>
                                        ) : (
                                            "Send Reset Instructions"
                                        )}
                                    </Button>

                                    <div className="text-center mt-4">
                                        Remember your password?{" "}
                                        <Link href="/login">Sign in here</Link>
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

export default ForgotPassword