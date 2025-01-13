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

const ResetPassword = () => {
    const router = useRouter()
    const { token } = router.query
    const [isLoading, setIsLoading] = useState(false)
    const [isValidToken, setIsValidToken] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    // Add class to body
    useEffect(() => {
        const body = document.querySelector("body")
        document.body.classList.add("bg-dark")
        return () => body.classList.remove("bg-dark")
    })

    // Validate token when component mounts
    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const response = await axios.post("/api/validate-reset-token", { token })
                    setIsValidToken(response.data.valid)
                    if (!response.data.valid) {
                        setMessage({
                            type: "danger",
                            text: "This password reset link has expired or is invalid.",
                        })
                    }
                } catch (error) {
                    setMessage({
                        type: "danger",
                        text: "This password reset link has expired or is invalid.",
                    })
                }
            }
        }
        validateToken()
    }, [token])

    const onSubmit = async (data) => {
        setIsLoading(true)
        setMessage({ type: "", text: "" })

        try {
            await axios.post("/api/reset-password", {
                token,
                password: data.password,
            })
            setMessage({
                type: "success",
                text: "Password successfully reset. Redirecting to login...",
            })
            setTimeout(() => router.push("/login"), 2000)
        } catch (error) {
            setMessage({
                type: "danger",
                text: error.response?.data?.message || "An error occurred. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <>
            <Head>
                <title>Kaypush | Reset Password</title>
            </Head>

            <main className="page-wrapper">
                <div className="container-fluid d-flex h-100 align-items-center justify-content-center py-4 py-sm-5">
                    <div className="card card-body" style={{ maxWidth: "940px" }}>
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
                                <h4 className="mb-4 mb-sm-5">Reset Your Password</h4>
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
                                {isValidToken ? (
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group controlId="password" className="mb-4">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Minimum 8 characters"
                                                {...register("password", {
                                                    required: "Password is required",
                                                    minLength: {
                                                        value: 8,
                                                        message: "Password must be at least 8 characters"
                                                    },
                                                    pattern: {
                                                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                                                        message: "Password must contain at least one letter and one number"
                                                    }
                                                })}
                                            />
                                            {errors.password && (
                                                <Form.Text className="text-danger">
                                                    {errors.password.message}
                                                </Form.Text>
                                            )}
                                        </Form.Group>

                                        <Form.Group controlId="confirmPassword" className="mb-4">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Re-enter your password"
                                                {...register("confirmPassword", {
                                                    required: "Please confirm your password",
                                                    validate: (value) => {
                                                        if (watch('password') !== value) {
                                                            return "Passwords do not match";
                                                        }
                                                    }
                                                })}
                                            />
                                            {errors.confirmPassword && (
                                                <Form.Text className="text-danger">
                                                    {errors.confirmPassword.message}
                                                </Form.Text>
                                            )}
                                        </Form.Group>

                                        {/* Add password requirements helper text */}
                                        <div className="mb-4 small text-muted">
                                            Password requirements:
                                            <ul className="mt-2 ps-3">
                                                <li>Minimum 8 characters</li>
                                                <li>Must contain at least one letter</li>
                                                <li>Must contain at least one number</li>
                                            </ul>
                                        </div>

                                        {message.text && (
                                            <div className={`text-${message.type} mb-4`}>
                                                {message.text}
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            size="lg"
                                            variant="primary"
                                            className="w-100"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Spinner animation="border" size="sm" />
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </Button>
                                    </Form>
                                ) : (
                                    <div className="text-center">
                                        {message.text && (
                                            <div className={`text-${message.type} mb-4`}>
                                                {message.text}
                                            </div>
                                        )}
                                        <Link href="/forgot-password" className="btn btn-primary">
                                            Request New Reset Link
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ResetPassword