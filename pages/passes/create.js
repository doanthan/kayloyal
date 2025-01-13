import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import { Tabs, Tab, Row, Col, Button, Form, Card } from "react-bootstrap"
import { Apple, Google } from 'react-bootstrap-icons'
import { onlyAuthUserSSR } from "services/server-library"
import FrontPassInput from "components/pass/FrontPassInput"
import { useState } from "react"
import { getConfigToken } from "services/library"
import axios from "axios"

const CreatePass = ({ user }) => {
    const [wallet, setWallet] = useState('google')


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

            console.log("Making API call with:", passDataToSend)
            const response = await axios.post(
                '/api/pass',
                passDataToSend,
                getConfigToken("application/json")  // Changed to JSON content type
            )
            return response.data

        } catch (error) {
            console.error('Error creating pass:', error)
            throw error  // Re-throw error for handling in the component
        }
    }


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
                        <Button variant="primary">
                            Publish
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
        const cleanedData = user.accounts.map((account) => ({
            label: account.name,
            value: account.klaviyoPublic,
        }))
        return {
            props: {
                user: user || null,
                accountDetails: cleanedData,
            },
        }
    }
}
