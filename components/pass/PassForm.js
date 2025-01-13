import { useState } from 'react'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import { Apple, Google } from 'react-bootstrap-icons'
import GooglePassFront from './GooglePassFront'
import ApplePassFront from './ApplePassFront'

const PassForm = ({
    initialData = {
        name: '',
        type: 'storeCard',
        barcodeType: 'QR_CODE',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        labelColor: '#666666',
        images: {
            logo: { google: null },
            strip: { google: null }
        }
    },
    isEditing = false,
    onSubmit,
    onCancel
}) => {
    const [wallet, setWallet] = useState('google')
    const [passData, setPassData] = useState(initialData)
    const [imagePreviews, setImagePreviews] = useState({
        iconImage: initialData.images?.logo?.google,
        stripImage: initialData.images?.strip?.google
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
                setPassData(prev => ({
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
        setPassData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <Row className="mt-4">
            {/* Left Column - Form */}
            <Col md={6}>
                <Card className="p-3">
                    <Form>
                        {/* Basic Information */}
                        <Form.Group className="mb-3">
                            <h6>Pass Name</h6>
                            <Form.Control
                                type="text"
                                name="name"
                                value={passData.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Images */}
                        <h6 className="mb-3 mt-4">Pass Images</h6>
                        {/* ... your existing image inputs ... */}

                        {/* Colors */}
                        <h6 className="mb-3 mt-4">Pass Colors</h6>
                        {/* ... your existing color inputs ... */}

                        {/* Actions */}
                        <div className="d-flex justify-content-end mt-3">
                            {onCancel && (
                                <Button
                                    variant="outline-secondary"
                                    className="me-2"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                onClick={() => onSubmit(passData)}
                            >
                                {isEditing ? 'Save Changes' : 'Create Pass'}
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Col>

            {/* Right Column - Preview */}
            <Col md={6}>
                {/* ... your existing preview section ... */}
            </Col>
        </Row>
    )
}

export default PassForm 