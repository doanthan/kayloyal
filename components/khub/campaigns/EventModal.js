import { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Spinner } from 'react-bootstrap'
import { DateTime } from "luxon"
import { decompressData } from "services/library"
import axios from 'axios'
import { getConfigToken, createGmailLikePreview } from 'services/library'

function EventModal({ showModal, selectedEvent, handleCloseModal }) {
    const [campaignStats, setCampaignStats] = useState()
    const [included, setIncluded] = useState()
    const [excluded, setExcluded] = useState()
    const [html, setHtml] = useState()
    const [estimate, setEstimate] = useState()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {

        if (selectedEvent) {
            const fetchData = async () => {
                console.log(selectedEvent)
                const { data } = await axios.get(`/api/get-campaign-modal?klaviyoPublic=${selectedEvent.klaviyoPublic}&id=${selectedEvent.campaign_id}`, getConfigToken())
                data.included && setIncluded(data.included)
                data.excluded && setExcluded(data.excluded)
                data.html && setHtml(data.html)
                setIsLoading(false)
            }
            fetchData()
        }


    }, [showModal, selectedEvent])

    const formatSendTime = (dateString) => {
        const date = DateTime.fromISO(dateString);
        return date.toFormat("ccc dd LLL yyyy h:mma");
    };

    const handleClose = () => {
        handleCloseModal()
        // Clear the state when the modal is closed
        setCampaignStats(null)
        setIncluded(null)
        setExcluded(null)
        setHtml(null)
        setIsLoading(true)
    }


    return (
        <Modal size="xl" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedEvent?.campaignName}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="h-100 ">
                <Row className="h-100 m-0">
                    <Col xs='6'>
                        <Row>
                            <Col md={6}>
                                <p><strong>Account:</strong> {selectedEvent?.accountName}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Status:</strong> Sent</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <p><strong>Send Time:</strong> {formatSendTime(selectedEvent?.send_time)}
                                </p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Tags:</strong> {selectedEvent?.tagNames}</p>
                            </Col>
                        </Row>                            <Row>
                            {(included?.length > 0 || excluded?.length > 0) && (
                                <>
                                    <Col md={6}>
                                        <p><strong>Send To:</strong> {included?.join(', ') || 'None'}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Don't send to:</strong> {excluded?.join(', ') || 'None'}</p>
                                    </Col>
                                </>
                            )}
                            {
                                estimate && <Col md={6}>
                                    <p><strong>Estimated Recipients:</strong> {estimate.toLocaleString()}</p>
                                </Col>
                            }
                        </Row>

                        <Row className="mt-3">
                            <Col md={6}>
                                <p><strong>Deliveries:</strong> {selectedEvent?.statistics?.delivered.toLocaleString()}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Opens:</strong> {selectedEvent?.statistics?.opens.toLocaleString()}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Open Rate:</strong> {(selectedEvent?.statistics?.open_rate * 100).toFixed(2)}%</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Clicks:</strong> {selectedEvent?.statistics.clicks?.toLocaleString()}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Click Rate:</strong> {(selectedEvent?.statistics?.click_rate * 100).toFixed(2)}%</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Revenue:</strong> ${selectedEvent?.statistics?.conversion_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Revenue per Recipient:</strong> ${(selectedEvent?.statistics?.conversion_value / selectedEvent?.statistics.recipients).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </Col>

                        </Row>

                    </Col>
                    <Col xs='6' className="h-100 p-0 d-flex align-items-center justify-content-center">                        {isLoading ? <Spinner /> : html && (
                        <div style={{ height: '650px', overflow: 'auto' }}>
                            <iframe
                                srcDoc={createGmailLikePreview(html)}
                                title="Campaign Preview"
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                            />
                        </div>
                    )}
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EventModal

