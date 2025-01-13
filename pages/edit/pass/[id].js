import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import { Tabs, Tab, Row, Col, Button, Form, Card, Modal, Spinner } from "react-bootstrap"
import { Apple, Google, Party } from 'react-bootstrap-icons'
import { onlyAuthUserSSR } from "services/server-library"
import FrontPassInput from "components/pass/FrontPassInput"
import { useState } from "react"
import { getConfigToken } from "services/library"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/router"
import { QRCodeSVG } from 'qrcode.react';  // Changed this line

const CreatePass = ({ user }) => {
    const [wallet, setWallet] = useState('google')
    const [isPublishing, setIsPublishing] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [newPassId, setNewPassId] = useState(null)
    const router = useRouter()

    const [passData, setPassData] = useState({
        // Basic Info
        name: '',
        type: 'storeCard',

        images: {
            logo: {
                google: "/images/city-guide/blog/01.jpg"
            },
            strip: {
                google: "/images/logo1.png"
            }
        },
        // Colors
        backgroundColor: '#FFFFFF',
        textColor: '#000000',

    })

    const createPublicPass = async () => {
        setIsPublishing(true)
        try {
            // Create payload with all data including base64 images
            const passDataToSend = {
                name: passData.name,
                type: passData.type,
                barcodeType: passData.barcodeType,
                backgroundColor: passData.backgroundColor,
                textColor: passData.textColor,
                iconImage: passData.iconImage,  // base64 string
                stripImage: passData.stripImage,  // base64 string
                cardType: "Loyalty Cards"
            }

            // console.log("Making API call with:", passDataToSend)
            // const response = await axios.post(
            //     '/api/pass',
            //     passDataToSend,
            //     getConfigToken("application/json")  // Changed to JSON content type
            // )
            setNewPassId("response.data.passId")
            setShowSuccessModal(true)
            toast.success('Pass created successfully!')

        } catch (error) {
            console.error('Failed to publish pass:', error)
            toast.error(error.response?.data?.message || 'Failed to create pass')
        } finally {
            setIsPublishing(false)
        }
    }

    const passUrl = newPassId ? `https://www.kaypass.com/${newPassId}` : '';

    return (
        <Layout pageTitle="Create Pass" user={user}>
            <AccountLayout accountPageTitle="Create Pass">
                {/* Top Action Buttons */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button variant="outline-secondary">
                        Back
                    </Button>
                    <div>
                        <Button variant="outline-primary" className="me-2">
                            Save
                        </Button>
                        <Button
                            variant="primary"
                            onClick={createPublicPass}
                            disabled={isPublishing}
                        >
                            {isPublishing ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Publishing...
                                </>
                            ) : (
                                'Publish'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Pass Editor Tabs */}
                <Tabs
                    defaultActiveKey="front"
                    className="mb-4"
                >
                    <Tab eventKey="front" title="Front of Pass">
                        <FrontPassInput wallet={wallet} setWallet={setWallet} passData={passData} setPassData={setPassData} createPublicPass={createPublicPass} />
                    </Tab>

                    <Tab eventKey="back" title="Back of Pass">
                        {/* Similar layout for back of pass */}
                        <Row className="mt-4">
                            {/* Same structure as front, different inputs */}
                        </Row>
                    </Tab>
                </Tabs>
            </AccountLayout>

            {/* Success Modal with QR Code */}
            <Modal
                show={showSuccessModal}
                onHide={() => setShowSuccessModal(false)}
                centered
            >
                <Modal.Body className="text-center py-5">
                    <div className="display-1 mb-4">🎉</div>
                    <h3 className="mb-4">Your Pass is Live!</h3>

                    {/* QR Code */}
                    <div className="mb-4 d-flex justify-content-center">
                        <div className="p-3 bg-white rounded shadow-sm">
                            <QRCodeSVG
                                value={"ABC123"}
                                size={180}
                                level="H"
                                includeMargin={true}
                                renderAs="svg"
                            />
                        </div>
                    </div>

                    {/* Pass URL */}
                    <div className="mb-4">
                        <p className="text-muted mb-2">Share this link:</p>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            <code className="bg-light px-3 py-2 rounded">
                                {passUrl}
                            </code>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(passUrl);
                                    toast.success('Link copied to clipboard!');
                                }}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.push('/dashboard');
                            }}
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.push(`/add/${newPassId}`);
                            }}
                        >
                            View Pass
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Layout>
    )
}

export default CreatePass


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