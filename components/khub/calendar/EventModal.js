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
                const { data } = await axios.get(`/api/get-campaign-modal?klaviyoPublic=${selectedEvent.klaviyoPublic}&id=${selectedEvent.id}`, getConfigToken())
                data.included && setIncluded(data.included)
                data.excluded && setExcluded(data.excluded)
                data.html && setHtml(data.html)
                setIsLoading(false)
            }
            fetchData()
        }

        if (selectedEvent?.status === "Sent" && localStorage.getItem('campaignData')) {
            setEstimate(null)
            const compressed = localStorage.getItem('campaignData')
            const decompressed = decompressData(compressed);
            const data = JSON.parse(decompressed)
            const foundCampaign = data.find(campaign =>
                campaign.campaign_id === selectedEvent.id &&
                campaign.klaviyoPublic === selectedEvent.klaviyoPublic
            );
            if (foundCampaign) {
                setCampaignStats(foundCampaign);
            }

        } else if (selectedEvent?.status === "Scheduled") {
            const url = `/api/get-campaign-estimate?klaviyoPublic=${selectedEvent.klaviyoPublic}&id=${selectedEvent.id}`
            console.log(url)
            const getEstimateSegment = async () => {
                const { data } = await axios.get(url, getConfigToken())
                setEstimate(data.estimate)
            }

            getEstimateSegment()
        }
    }, [showModal, selectedEvent])

    const handleClose = () => {
        handleCloseModal()
        // Clear the state when the modal is closed
        setCampaignStats(null)
        setIncluded(null)
        setExcluded(null)
        setHtml(null)
        setIsLoading(true)
    }

    const handleCalculateRecipients = () => {
        console.log('Calculating recipients...');
        // Implement recipient calculation logic here
    };

    const handleSetDraft = () => {
        console.log('Setting campaign to draft...');
        // Implement draft setting logic here
    };

    const handleDeleteCampaign = () => {
        console.log('Deleting campaign...');
        // Implement delete campaign logic here
    };


    return (
        <Modal size="lg" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedEvent?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="h-100 ">
                <Row className="h-100 m-0">
                    <Col xs='7'>
                        <Row>
                            <Col md={6}>
                                <p><strong>Account:</strong> {selectedEvent?.accountName}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Status:</strong> {selectedEvent?.status}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <p><strong>Send Time:</strong> {selectedEvent?.start ?
                                    DateTime.fromJSDate(selectedEvent.start).toLocal().toFormat("ccc, dd LLL yyyy h:mma", {
                                        month: (date) => date.toFormat('LLL').padEnd(4, ' ').substring(0, 4)
                                    }) : ''}
                                </p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Tags:</strong> {selectedEvent?.tags.join(", ")}</p>
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
                        {campaignStats && (
                            <Row className="mt-3">
                                <Col md={6}>
                                    <p><strong>Deliveries:</strong> {campaignStats.statistics.delivered.toLocaleString()}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Opens:</strong> {campaignStats.statistics.opens.toLocaleString()}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Open Rate:</strong> {(campaignStats.statistics.open_rate * 100).toFixed(2)}%</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Clicks:</strong> {campaignStats.statistics.clicks.toLocaleString()}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Click Rate:</strong> {(campaignStats.statistics.click_rate * 100).toFixed(2)}%</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Revenue:</strong> ${campaignStats.statistics.conversion_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Revenue per Recipient:</strong> ${(campaignStats.statistics.conversion_value / campaignStats.statistics.recipients).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </Col>

                            </Row>
                        )}
                    </Col>
                    <Col xs='5' className="h-100 p-0 d-flex align-items-center justify-content-center">                        {isLoading ? <Spinner /> : html && (
                        <div style={{ height: '400px', overflow: 'auto' }}>
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
            <Modal.Footer className="d-flex justify-content-between">
                <div>
                    {selectedEvent?.status !== "Sent" && (
                        <>
                            <Button variant="outline-primary" onClick={handleSetDraft} style={{ marginRight: '10px' }}>
                                Set Draft
                            </Button>
                            <Button variant="outline-danger" onClick={handleDeleteCampaign}>
                                Delete Campaign
                            </Button>
                        </>
                    )}
                </div>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EventModal

