import { useRouter } from 'next/router'
import Layout from "components/layout/Layout"
import AccountLayout from "components/layout/AccountLayout"
import { Card, Button } from "react-bootstrap"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Apple, Google } from 'react-bootstrap-icons'
import GooglePassFront from 'components/pass/GooglePassFront'
import ApplePassFront from 'components/pass/ApplePassFront'
import { onlyAuthUserSSR } from "services/server-library"
import { useState } from 'react'

const PassDetails = ({ user, pass }) => {
    const router = useRouter()
    const [wallet, setWallet] = useState('google')

    return (
        <Layout pageTitle="Pass Details" user={user}>
            <AccountLayout accountPageTitle={`Pass: ${pass.name}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button variant="outline-secondary" onClick={() => router.push('/passes')}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={() => router.push(`/edit/pass/${pass._id}`)}>
                        Edit Pass
                    </Button>
                </div>

                <Row className="mt-4">
                    {/* Left Column - Details */}
                    <Col md={6}>
                        <Card className="p-3">
                            {/* Basic Information */}
                            <div className="mb-3">
                                <h6>Pass Name</h6>
                                <p className="mb-0">{pass.name}</p>
                            </div>

                            {/* Images */}
                            <h6 className="mb-3 mt-4">Pass Images</h6>
                            <div className="mb-3">
                                <div>Logo Image</div>
                                <div className="image-preview-container mt-2 position-relative d-inline-block">
                                    <img
                                        src={pass.images?.logo?.google}
                                        alt="Logo preview"
                                        className="preview-image"
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <div>Strip Image</div>
                                <div className="image-preview-container mt-2 position-relative d-inline-block">
                                    <img
                                        src={pass.images?.strip?.google}
                                        alt="Strip preview"
                                        className="preview-image"
                                    />
                                </div>
                            </div>

                            {/* Colors */}
                            <h6 className="mb-3 mt-4">Pass Colors</h6>
                            <div className="mb-3">
                                <div>Background Color</div>
                                <div
                                    className="color-preview"
                                    style={{
                                        backgroundColor: pass.backgroundColor,
                                        width: '50px',
                                        height: '25px',
                                        border: '1px solid #dee2e6'
                                    }}
                                />
                            </div>
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
                                            {...pass}
                                            iconImage={pass.images?.logo?.google}
                                            stripImage={pass.images?.strip?.google}
                                        />
                                    ) : (
                                        <ApplePassFront
                                            {...pass}
                                            iconImage={pass.images?.logo?.google}
                                            stripImage={pass.images?.strip?.google}
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
                pass: JSON.parse(JSON.stringify(user.passes[0]))
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