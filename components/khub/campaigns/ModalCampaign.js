import { Modal, Button, Row, Col } from "react-bootstrap"
import SummaryModalBody from 'components/khub/campaigns/SummaryModalBody'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getConfigToken } from "services/library"
import { useRouter } from "next/router"

export default function ModalCampaign({ showModal, setShowModal, campaign }) {
    const [selectedCampaign, setSelectedCampaign] = useState()
    const router = useRouter()


    useEffect(() => {
        const getCampaign = async () => {
            if (campaign) {
                try {
                    const url = `/api/campaign/${campaign?._id}`
                    const { data } = await axios.get(url, getConfigToken())
                    setSelectedCampaign(data.data)
                } catch (e) {
                    console.log(e.status)
                    if (e.response && e.response.status === 403) {
                        console.log("Unauthorized access, redirecting to login")
                        router.push('/login')
                    }
                }

            }
        }
        getCampaign()

    }, [campaign])


    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{campaign?.name}</Modal.Title>
            </Modal.Header>
            <SummaryModalBody campaign={selectedCampaign} klaviyoTemplates={true} />
            <Modal.Footer className='pt-4'>
                <Col>
                    <Button variant="secondary" className="float-start" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <div className="float-end">
                        <Button variant="outline-danger" className="me-2">
                            Delete
                        </Button>
                        <Button variant="outline-primary">
                            Schedule
                        </Button>
                    </div>
                </Col>
            </Modal.Footer>
        </Modal>
    )
}
