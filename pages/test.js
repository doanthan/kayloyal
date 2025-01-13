import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import { Card, Button, Badge, Form } from "react-bootstrap"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Apple, Google } from 'react-bootstrap-icons'
import GooglePassFront from 'components/pass/GooglePassFront'
import ApplePassFront from 'components/pass/ApplePassFront'
import axios from 'axios'
import { getConfigToken } from "services/library"
import { onlyAuthUserSSR } from "services/server-library"

const PassDetails = ({ user, pass }) => {
    const router = useRouter()
    const [wallet, setWallet] = useState('google')
    const [isEditing, setIsEditing] = useState(false)
    const [editedPass, setEditedPass] = useState(pass)
    const [imagePreviews, setImagePreviews] = useState({
        iconImage: pass.images?.logo?.google,
        stripImage: pass.images?.strip?.google
    })

    const handleImageChange = async (e) => {
        const { name, files } = e.target
        if (files && files[0]) {
            // Create preview URL
            const previewUrl = URL.createObjectURL(files[0])
            setImagePreviews(prev => ({
                ...prev,
                [name]: previewUrl
            }))

            // Convert to base64
            const reader = new FileReader()
            reader.onloadend = () => {
                setEditedPass(prev => ({
                    ...prev,
                    images: {
                        ...prev.images,
                        [name === 'iconImage' ? 'logo' : 'strip']: {
                            google: reader.result
                        }
                    }
                }))
            }
            reader.readAsDataURL(files[0])
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditedPass(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEdit = async () => {
        try {
            // Create payload with only the fields that can be updated
            const passDataToSend = {
                name: editedPass.name,
                type: editedPass.type,
                barcodeType: editedPass.barcodeType,
                backgroundColor: editedPass.backgroundColor,
                textColor: editedPass.textColor,
                labelColor: editedPass.labelColor,
                images: {
                    logo: {
                        google: editedPass.images?.logo?.google
                    },
                    strip: {
                        google: editedPass.images?.strip?.google
                    }
                }
            }

            const response = await axios.patch(
                `/api/pass/${pass._id}`,
                passDataToSend,
                getConfigToken('application/json')  // If you need auth headers
            )

            // Update local state with new data
            setPass(response.data.data)
            setEditedPass(response.data.data)
            setIsEditing(false)

            // Optional: Show success message
            alert('Pass updated successfully!')

        } catch (error) {
            console.error('Error updating pass:', error)
            alert('Failed to update pass: ' + error.response?.data?.message || error.message)
        }
    }

    return (
        <Layout pageTitle="Pass Details" user={user}>
            <AccountLayout accountPageTitle={`Pass: ${pass.name}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button variant="outline-secondary" onClick={() => router.push('/passes')}>
                        Back
                    </Button>
                    <div>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline-secondary"
                                    className="me-2"
                                    onClick={() => {
                                        setIsEditing(false)
                                        setEditedPass(pass)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button variant="success" onClick={handleEdit}>
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button variant="primary" onClick={() => setIsEditing(true)}>
                                Edit Pass
                            </Button>
                        )}
                    </div>
                </div>

                <Row className="mt-4">
                    {/* Left Column - Details/Editor */}
                    <Col md={6}>
                        <Card className="p-3">
                            <Form>
                                {/* Basic Information */}
                                <Form.Group className="mb-3">
                                    <h6>Pass Name</h6>
                                    {isEditing ? (
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={editedPass.name}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p className="mb-0">{pass.name}</p>
                                    )}
                                </Form.Group>

                                {/* Images */}
                                <h6 className="mb-3 mt-4">Pass Images</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label>Logo Image</Form.Label>
                                    {isEditing ? (
                                        <>
                                            <Form.Control
                                                type="file"
                                                name="iconImage"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />

                                            <div className="image-preview-container mt-2 position-relative d-inline-block">
                                                <img
                                                    src={imagePreviews.iconImage}
                                                    alt="Logo preview"
                                                    className="preview-image"
                                                />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => removeImage('stripImage')}
                                                    aria-label="Remove image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="image-preview-container mt-2 position-relative d-inline-block">
                                            <img
                                                src={imagePreviews.iconImage}
                                                alt="Logo preview"
                                                className="preview-image"
                                            />
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Strip Image</Form.Label>
                                    {isEditing ? (
                                        <>
                                            <Form.Control
                                                type="file"
                                                name="stripImage"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <div className="image-preview-container mt-2 position-relative d-inline-block">
                                                <img
                                                    src={imagePreviews.stripImage}
                                                    alt="Strip preview"
                                                    className="preview-image"
                                                />
                                                <button
                                                    type="button"
                                                    className="remove-image-btn"
                                                    onClick={() => removeImage('stripImage')}
                                                    aria-label="Remove image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="image-preview-container mt-2 position-relative d-inline-block">
                                            <img
                                                src={imagePreviews.stripImage}
                                                alt="Strip preview"
                                                className="preview-image"
                                            />
                                        </div>
                                    )}
                                </Form.Group>

                                {/* Colors */}
                                <h6 className="mb-3 mt-4">Pass Colors</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label>Background Color</Form.Label>
                                    {isEditing ? (
                                        <Form.Control
                                            type="color"
                                            name="backgroundColor"
                                            value={editedPass.backgroundColor}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div
                                            className="color-preview"
                                            style={{
                                                backgroundColor: pass.backgroundColor,
                                                width: '50px',
                                                height: '25px',
                                                border: '1px solid #dee2e6'
                                            }}
                                        />
                                    )}
                                </Form.Group>

                                {/* Add other color inputs similarly */}
                            </Form>
                        </Card>
                    </Col>

                    {/* Right Column - Preview */}
                    <Col md={6}>
                        <div className="position-sticky" style={{ top: '20px' }}>
                            <div className="d-flex justify-content-center mb-3">
                                <Button
                                    variant={wallet === 'apple' ? 'primary' : 'outline-secondary'}
                                    className="me-2"
                                    onClick={() => setWallet('apple')}
                                >
                                    <Apple className="me-2" />
                                    Apple
                                </Button>
                                <Button
                                    variant={wallet === 'google' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setWallet('google')}
                                >
                                    <Google className="me-2" />
                                    Google
                                </Button>
                            </div>

                            {/* Phone Preview */}
                            <div className="d-flex justify-content-center">
                                <div style={{
                                    width: '280px',
                                    height: '560px',
                                    border: '12px solid #333',
                                    borderRadius: '36px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {wallet === 'google' ? (
                                        <GooglePassFront
                                            {...(isEditing ? editedPass : pass)}
                                            iconImage={imagePreviews.iconImage}
                                            stripImage={imagePreviews.stripImage}
                                        />
                                    ) : (
                                        <ApplePassFront
                                            {...(isEditing ? editedPass : pass)}
                                            iconImage={imagePreviews.iconImage}
                                            stripImage={imagePreviews.stripImage}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </AccountLayout>
        </Layout>
    )
}

export default PassDetails
export const getServerSideProps = async (context) => {
    const { req, params } = context
    const { id } = params

    // Check authentication
    const user = await onlyAuthUserSSR(req, "passes", id)
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }

    try {


        return {
            props: {
                user: user || null,
                pass: JSON.parse(JSON.stringify(user.passes[0])) // Serialize for Next.js
            }
        }
    } catch (error) {
        console.error('Error fetching pass:', error)
        return {
            props: {
                user: user || null,
                pass: null
            }
        }
    }
}