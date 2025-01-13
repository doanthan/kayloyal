import { useState, useEffect } from 'react'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import { Apple, Google } from 'react-bootstrap-icons'
import GooglePassFront from './GooglePassFront'
import ApplePassFront from './ApplePassFront'
import { HexColorPicker, HexColorInput } from "react-colorful"
import { convertFileToBase64 } from "services/library"

const PassEditor = ({
    wallet = 'google', // or 'google'
    setWallet,
    passData,
    setPassData,
    createPublicPass
}) => {

    const [imagePreviews, setImagePreviews] = useState({
        iconImage: null,
        stripImage: null
    })

    const [showColorPicker, setShowColorPicker] = useState({
        background: false,
        foreground: false
    })


    const handleInputChange = async (e) => {
        const { name, value, type, files } = e.target

        // Handle file inputs
        if (files && files[0]) {
            const base64Img = await convertFileToBase64(files[0])


            setPassData(prev => ({
                ...prev,
                [name]: files[0]
            }))
            const previewUrl = base64Img


            // Create preview URL
            setImagePreviews(prev => ({
                ...prev,
                [name]: previewUrl
            }))
        }

        // Handle color inputs - ensure we're getting the hex value
        if (type === 'color') {
            setPassData(prev => ({
                ...prev,
                [name]: value  // Color inputs return hex values like "#FFFFFF"
            }))
            return
        }
        if (name === 'barcodeType') {
            setPassData(prev => ({
                ...prev,
                barcodeType: value,
            }))
            return
        }

        // Handle all other inputs
        setPassData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Add cleanup on unmount
    useEffect(() => {
        return () => {
            // Cleanup preview URLs
            Object.values(imagePreviews).forEach(url => {
                if (url) URL.revokeObjectURL(url)
            })
        }
    }, [imagePreviews])

    const barcodeTypes = [
        { value: 'QR_CODE', label: 'QR Code' },
        { value: 'PDF_417', label: 'PDF417' },
        { value: 'AZTEC', label: 'Aztec' },
        { value: 'CODE_128', label: 'Code 128' }
    ]
    {/* {value: 'PKBarcodeFormatQR', label: 'QR Code' },
                        {value: 'PKBarcodeFormatPDF417', label: 'PDF417' },
                        {value: 'PKBarcodeFormatAztec', label: 'Aztec' },
                        {value: 'PKBarcodeFormatCode128', label: 'Code 128' } */}

    const removeImage = (name) => {
        // Clear the file input
        setPassData(prev => ({
            ...prev,
            [name]: null
        }))

        // Clear the preview
        if (imagePreviews[name]) {
            URL.revokeObjectURL(imagePreviews[name])
            setImagePreviews(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }


    return (
        <Row className="mt-4">
            {/* Left Column - Inputs */}
            <Col md={6}>
                <Card className="p-3">
                    <Form>
                        {/* Basic Information */}
                        <Form.Group className="mb-3">
                            <h6>Pass Name</h6>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="e.g., Coffee Shop Rewards"
                                value={passData.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Images */}
                        <h6 className="mb-3 mt-4">Pass Images</h6>
                        <Form.Group className="mb-3">
                            <Form.Label>Logo Image (Required)</Form.Label>
                            <Form.Control
                                type="file"
                                name="iconImage"
                                accept="image/*"
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-muted">
                                Square image, minimum 160x160px
                            </Form.Text>
                        </Form.Group>
                        {/* Preview Container */}
                        {imagePreviews.iconImage && (
                            <div className="image-preview-container mt-2 position-relative d-inline-block">
                                <img
                                    src={imagePreviews.iconImage}
                                    alt="Icon preview"
                                    className="preview-image"
                                />
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => removeImage('iconImage')}
                                    aria-label="Remove image"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Strip Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="stripImage"
                                accept="image/*"
                                onChange={handleInputChange}
                            />
                            <Form.Text className="text-muted">
                                Banner image, recommended 960x369px
                            </Form.Text>
                        </Form.Group>
                        {imagePreviews.stripImage && (
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

                        )}

                        {/* Colors */}
                        <h6 className="mb-3 mt-4">Pass Colors</h6>
                        <Form.Group className="mb-3">
                            <Form.Label>Background Color</Form.Label>
                            <Form.Control
                                type="color"
                                name="backgroundColor"
                                value={passData.backgroundColor || '#FFFFFF'}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Text Color</Form.Label>
                            <Form.Control
                                type="color"
                                name="textColor"
                                value={passData.textColor}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <h6 className="mb-3 mt-4">Code Settings</h6>
                        <Form.Group className="mb-3">
                            <Form.Label>Barcode Type</Form.Label>
                            <Form.Select
                                name="barcodeType"
                                value={passData.barcodeType}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Barcode Type</option>
                                {barcodeTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                    </Form>
                    <Button variant="primary" className="mt-3" onClick={createPublicPass}>Publish Pass</Button>
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

                    {/* Phone Preview Container */}
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
                                <GooglePassFront {...passData} // Pass preview URLs instead of file paths
                                    iconImage={imagePreviews.iconImage}
                                    stripImage={imagePreviews.stripImage} />
                            ) : (
                                <ApplePassFront {...passData} // Pass preview URLs instead of file paths
                                    iconImage={imagePreviews.iconImage}
                                    stripImage={imagePreviews.stripImage} />
                            )}
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default PassEditor
