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

function SelectTemplate({ user, initialCampaignName, initialStatus, campaignId, campaign }) {
    const [selectedItems, setSelectedItems] = useState([])
    const [showPreview, setShowPreview] = useState(false)
    const [emailHtml, setEmailHtml] = useState()
    const [showNextButton, setShowNextButton] = useState(false)
    const router = useRouter()

    useEffect(() => {
        console.log(selectedItems)
        console.log(selectedItems.length)
        console.log(selectedItems[0])
        const checkAccounts = selectedItems.map(selectedItem => {
            const matchingAccount = campaign.sendToAccounts.find(
                account => account.klaviyoPublic === selectedItem.klaviyoPublic
            );

            return {
                selectedItem,
                matchingAccount,
                isMatched: !!matchingAccount
            };
        });

        const allAccountsMatched = checkAccounts.every(item => item.isMatched);
        const allAccountsHaveTemplates = checkAccounts.length === campaign.sendToAccounts.length;

        if (allAccountsMatched && allAccountsHaveTemplates) {
            setShowNextButton(true)
        }
        else {
            setShowNextButton(false)
        }

    }, [selectedItems])

    const saveAndNext = async () => {
        console.log(selectedItems)
        const url = `/api/campaign/${campaignId}`
        await axios.patch(url, { customTemplates: selectedItems, templateType: "custom-template" }, getConfigToken())
        router.push(`/campaigns/${campaignId}/2/custom-template-subject`);
    }

    const handleSelect = (item) => {
        setSelectedItems(prevItems => {
            // Check if an item with the same klaviyoPublic already exists
            const existingIndex = prevItems.findIndex(
                prevItem => prevItem.klaviyoPublic === item.klaviyoPublic
            )

            if (existingIndex !== -1) {
                // If it exists, create a new array with the updated item
                return [
                    ...prevItems.slice(0, existingIndex),
                    { ...item },
                    ...prevItems.slice(existingIndex + 1)
                ]
            } else {
                // If it doesn't exist, add the new item to the array
                return [...prevItems, { ...item }]
            }
        })
    }

    const handleRemove = (klaviyoPublic) => {
        setSelectedItems(prevItems =>
            prevItems.filter(item => item.klaviyoPublic !== klaviyoPublic)
        )
    }

    const handlePreview = (emailHtml) => {
        setEmailHtml(emailHtml)
        setShowPreview(true)
    }




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
                    <h5>Select an email template or copy HTML for each Account</h5>
                    {campaign.sendToAccounts.map((account, index) => <Col key={index} md={4}><CustomTemplateCard account={account}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        onPreview={handlePreview}
                        setEmailHtml={setEmailHtml} /></Col>)}
                </Row>
                {showNextButton && <Button onClick={saveAndNext}>Next</Button>}
                <PreviewModal
                    show={showPreview}
                    onHide={() => setShowPreview(false)}
                    html={emailHtml}
                />
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