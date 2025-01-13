import { Modal, Button, Table, Spinner } from "react-bootstrap"
import SummaryModalBody from 'components/khub/campaigns/SummaryModalBody'


export default function FinalScheduleModal({ showModal, setModal, handleSendCampaign, campaign, sendScheduleType, loading }) {
    console.log(campaign)

    return (
        <Modal show={showModal} onHide={setModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Final Check</Modal.Title>
            </Modal.Header>
            <SummaryModalBody campaign={campaign} klaviyoTemplates={false} />
            <Modal.Footer className='pt-4'>
                <Button variant="secondary" onClick={setModal} disabled={loading}>
                    Close
                </Button>
                {sendScheduleType !== "immediate" && <Button onClick={() => handleSendCampaign("DRAFT")} variant="outline-primary" disabled={loading}>
                    {loading ? <Spinner /> : "Set as Draft"}
                </Button>}
                <Button onClick={() => handleSendCampaign("SCHEDULED")} variant="primary" disabled={loading}>
                    {loading ? <Spinner /> : "Schedule Campaigns"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
