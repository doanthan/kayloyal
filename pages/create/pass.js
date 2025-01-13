import React, { useState } from 'react'
import { Form, Button, Container, Card, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import { onlyAuthUserSSR } from "services/server-library"
import { getConfigToken, convertFileToBase64 } from "services/library"
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

const CreatePass = ({ user }) => {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [logoImage, setLogoImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = React.useRef(null)
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            businessName: '',
            name: '',
            cardType: ''
        }
    })
    const [isCreating, setIsCreating] = useState(false)

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)  // Store the actual file
            setLogoImage(URL.createObjectURL(file))  // Create preview URL
        }
    }


    // Watch all form fields for preview
    const watchAllFields = watch()

    const handleCardSelection = (type) => {
        setValue('cardType', type)
        nextStep()
    }

    const onSubmit = async (data) => {
        setIsCreating(true)
        try {
            if (!selectedFile) {
                throw new Error('Please select a logo image')
            }

            // Convert to base64
            const base64String = await convertFileToBase64(selectedFile)
            console.log(base64String)
            // const { data: uploadData } = await axios.post('/api/upload-image', {
            //     img: base64String
            // }, getConfigToken('application/json'))

            // if (!uploadData.imageUrl) {
            //     throw new Error('Failed to upload image')
            // }

            // Create pass with image URL
            const { data: passData } = await axios.post('/api/pass', {
                businessName: data.businessName,
                name: data.name,
                cardType: data.cardType,
                brandLogo: "https://cdn.kaypush.com/logos/logo-p4-nOCABE1LGdPr18y9kaXt9.png"
            }, getConfigToken())

            if (passData) {
                console.log('Pass created successfully:', passData)
            }
            router.push(`/edit/pass/677cd4081278817dbde3dc6b`)
        } catch (error) {
            console.error('Error:', error?.response?.data || error.message)
            toast.error('Failed to create pass')
        } finally {
            setIsCreating(false)
        }
    }

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your business name"
                            {...register("businessName", {
                                required: "Business name is required"
                            })}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && watch('businessName')) {
                                    e.preventDefault()
                                    nextStep()
                                }
                            }}
                        />
                        {errors.businessName && (
                            <Form.Text className="text-danger">
                                {errors.businessName.message}
                            </Form.Text>
                        )}
                    </Form.Group>
                )
            case 2:
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>Pass Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your pass name"
                            {...register("name", {
                                required: "Pass name is required"
                            })}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && watch('name')) {
                                    e.preventDefault()
                                    nextStep()
                                }
                            }}
                        />
                        {errors.name && (
                            <Form.Text className="text-danger">
                                {errors.name.message}
                            </Form.Text>
                        )}
                    </Form.Group>
                )
            case 3:
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>Card Type</Form.Label>
                        <div className="d-grid gap-2">
                            <Button
                                variant={watchAllFields.cardType === 'One-Time Use Cards' ? 'primary' : 'outline-primary'}
                                className="text-start p-3"
                                onClick={() => handleCardSelection('One-Time Use Cards')}
                            >
                                <h5>One-Time Use Cards</h5>
                                <small className={watchAllFields.cardType === 'One-Time Use Cards' ? 'text-white' : 'text-muted'}>
                                    Perfect for single-use promotions or events
                                </small>
                            </Button>
                            <Button
                                variant={watchAllFields.cardType === 'Loyalty Cards' ? 'primary' : 'outline-primary'}
                                className="text-start p-3"
                                onClick={() => handleCardSelection('Loyalty Cards')}
                            >
                                <h5>Loyalty Cards</h5>
                                <small className={watchAllFields.cardType === 'Loyalty Cards' ? 'text-white' : 'text-muted'}>
                                    Great for ongoing customer rewards programs
                                </small>
                            </Button>
                        </div>
                    </Form.Group>
                )
            case 4:
                return (
                    <Form.Group className="mb-3">
                        <Form.Label>Brand Logo</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mb-3"
                            key={selectedFile ? selectedFile.name : 'empty'}
                        />
                        {logoImage && (
                            <div className="mt-3 text-center">
                                <p className="text-muted mb-2">
                                    Selected file: {selectedFile?.name}
                                </p>
                                <div
                                    className="d-inline-block position-relative"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img
                                        src={logoImage}
                                        alt="Logo Preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </Form.Group>
                )
            default:
                return null
        }
    }

    return (
        <Layout pageTitle="Create Pass" user={user}>
            <AccountLayout accountPageTitle="Create Pass">
                <div className="d-flex gap-4">
                    {/* Form Card */}
                    <Card className="shadow-sm flex-grow-1">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h4>Create New Pass</h4>
                                <small className="text-muted">
                                    Step {step} of 4
                                </small>
                            </div>

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                {renderStep()}

                                <div className="d-flex justify-content-between mt-4">
                                    {step > 1 && (
                                        <Button
                                            variant="outline-secondary"
                                            onClick={prevStep}
                                        >
                                            Back
                                        </Button>
                                    )}
                                    {step < 4 && (
                                        <Button
                                            variant="primary"
                                            onClick={nextStep}
                                            disabled={
                                                (step === 1 && !watch('businessName')) ||
                                                (step === 2 && !watch('name'))
                                            }
                                        >
                                            Next
                                        </Button>
                                    )}
                                    {step === 4 && (
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={!logoImage || isCreating}
                                        >
                                            {isCreating ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="me-2"
                                                    />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create Pass'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Preview Card */}
                    <Card className="shadow-sm" style={{ width: '300px' }}>
                        <Card.Body className="p-4">
                            <h5 className="mb-4">Pass Preview</h5>

                            {/* Logo Preview */}
                            {logoImage && (
                                <div className="mb-3 text-center">
                                    <small className="text-muted d-block mb-2">Logo</small>
                                    <div
                                        className="d-inline-block position-relative"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={logoImage}
                                            alt="Logo Preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {watchAllFields.businessName && (
                                <div className="mb-3">
                                    <small className="text-muted d-block">Business Name</small>
                                    <div className="fw-medium">
                                        {watchAllFields.businessName}
                                    </div>
                                </div>
                            )}

                            {watchAllFields.name && (
                                <div className="mb-3">
                                    <small className="text-muted d-block">Pass Name</small>
                                    <div className="fw-medium">
                                        {watchAllFields.name}
                                    </div>
                                </div>
                            )}

                            {watchAllFields.cardType && (
                                <div className="mb-3">
                                    <small className="text-muted d-block">Card Type</small>
                                    <div className="fw-medium">
                                        {watchAllFields.cardType}
                                    </div>
                                    <small className="text-muted">
                                        {watchAllFields.cardType === 'One-Time Use Cards'
                                            ? 'Single-use promotion or event pass'
                                            : 'Ongoing rewards program pass'}
                                    </small>
                                </div>
                            )}

                            {!watchAllFields.businessName &&
                                !watchAllFields.name &&
                                !watchAllFields.cardType && (
                                    <div className="text-muted text-center">
                                        <small>
                                            Fill in the form to see the preview
                                        </small>
                                    </div>
                                )}
                        </Card.Body>
                    </Card>
                </div>
            </AccountLayout>
        </Layout>
    )
}

export default CreatePass


export const getServerSideProps = async (context) => {
    const { req } = context

    const user = await onlyAuthUserSSR(req)
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    } else {
        return {
            props: {
                user: user || null,
            },
        }
    }
}

