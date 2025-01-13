import { useEffect, useState } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import Select from "react-select"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Modal, Button, Form, Badge } from "react-bootstrap"
import { onlyAuthUserSSR } from "services/server-library"
import Campaign from "models/campaign"
import connect from "services/db";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'
import { getConfigToken } from "services/library"
import FinalScheduleModal from 'components/khub/campaigns/FinalScheduleModal'
import { useRouter } from 'next/router';
import { DateTime } from 'luxon'; // Make sure to import Luxon


function ScheduleCampaign({ user, initialCampaignName, initialStatus, accountDetails, campaignData }) {
    const [scheduledDate, setScheduledDate] = useState(() => {
        if (campaignData.scheduledDate) {
            // Parse the ISO string to a Luxon DateTime object, then convert to JS Date
            return DateTime.fromISO(campaignData.scheduledDate).toJSDate();
        }
        return null; // or you could set a default date here
    }); const [sendScheduleType, setSendScheduleType] = useState({ value: "static", label: "Scheduled" })
    const [showModal, setShowModal] = useState(false);
    const [isSendTimeOptimized, setIsSendTimeOptimized] = useState(false)
    const [isSmartSending, setIsSmartSending] = useState(false);
    const [summaryData, setSummaryData] = useState(campaignData)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const isButtonDisabled = !(sendScheduleType.value === "immediate" || sendScheduleType.value === "static" && scheduledDate)


    const setModal = () => setShowModal(!showModal);

    const handleCreateCampaign = async () => {
        const isoDate = (scheduledDate && sendScheduleType.value === "static") ? scheduledDate.toISOString() : null;
        const { campaignId } = router.query;
        const url = `/api/campaign/${campaignId}`
        const { data } = await axios.patch(url, { sendScheduleType: sendScheduleType.value, date: scheduledDate, scheduledDate: isoDate, isSendTimeOptimized, isSmartSending }, getConfigToken())
        setSummaryData(data.data)
        setModal()
    }

    const handleSendCampaign = async (scheduleType) => {
        try {
            // DRAFT or SCHEDULED
            setLoading(true)
            const { campaignId } = router.query;
            const url = `/api/schedule-campaign?scheduleType=${scheduleType}`
            const { data } = await axios.post(url, { campaignId }, getConfigToken())
            console.log(data)
            router.push('/campaigns');
        } catch (error) {
            console.error('Error sending campaign:', error);
            console.log(error.status)
            // Handle error (e.g., show an error message to the user)
        } finally {
            setLoading(false)
        }

    }

    return (
        <KpushLayout pageTitle="Campaigns" activeNav="Dashboard" user={user}>
            <KpushAccountLayout
                accountPageTitle="Campaigns"
                accountSelectDisabled={false}
            >
                <div className="campaign-name mb-4">
                    <Row className="align-items-center">
                        <Col md={9} className="d-flex align-items-center mb-3">
                            <h2 className="h3 my-0 me-3">{initialCampaignName}</h2>
                            <Badge>{initialStatus}</Badge>
                        </Col>
                        <Col>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                href="/campaigns"
                                className="float-end"
                            >
                                <i className="fi-arrow-back me-2"></i>
                                Back
                            </Button>
                        </Col>
                    </Row>
                    <section
                        id="send-schedule"
                        className="card card-body border-0 shadow-sm p-4 mb-5"
                    >
                        <h4 className="mb-4">
                            <i className="fi-clock text-primary fs-5 me-2"></i>Send Schedule
                        </h4>
                        <Row>
                            <Col md={6}>
                                <Form.Label>Send type</Form.Label>
                                <Select
                                    value={sendScheduleType}
                                    onChange={(option) => {
                                        setSendScheduleType(option)
                                    }}
                                    options={[
                                        { value: "static", label: "Scheduled" },
                                        { value: "immediate", label: "Send now" }
                                    ]}
                                    className="basic-single"
                                    classNamePrefix="select"
                                />

                            </Col>

                            <Col xs='6'>
                                <div className='pt-4'></div>
                                <Form.Control
                                    as={DatePicker}
                                    selected={scheduledDate}
                                    minDate={new Date()}
                                    timeIntervals={15}
                                    onChange={(date) => setScheduledDate(date)}
                                    placeholderText="Choose date"
                                    disabled={sendScheduleType.value === "immediate"}
                                    className="rounded pe-5"
                                    dateFormat="MMM d, yyyy h:mm aa"
                                    showTimeSelect />
                                <Form.Check
                                    type='switch'
                                    id='switch-1'
                                    label='Send Time Optimization'
                                    value={isSendTimeOptimized}
                                    onChange={() => setIsSendTimeOptimized(!isSendTimeOptimized)}
                                />
                                <Form.Check
                                    type='switch'
                                    id='switch-1'
                                    label='Smart Sending'
                                    value={isSmartSending}
                                    onChange={() => setIsSmartSending(!isSmartSending)}

                                />

                            </Col>
                        </Row>
                        <Row className='pt-3'>
                            <Button color='outline-primary' disabled={isButtonDisabled} onClick={handleCreateCampaign}>Schedule Campaign to {campaignData.sendToAccounts.length} accounts</Button>
                        </Row>
                    </section>
                    <FinalScheduleModal showModal={showModal} setModal={setModal} handleSendCampaign={handleSendCampaign} campaign={summaryData} sendScheduleType={sendScheduleType.value} loading={loading} />
                </div>
            </KpushAccountLayout>
        </KpushLayout >
    )
}

export default ScheduleCampaign

export const getServerSideProps = async (context) => {
    const { req, params } = context
    const { campaignId } = params;

    const user = await onlyAuthUserSSR(req, true)
    if (!user) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    } else {
        await connect()
        const campaign = await Campaign.findOne({ _id: campaignId })
        if (!campaign) {
            return {
                notFound: true,
            };
        }
        const accounts = user.accounts
        // Convert the campaign to a JSON object
        const campaignData = JSON.parse(JSON.stringify(campaign));
        console.log(campaignData)

        // Map through each object in the array and remove the specified fields
        const cleanedData = user.accounts.map(account => ({ label: account.name, value: account.klaviyoPublic }));
        return {
            props: {
                user: user || null, // Ensure user is null if not authenticated
                campaignId: campaignData._id,
                accountDetails: cleanedData,
                initialCampaignName: campaignData.name,
                initialTags: campaignData.tags,
                initialStatus: campaignData.status || "DRAFT",
                campaignData: campaignData
            },
        }
    }
}