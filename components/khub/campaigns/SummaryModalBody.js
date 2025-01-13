import { useState, useEffect } from 'react'
import { Modal, Row, Table, Badge, Button, Spinner } from "react-bootstrap"
import { DateTime } from "luxon";
import { getStatusBadge, createGmailLikePreview } from "services/library"
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import { getConfigToken } from 'services/library';
import axios from 'axios';

function SummaryModalBody({ campaign, klaviyoTemplates }) {
    const [isAccountsExpanded, setIsAccountsExpanded] = useState(false);
    const [html, setHtml] = useState()
    const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
    const [loading, setLoading] = useState(false)


    const accounts = campaign?.sendToAccounts || [];


    const handlePrevAccount = () => {
        setCurrentAccountIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : accounts.length - 1
        );
    };

    const handleNextAccount = () => {
        setCurrentAccountIndex((prevIndex) =>
            prevIndex < accounts.length - 1 ? prevIndex + 1 : 0
        );
    };

    useEffect(() => {
        console.log("Updated html:", html);
    }, [html]);

    useEffect(() => {
        const generateEmailPreview = async () => {

            if (campaign && !klaviyoTemplates) {
                if (campaign?.templateType === "merge-template" && campaign?.mergeTemplate?.klaviyoPublic === "custom") {
                    setHtml(campaign?.mergeTemplate?.html)
                    //TODO: MERGE
                } else if (campaign?.templateType === "merge-template" && campaign?.mergeTemplate?.klaviyoPublic !== "custom") {
                    setLoading(true)
                    try {
                        const url = `/api/templates?link=${encodeURIComponent(campaign?.mergeTemplate?.templateLink)}&account=${campaign?.mergeTemplate?.klaviyoPublic}`
                        const { data } = await axios.get(url, getConfigToken());
                        setHtml(data.data.attributes.html || "Template not found");
                        //TODO: MERGE
                    } catch (error) {
                        console.log(error.message)
                        setHtml("Template not found");

                    } finally {
                        setLoading(false);
                    }
                } else if (campaign?.templateType === "custom-template") {
                    console.log("HERE")
                    const temp = campaign.customTemplates.find(
                        t => t.klaviyoPublic === accounts[currentAccountIndex]?.klaviyoPublic
                    );
                    if (temp.type === "html") {
                        setHtml(temp.html);
                    } else {
                        setHtml("downloadTemplate")
                    }
                }
            }
        }
        generateEmailPreview();
    }, [campaign, klaviyoTemplates, currentAccountIndex])

    useEffect(() => {
        const fetchTemplates = async () => {
            if (klaviyoTemplates && campaign?.klaviyoScheduledCampaigns) {
                const scheduledCampaign = campaign.klaviyoScheduledCampaigns.find(
                    scheduledCamp => scheduledCamp.klaviyoPublic === accounts[currentAccountIndex]?.klaviyoPublic
                );
                const templateId = scheduledCampaign?.campaignMessageId;
                setLoading(true);
                try {
                    const url = `/api/template?id=${templateId}&klaviyoPublic=${accounts[currentAccountIndex]?.klaviyoPublic}`
                    console.log(url)
                    const { data } = await axios.get(url, getConfigToken());
                    console.log(data.data)
                    setHtml(data?.data || "template not found");
                } catch (error) {
                    console.log(error.message)
                    setHtml("Template not found");

                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTemplates();
    }, [campaign, klaviyoTemplates, currentAccountIndex]);


    // useEffect(() => {
    //     const getCampaign = async () => {
    //         if (campaign) {
    //             const url = `/api/campaign/${campaign?._id}`
    //             const { data } = await axios.get(url, getConfigToken())
    //             setSelectedCampaign(data.data)
    //         }
    //     }
    //     getCampaign()

    // }, [campaign])

    // Helper function to convert array of objects to string
    const objectArrayToString = (arr, value) => {
        console.log(arr)
        if (arr) {
            return arr.map(item => item[value]).join(', ');
        }
        else return []
    };

    // Helper function to convert array of strings to string
    const arrayToString = (arr) => arr.join(', ');

    // Helper function to format date
    const formatDate = (dateString) => {
        const dt = DateTime.fromISO(dateString);
        const day = dt.day;
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) suffix = 'st';
        if (day % 10 === 2 && day !== 12) suffix = 'nd';
        if (day % 10 === 3 && day !== 13) suffix = 'rd';
        return dt.toFormat(`ccc dd'${suffix}' LLL yyyy h:mma`);
    };

    // Helper function to render badges for tags
    const renderTags = (tags) => {
        return tags.map((tag, index) => (
            <Badge bg="info" className="me-1 mb-1" key={index}>
                {tag}
            </Badge>
        ));
    };

    return (
        <Modal.Body className="d-flex flex-column" style={{ height: '80vh' }}>
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>{campaign?.name}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>
                            {campaign && getStatusBadge(campaign?.status)}
                        </td>
                    </tr>
                    <tr>
                        <th>Scheduled For</th>
                        <td>{campaign?.sendScheduleType === "immediate" ? "Now " : campaign?.scheduledDate ? formatDate(campaign?.scheduledDate) : 'Not scheduled'}</td>
                    </tr>
                    <tr>
                        <th>Tags</th>
                        <td>{campaign && renderTags(campaign?.tags)}</td>
                    </tr>
                    <tr>
                        <th>Template Type</th>
                        <td>{campaign?.templateType}</td>
                    </tr>
                    <tr
                        onClick={() => setIsAccountsExpanded(!isAccountsExpanded)}
                        style={{ cursor: 'pointer' }}
                    >
                        <th>Accounts</th>
                        <td>
                            {campaign?.sendToAccounts && campaign?.sendToAccounts.length > 0
                                ? `${campaign?.sendToAccounts.length} account${campaign?.sendToAccounts.length > 1 ? 's' : ''} selected`
                                : 'No accounts selected'}
                            {campaign?.sendToAccounts && campaign?.sendToAccounts.length > 0 && (
                                <span className="ms-2">
                                    <i className={`bi bi-chevron-${isAccountsExpanded ? 'up' : 'down'}`}></i>
                                </span>
                            )}
                        </td>
                    </tr>
                    {isAccountsExpanded && campaign?.sendToAccounts && campaign?.sendToAccounts.map((account, index) => (
                        <tr key={index}>
                            <th>{account.name}</th>
                            <td>
                                <p>Send to: {objectArrayToString(account.inclusionAudience, "label")}</p>
                                <p>Don't send to: {objectArrayToString(account.exclusionAudience, "label")}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Row className="flex-grow-1">

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Button variant="light" onClick={handlePrevAccount}>
                        <ArrowLeft />
                    </Button>
                    <p className="mb-0">
                        {accounts[currentAccountIndex]?.name || 'Custom'}
                    </p>
                    <Button variant="light" onClick={handleNextAccount}>
                        <ArrowRight />
                    </Button>
                </div>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {loading && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            <Spinner animation="border" />
                        </div>
                    )}
                    {html && (
                        <iframe
                            srcDoc={createGmailLikePreview(html)}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            title="Email Preview"
                        />
                    )}
                </div>

            </Row>
        </Modal.Body>
    )
}

export default SummaryModalBody