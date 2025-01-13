import { useEffect, useState } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Accordion, Card, Button, Form, Badge } from "react-bootstrap"
import axios from 'axios'
import { onlyAuthUserSSR } from "services/server-library"
import Campaign from "models/campaign"
import connect from "services/db";
import CustomTemplateCard from "components/khub/campaigns/CustomTemplateCard"
import PreviewModal from "components/khub/campaigns/CustomHTMLModal"
import { getConfigToken } from "services/library"
import { useRouter } from "next/router"
import {
    DataSheetGrid,
    textColumn,
    keyColumn,
} from 'react-datasheet-grid'

function SelectTemplate({ user, initialCampaignName, initialStatus, campaignId, campaign }) {
    const [subjectData, setSubjectData] = useState(campaign.sendToAccounts.map(account => { return { account2Set: account.name, klaviyoPublic: account.klaviyoPublic } }))
    const [showNextButton, setShowNextButton] = useState(false)

    const router = useRouter()
    const saveAndNext = async () => {
        const url = `/api/campaign/${campaignId}`
        await axios.patch(url, { subjectData: subjectData }, getConfigToken())
        router.push(`/campaigns/${campaignId}/3`);
    }

    const subjectColumns = [
        {
            ...keyColumn('account2Set', textColumn),
            title: 'Accounts',
            disabled: true

        },
        {
            ...keyColumn('subjectLine', textColumn),
            title: 'Subject Line'
        },
        {
            ...keyColumn('emailText', textColumn),
            title: 'Preview Text'
        }
    ];

    const handleSetSubjectData = async (data) => {
        setSubjectData(data)
    }

    useEffect(() => {
        const allObjectsHaveRequiredFields = subjectData.every(obj =>
            obj.hasOwnProperty('account2Set') && obj.account2Set !== '' && obj.account2Set !== null &&
            obj.hasOwnProperty('klaviyoPublic') && obj.klaviyoPublic !== '' && obj.klaviyoPublic !== null &&
            obj.hasOwnProperty('subjectLine') && obj.subjectLine !== '' && obj.subjectLine !== null &&
            obj.hasOwnProperty('emailText') && obj.emailText !== '' && obj.emailText !== null
        );

        setShowNextButton(allObjectsHaveRequiredFields);

        console.log(subjectData);
    }, [subjectData]);


    return (
        <KpushLayout pageTitle="Campaigns" activeNav="Dashboard" user={user}>
            <KpushAccountLayout
                accountPageTitle="Campaigns"
                accountSelectDisabled={false}
            >

                <Row className="align-items-center">
                    <Col md={9} className="d-flex align-items-center mb-3">
                        <h2 className="h3 my-0 me-3">{initialCampaignName}</h2>
                        <Badge>{initialStatus}</Badge>
                    </Col>
                    <Col>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            href={`/campaigns/${campaignId}/1`}
                            className="float-end"
                        >
                            <i className="fi-arrow-back me-2"></i>
                            Back to Account Select
                        </Button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center fixed-height-card">
                    <h5>Enter Subject Line and Text Email for each campaign</h5>
                    <div className="spreadsheet-container pb-4">
                        <DataSheetGrid
                            value={subjectData}
                            onChange={handleSetSubjectData}
                            columns={subjectColumns}
                            lockRows={true}
                        />
                    </div>
                </Row>
                {showNextButton && <Button onClick={saveAndNext}>Next</Button>}

            </KpushAccountLayout>
        </KpushLayout >
    )
}

export default SelectTemplate

//All private pages should use this
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

        // Map through each object in the array and remove the specified fields
        const cleanedData = user.accounts.map(account => ({ label: account.name, value: account.klaviyoPublic }));
        return {
            props: {
                user: user || null, // Ensure user is null if not authenticated
                campaign: campaignData,
                campaignId: campaignData._id,
                accountDetails: cleanedData,
                initialCampaignName: campaignData.name,
                initialTags: campaignData.tags,
                initialStatus: campaignData.status || "DRAFT"
            },
        }
    }
}