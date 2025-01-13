import { useEffect, useState } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import Select from "react-select"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Accordion, Card, Button, Form, Badge } from "react-bootstrap"
import axios from 'axios'
import { onlyAuthUserSSR } from "services/server-library"
import Campaign from "models/campaign"
import connect from "services/db";
import SendToAccountCard from "components/khub/campaigns/SendToAccountCard"
import { getConfigToken } from "services/library"
import { useRouter } from 'next/router';


const KpushCampaigns = ({
    user,
    campaignId,
    accountDetails,
    initialCampaignName,
    initialStatus,
    campaign }) => {
    const router = useRouter();
    const accounts = accountDetails.map(account => { return { label: account.name, value: account.klaviyoPublic, tags: account.tags } })

    function getUniqueTags(accounts) {
        // Flatten the tags from all accounts
        const allTags = accounts.flatMap(account => account.tags);

        // Create a set to remove duplicates
        const uniqueTags = new Set(allTags);

        // Map the unique tags to the format { value: tag, label: tag }
        const options = Array.from(uniqueTags).map(tag => ({
            value: tag,
            label: tag
        }));

        return options;
    }
    const accountOptions = [{ label: "All Accounts", value: "all" }, ...accounts]

    const accountTagOptions = getUniqueTags(accountDetails)

    const [inclusionAccountTags, setInclusionAccountTags] = useState(campaign.inclusionAccountTags || [])
    const [exclusionAccountTags, setExclusionAccountTags] = useState(campaign.exclusionAccountTags || [])
    const [inclusionAccounts, setInclusionAccounts] = useState(campaign.inclusionAccounts || [])
    const [exclusionAccounts, setExclusionAccounts] = useState(campaign.exclusionAccounts || [])
    const [isValid, setIsValid] = useState(false)
    const [sendToAccounts, setSendToAccounts] = useState([])

    const handleAccountChange = (selected) => {
        // Check if 'all' is one of the selected options
        if (selected.length === 0) {
            setInclusionAccounts([])
        }
        else if (selected[0].value === 'all' && selected.length > 1) {
            setInclusionAccounts(selected.slice(1))
        } else {
            const hasAll = selected.some(option => option.value === 'all');
            if (hasAll) {
                // Set selected options to only 'All Accounts'
                setInclusionAccounts([{ label: "All Accounts", value: "all" }]);
            } else {
                // Otherwise, update normally
                setInclusionAccounts(selected);
            }
        }
    };
    //works out accounts and tags inclusions and exclusions
    const handleCheckAccounts = () => {

        let includedAccounts = [];

        // Check if 'all' is included in inclusionAccounts
        const includeAll = inclusionAccounts.some(acc => acc.value === 'all');

        if (includeAll) {
            includedAccounts = [...accounts]; // Include all accounts initially
        } else {
            // Include accounts by value or tags
            includedAccounts = accounts.filter(account =>
                inclusionAccounts.some(inc => inc.value === account.value) ||
                account?.tags?.some(tag => inclusionAccountTags.some(incTag => incTag.value === tag))
            );
        }
        // Convert exclusion tags and account values to sets for quick lookup
        const exclusionValuesSet = new Set(exclusionAccounts.map(acc => acc.value));
        const exclusionTagsSet = new Set(exclusionAccountTags.map(tag => tag.value));
        // Filter out excluded accounts
        includedAccounts = includedAccounts.filter(account =>
            !exclusionValuesSet.has(account.value) &&
            !account.tags?.some(tag => exclusionTagsSet.has(tag))
        );
        // Create a set of values from includedAccounts for quick lookup
        const includedValuesSet = new Set(includedAccounts.map(acc => acc.value));

        // Filter accountDetails to include only accounts where klaviyoPublic matches any included account value
        const matchedAccounts = accountDetails.filter(account =>
            includedValuesSet.has(account.klaviyoPublic)
        );
        setSendToAccounts(matchedAccounts); // Set the matched accounts
    }

    useEffect(() => {
        handleCheckAccounts()
    }, [inclusionAccountTags, exclusionAccountTags, inclusionAccounts, exclusionAccounts])

    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validation function
    const validateAccounts = () => {
        if (sendToAccounts.length === 0) {
            return false;
        }

        return sendToAccounts.every(account =>
            account.default_sender_name &&
            account.default_sender_name.trim() !== '' &&
            account.default_sender_email &&
            account.default_sender_email.trim() !== '' &&
            emailRegex.test(account.default_sender_email.trim()) &&
            account.inclusionAudience &&
            account.inclusionAudience.length > 0
        );
    };

    // Effect to run validation whenever sendToAccounts changes
    useEffect(() => {
        setIsValid(validateAccounts());
    }, [sendToAccounts]);


    function updateInclusionAudience(klaviyoPublicId, audience, type = "inclusion") {
        setSendToAccounts(sendToAccounts => {
            return sendToAccounts.map(account => {
                if (account.klaviyoPublic === klaviyoPublicId) {
                    // Found the matching account, update its inclusionAudience
                    const key = type === "inclusion" ? "inclusionAudience" : "exclusionAudience";
                    return { ...account, [key]: audience };
                }
                // Return all other accounts unchanged
                return account;
            });
        });
    }

    function updateNameOrEmail(klaviyoPublicId, field, value) {
        setSendToAccounts(sendToAccounts => {
            return sendToAccounts.map(account => {
                if (account.klaviyoPublic === klaviyoPublicId) {
                    // Found the matching account, update its value
                    return { ...account, [field]: value };
                }
                return account;
            });
        });
    }

    const handleSaveAndNext = async () => {
        const url = `/api/campaign/${campaignId}`
        const { data } = await axios.patch(url, { sendToAccounts, inclusionAccountTags, exclusionAccountTags, inclusionAccounts, exclusionAccounts }, getConfigToken())
        router.push(`/campaigns/${campaignId}/2`);

    }

    return (
        <KpushLayout pageTitle="Campaigns" activeNav="Dashboard" user={user}>
            <KpushAccountLayout
                accountPageTitle="Campaigns"
                accountSelectDisabled={false}
            >
                <div className="campaign-name">
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
                                Back to Campaigns
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Include Account Groups</Form.Label>
                                <Select name="exclusion-groups"
                                    options={accountTagOptions}
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    onChange={setInclusionAccountTags}
                                    value={inclusionAccountTags}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Exclude Account Groups</Form.Label>
                                <Select name="exclusion-groups"
                                    options={accountTagOptions}
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    onChange={setExclusionAccountTags}
                                    value={exclusionAccountTags}
                                />

                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Include Accounts</Form.Label>
                                <Select name="inclusion-accounts"
                                    options={accountOptions}
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    onChange={handleAccountChange}
                                    value={inclusionAccounts}
                                />

                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Exclude Accounts</Form.Label>
                                <Select name="exclusion-accounts"
                                    options={accounts}
                                    isMulti={true}
                                    closeMenuOnSelect={false}
                                    onChange={setExclusionAccounts}
                                    value={exclusionAccounts} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="align-items-center">
                        <i>{sendToAccounts?.length} accounts selected</i>
                        <Col>
                            {sendToAccounts.length > 0 && <Button
                                variant="outline-secondary"
                                size="sm"
                                className="float-end"
                                onClick={handleSaveAndNext}
                                disabled={!isValid}
                            >
                                <i className="fi-arrow-forward me-2"></i>
                                Save and Next
                            </Button>}
                        </Col>
                    </Row>
                </div>

                <section>
                    <Row>
                        {sendToAccounts && sendToAccounts.map(account => (
                            <SendToAccountCard key={account.name} account={account} setAudience={updateInclusionAudience} updateNameOrEmail={updateNameOrEmail} />
                        ))}
                    </Row>
                    <Row className="align-items-center mb-3">
                        <i>{sendToAccounts?.length} accounts selected</i>
                        <Col>
                            {sendToAccounts.length > 0 && (
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="float-end"
                                    onClick={handleSaveAndNext}
                                    disabled={!isValid}
                                >
                                    <i className="fi-arrow-forward me-2"></i>
                                    Save and Next
                                </Button>
                            )}
                        </Col>
                    </Row>

                    {!isValid && sendToAccounts.length > 0 && (
                        <Row className="mt-2">
                            <Col>
                                <div className="text-danger">
                                    Please ensure all accounts have a sender name, validsender email, and inclusion audience set.
                                </div>
                            </Col>
                        </Row>
                    )}

                </section>
            </KpushAccountLayout>
        </KpushLayout>
    )
}

export default KpushCampaigns

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
        // Convert the campaign to a JSON object
        const campaignData = JSON.parse(JSON.stringify(campaign));

        // Map through each object in the array and remove the specified fields
        const cleanedData = user.accounts.map(({ access_token, refresh_token, expires_in, scope, pk, metrics, conversionMetric, conversion, ...rest }) => rest);
        return {
            props: {
                user: user || null, // Ensure user is null if not authenticated
                campaignId: campaignData._id,
                campaign: campaignData,
                accountDetails: cleanedData,
                initialCampaignName: campaignData.name,
                initialTags: campaignData.tags,
                initialStatus: campaignData.status || "DRAFT"
            },
        }
    }
}
