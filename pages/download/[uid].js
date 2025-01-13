import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import { Apple, Android2 } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';

const PassView = () => {
    const router = useRouter();
    const { uid } = router.query;
    const [pass, setPass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPass = async () => {
            if (!uid) return; // Wait for uid to be available

            try {
                setLoading(true);
                //SHOULD GET FROM JSON HERE
                //const response = await axios.get(`/api/pass/${uid}`);
                //setPass(response.data);
                setPass(
                    {
                        name: "Test Pass",
                        type: "event",
                        fields: [{ name: "Name", value: "John Doe" }],
                        theme: "light",
                        barcodeType: "qr",
                        barcodeValue: "1234567890"
                    }
                );
            } catch (error) {
                console.error('Failed to fetch pass:', error);
                setError(error.response?.data?.message || 'Failed to load pass');
                toast.error('Failed to load pass');
            } finally {
                setLoading(false);
            }
        };

        fetchPass();
    }, [uid]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="shadow-sm border-0">
                <Card.Body className="text-center p-5">
                    <div className="display-1 mb-4">😕</div>
                    <h3>Pass Not Found</h3>
                    <p className="text-muted">
                        {error}
                    </p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div className="pass-container">
            <div className="radial-gradient-overlay"></div>

            <div className="content-wrapper">
                {/* Cards Container */}
                <div className="cards-container">
                    {/* QR Card (Centered) */}
                    <Card className="pass-card qr-card">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                            <h3 className="mb-4">{pass?.name || 'Digital Pass'}</h3>
                            <div className="qr-wrapper">
                                <QRCodeSVG
                                    value={`https://kaypass.com/pass/${uid}`}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Logo Card (Offset) */}
                    <Card className="pass-card logo-card">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                            <img
                                src={pass?.logo || '/default-logo.png'}
                                alt="Pass Logo"
                                className="pass-logo"
                            />
                        </Card.Body>
                    </Card>
                </div>

                {/* Wallet Buttons */}
                <div className="wallet-buttons">
                    <Button variant="dark" className="wallet-btn">
                        <Apple size={20} className="me-2" />
                        Add to Apple Wallet
                    </Button>
                    <Button variant="primary" className="wallet-btn">
                        <Android2 size={20} className="me-2" />
                        Add to Google Wallet
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PassView;
