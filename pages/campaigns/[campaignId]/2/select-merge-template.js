import { useEffect, useState } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import Select from "react-select"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Button, Form, Badge } from "react-bootstrap"
import axios from 'axios'
import { onlyAuthUserSSR } from "services/server-library"
import Campaign from "models/campaign"
import connect from "services/db";
import { getConfigToken } from "services/library"
import { useRouter } from 'next/router';
import HtmlPreviewCard from 'components/khub/campaigns/HtmlPreviewCard'
import { Spinner } from "react-bootstrap"
import CustomHtmlPreview from 'components/khub/campaigns/CustomHtmlPreview'

function SelectTemplate({ user, initialCampaignName, initialStatus, accountDetails, campaign }) {
    const [templates, setTemplates] = useState()
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    const [account, setAccount] = useState()
    const [loading, setLoading] = useState(false)
    const [isHtml, setIsHtml] = useState(false)
    const [html, setHtml] = useState()
    const router = useRouter();

    const handleAccountSelect = async (option) => {
        if (option.value !== "custom") {
            setIsHtml(false)
            setHtml(null)
            setLoading(true)
            try {
                const { data } = await axios.get(`/api/templates?account=${option.value}`, getConfigToken())
                setTemplates(data.data)
                setNext(data.next)
                setPrev(data.prev)
                setAccount(option.value)
                setLoading(false)
            } catch (error) {
                console.log(error.message)
            }
        } else {
            setIsHtml(true)
            setAccount(option.value)
        }
    }

    const handleClick = async (isNext) => {
        setLoading(true)
        const link = isNext ? next : prev
        const encodedUrl = encodeURIComponent(link);
        const { data } = await axios.get(`/api/templates?account=${account}&link=${encodedUrl}`, getConfigToken())
        setTemplates(data.data)
        setNext(data.next)
        setPrev(data.prev)
        setLoading(false)
    }
    const setTemplateAndNext = async (templateLink) => {
        const { campaignId } = router.query;

        const url = `/api/campaign/${campaignId}`
        const { data } = await axios.patch(url, {
            mergeTemplate: {
                klaviyoPublic: account, ...(templateLink && { templateLink }), ...(html && { html })
            }, templateType: "merge-template"
        }, getConfigToken())
        router.push(`/campaigns/${campaignId}/2/set-merge-template`);
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
                    <Row>
                        <Col xs='4'>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Select Template Account</Form.Label>
                                <Select name="exclusion-groups"
                                    options={accountDetails}
                                    onChange={handleAccountSelect}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {isHtml &&
                        <CustomHtmlPreview
                            name="custom html"
                            setHtml={setHtml}
                            initialHtml={html}
                            setTemplate={setTemplateAndNext}
                        />
                    }

                    {loading ? <Spinner /> :
                        <Row>
                            {!isHtml && account?.value !== "custom" && templates && <div>Select Template</div>}
                            {!isHtml && account?.value !== "custom" && templates && templates.map(template => {
                                return <HtmlPreviewCard key={template.links.self} link={template.links.self}
                                    name={template.attributes.name}
                                    template={template.attributes.html}
                                    setTemplate={setTemplateAndNext}
                                />
                            })
                            }
                        </Row>}
                    {account !== "custom" && <Row className='pt-3'>
                        <Col className="text-center">
                            {prev && account !== "custom" && <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleClick(false)}
                            >
                                <i className="fi-arrow-back me-2"></i>
                                Back
                            </Button>}
                            {next && account !== "custom" && <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleClick(true)}
                            >
                                <i className="fi-arrow-forward me-2"></i>
                                Next
                            </Button>}
                        </Col>
                    </Row>}
                </div>
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
        const campaignData = await Campaign.findOne({ _id: campaignId })
        if (!campaignData) {
            return {
                notFound: true,
            };
        }
        // Convert the campaign to a JSON object
        const campaign = JSON.parse(JSON.stringify(campaignData));

        // Map through each object in the array and remove the specified fields
        const cleanedData = [
            { label: "Upload my own HTML", value: "custom" },
            ...user.accounts.map(account => ({ label: account.name, value: account.klaviyoPublic }))
        ]; return {
            props: {
                user: user || null, // Ensure user is null if not authenticated
                campaignId: campaign._id,
                campaign: campaign,
                accountDetails: cleanedData,
                initialCampaignName: campaignData.name,
                initialTags: campaignData.tags,
                initialStatus: campaignData.status || "DRAFT"
            },
        }
    }
}