import { useState } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Accordion, Card, Button, Form, Badge } from "react-bootstrap"
import { onlyAuthUserSSR } from "services/server-library"
import Campaign from "models/campaign"
import connect from "services/db";
import Link from 'next/link';

function SelectTemplate({ user, initialCampaignName, initialStatus, campaignId }) {

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
                    <h3>How do you want to set up your templates?</h3>
                    <Col md={4}>
                        <Link href="/1" passHref>
                            <Card as="a" className="mb-3">
                                <Card.Body>
                                    <Card.Title>Select Merge Template</Card.Title>
                                    <Card.Text>
                                        Choose a template from one of your Klaviyo accounts. You can customise for each account using merge tags.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    <Col md={4}>
                        <Link href="/2" passHref>
                            <Card as="a" className="mb-3">
                                <Card.Body>
                                    <Card.Title>Custom HTML</Card.Title>
                                    <Card.Text>
                                        Create your own template custom HTML for each account campaign.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    <Col md={4}>
                        <Link href="/3" passHref>
                            <Card as="a" className="mb-3">
                                <Card.Body>
                                    <Card.Title>Select a Template </Card.Title>
                                    <Card.Text>
                                        Select a template from each Klaviyo account to send for each account.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>
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