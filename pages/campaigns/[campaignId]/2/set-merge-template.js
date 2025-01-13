import { useEffect, useState, useMemo } from "react"
import KpushLayout from "components/kpush/layout/KpushLayout"
import KpushAccountLayout from "components/kpush/layout/KpushAccountLayout"
import Select from "react-select"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { Button, Form, Badge, Modal, Tabs, Tab, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap"
import axios from 'axios'
import { onlyAuthUserSSR } from "services/server-library"
import Campaign from "models/campaign"
import connect from "services/db";
import HtmlMergePreview from "components/khub/campaigns/HtmlMergePreview"
import {
    DataSheetGrid,
    textColumn,
    keyColumn,
} from 'react-datasheet-grid'
import { useRouter } from "next/router"
import { getConfigToken } from "services/library"
import SendTestEmailModal from 'components/khub/campaigns/SendTestEmailModal'
import { Clipboard, Upload } from 'react-bootstrap-icons';
import { convertImageToBase64 } from "services/library"




function SelectTemplate({ user, initialCampaignName, mergeFields, initialStatus, accountDetails, template, urlFields, imageFields, textFields }) {
    const [account, setAccount] = useState(accountDetails[0])
    const [rowIndex, setRowIndex] = useState(0)
    //data will be an array of all accounts  and mergefields
    const [data, setData] = useState(accountDetails.map(account => { return { account2Set: account.label, klaviyoPublic: account.value } }))
    const [subjectData, setSubjectData] = useState(accountDetails.map(account => { return { account2Set: account.label, klaviyoPublic: account.value } }))
    const [isValid, setIsValid] = useState(false)
    const [testModal, setTestModal] = useState(false)
    const [accountMergeData, setAccountMergeData] = useState([])
    const router = useRouter();

    // Validation function
    const validateSubjectLines = (data) => {
        return data.every(item => item.subjectLine && item.subjectLine.trim() !== '')
    }

    // Add this function to handle copying all grids
    const copyAllGridsToClipboard = () => {
        // Get all headers and data for each grid type
        const subjectHeaders = ['Account', 'Subject Line', 'Preview Text'];
        const imageHeaders = ['Account', ...imageFields];
        const textHeaders = ['Account', ...textFields];
        const urlHeaders = ['Account', ...urlFields];

        // Format data for each grid
        const subjectRows = subjectData.map(row => [
            row.account2Set || '',
            row.subjectLine || '',
            row.previewText || ''
        ]);

        const imageRows = data.map(row => [
            row.account2Set || '',
            ...imageFields.map(field => row[field] || '')
        ]);

        const textRows = data.map(row => [
            row.account2Set || '',
            ...textFields.map(field => row[field] || '')
        ]);

        const urlRows = data.map(row => [
            row.account2Set || '',
            ...urlFields.map(field => row[field] || '')
        ]);

        // Build the final array with proper section headers
        const allRows = [
            // Subject Lines section
            [['Subject Lines and Preview Text', '', '']],
            [subjectHeaders],
            subjectRows,
            [['', '', '']], // Empty row for spacing

            // Images section
            imageFields.length > 0 ? [
                ['Template Images', ...Array(imageFields.length).fill('')],
                imageHeaders,
                ...imageRows,
                ['', ...Array(imageFields.length).fill('')]
            ] : [],

            // Text fields section
            textFields.length > 0 ? [
                ['Text Fields', ...Array(textFields.length).fill('')],
                textHeaders,
                ...textRows,
                ['', ...Array(textFields.length).fill('')]
            ] : [],

            // URL fields section
            urlFields.length > 0 ? [
                ['URL Fields', ...Array(urlFields.length).fill('')],
                urlHeaders,
                ...urlRows
            ] : []
        ];

        // Convert to TSV
        const tsvContent = allRows
            .flat()
            .map(row => Array.isArray(row) ? row.join('\t') : row)
            .join('\n');

        // Copy to clipboard
        navigator.clipboard.writeText(tsvContent);
    };
    // Effect to run validation whenever subjectData changes
    useEffect(() => {
        setIsValid(validateSubjectLines(subjectData))
    }, [subjectData])

    const columns = [
        {
            ...keyColumn('account2Set', textColumn),
            title: 'Accounts',
            disabled: true

        },
        ...mergeFields.map(field => {
            return {
                ...keyColumn(field, textColumn),
                title: field
            }
        })
    ];

    // Similarly for other column definitions
    const imageColumns = [
        {
            ...keyColumn('account2Set', textColumn),
            title: 'Accounts',
            disabled: true,
            headerComponent: () => <CustomHeader label="Accounts" />
        },
        ...imageFields.map(field => ({
            ...keyColumn(field, textColumn),
            title: field,
            headerComponent: () => <CustomHeader label={field} />
        }))
    ];


    const textColumns = [
        {
            ...keyColumn('account2Set', textColumn),
            title: 'Accounts',
            disabled: true

        },
        ...textFields.map(field => {
            return {
                ...keyColumn(field, textColumn),
                title: field
            }
        })
    ];
    const urlColumns = [
        {
            ...keyColumn('account2Set', textColumn),
            title: 'Accounts',
            disabled: true

        },
        ...urlFields.map(field => {
            return {
                ...keyColumn(field, textColumn),
                title: field
            }
        })
    ];

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
            ...keyColumn('previewText', textColumn),
            title: 'Preview Text'
        }
    ];
    const [showImageModal, setShowImageModal] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [activeTab, setActiveTab] = useState('upload');
    const [imageUrl, setImageUrl] = useState('');

    // Add this function to handle URL input
    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate URL
            const response = await axios.post(`/api/upload-klaviyo-image?klaviyoPublic=${account.value}`, { url: imageUrl }, getConfigToken());
            console.log(response.data)
            setUploadedImageUrl(response.data.url);
            setShowImageModal(false);
        } catch (error) {
            console.error('Error validating image URL:', error);
        }
    };

    // Add this function to handle image upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0]
        if (file) {
            try {
                const formData = new FormData();
                console.log(file)
                formData.append('file', file);
                formData.append('filename', file.name);  // Add the original filename

                // Replace with your image upload API endpoint
                const response = await axios.post(`/api/upload-klaviyo-image?klaviyoPublic=${account.value}`, formData, getConfigToken('multipart/form-data'));
                setUploadedImageUrl(response.data.url);
                setShowImageModal(false);

            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    // Add this function to handle copying URL to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Optional: Show a toast or some feedback
                console.log('Copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

    const handleAccountSelect = async (data) => {
        const index = accountDetails.findIndex(account => account.value === data.value);
        setAccount(data)
        setRowIndex(index)
    }

    const handleSetSubjectData = async (data) => {
        setSubjectData(data)
    }

    const handleSetData = async (data) => {
        console.log(data)
        setData(data)
    }

    //set the merge account values
    useEffect(() => {
        const values = data.find(acc => acc.klaviyoPublic === account.value)
        setAccountMergeData(values)
    }, [data])

    const handleScheduleCampaignClick = async () => {
        if (!isValid) {
            // Optionally show an error message to the user
            console.error("Please ensure all accounts have a subject line.")
            return
        }
        const { campaignId } = router.query;
        const url = `/api/campaign/${campaignId}`
        try {
            await axios.patch(url, { mergeTags: data, subjectData: subjectData }, getConfigToken())
        } catch (e) {
            console.log(e.status)
        }
        router.push(`/campaigns/${campaignId}/3`);
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
                                <Form.Label className="fw-bold">Select Preview Account</Form.Label>
                                <Select name="exclusion-groups"
                                    options={accountDetails}
                                    onChange={handleAccountSelect}
                                    value={account}
                                />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col xs='6'>
                            <HtmlMergePreview template={template} account={account} data={data} rowIndex={rowIndex} mergeFields={accountMergeData} />
                        </Col>
                        <Col xs='6'>
                            <div className="d-flex justify-content-between align-items-center py-2">
                                <p className="mb-0">
                                    <Badge bg="danger" className="ms-2">Required</Badge> Subject Lines and Preview Text
                                </p>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>
                                            Copy data to paste into Excel or Google Sheets
                                        </Tooltip>
                                    }
                                >
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={copyAllGridsToClipboard}
                                    >
                                        <Clipboard size={14} className="me-2" />
                                        Copy Data Grids
                                    </Button>
                                </OverlayTrigger>
                            </div>
                            <div className="spreadsheet-container">
                                <DataSheetGrid
                                    value={subjectData}
                                    onChange={handleSetSubjectData}
                                    columns={subjectColumns}
                                    lockRows={true}
                                />
                            </div>

                            {imageFields.length > 0 && (
                                <div className="mb-4 pt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <p className="mb-0">Upload image to Klaviyo here</p>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => setShowImageModal(true)}
                                        >
                                            <Upload size={16} className="me-2" />
                                            Upload Image
                                        </Button>
                                    </div>

                                    {uploadedImageUrl && (
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                type="text"
                                                value={uploadedImageUrl}
                                                readOnly
                                                onClick={(e) => e.target.select()}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => copyToClipboard(uploadedImageUrl)}
                                            >
                                                <Clipboard size={16} className="me-2" />
                                            </Button>
                                        </InputGroup>
                                    )}
                                    <p className="">Template Images- please upload to Klaviyo then copy the url here</p>
                                    <div className="spreadsheet-container">
                                        <DataSheetGrid
                                            value={data}
                                            onChange={handleSetData}
                                            columns={imageColumns}
                                            lockRows={true}
                                        />
                                    </div>
                                </div>
                            )}
                            {textFields.length > 0 && <>
                                <p>Text fields for template</p>
                                <div className="spreadsheet-container">
                                    <DataSheetGrid
                                        value={data}
                                        onChange={handleSetData}
                                        columns={textColumns}
                                        lockRows={true}
                                    />
                                </div>
                            </>}
                            {urlFields.length > 0 && <>
                                <p>URL fields for template</p>
                                <div className="spreadsheet-container">
                                    <DataSheetGrid
                                        value={data}
                                        onChange={handleSetData}
                                        columns={urlColumns}
                                        lockRows={true}
                                    />
                                </div>
                            </>}
                            <div className='text-center pt-3'>
                                <Button disabled={!isValid} variant='outline-primary' className='me-2'
                                    onClick={() => setTestModal(!testModal)}>Send Test Email</Button>
                                <Button disabled={!isValid}
                                    onClick={handleScheduleCampaignClick}>Schedule Campaign</Button>
                                <Button onClick={async () => { console.log(await getNew(template)) }}>Console Log HTML</Button>
                            </div>
                            {!isValid && (
                                <div className="text-danger mt-2 text-center">
                                    Please ensure all accounts have a subject line.
                                </div>
                            )}
                        </Col>
                        <SendTestEmailModal testModal={testModal} setTestModal={setTestModal} accountDetails={accountDetails} template={template} data={data} />
                    </Row>


                    <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Image</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="mb-3"
                            >
                                <Tab eventKey="upload" title="Upload File">
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Select an image to upload</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </Form.Group>
                                </Tab>

                                <Tab eventKey="url" title="Upload from URL">
                                    <Form onSubmit={handleUrlSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Enter image URL</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    required
                                                />
                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                >
                                                    Add Image
                                                </Button>
                                            </InputGroup>
                                            <Form.Text className="text-muted">
                                                Enter a valid image URL (jpg, png, gif, etc.)
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                </Tab>
                            </Tabs>
                            {uploadedImageUrl && (
                                <div className="mt-4 border-top pt-3">
                                    <p className="mb-2">Preview:</p>
                                    <div className="text-center">
                                        <img
                                            src={uploadedImageUrl}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowImageModal(false);
                                    setImageUrl('');
                                    setActiveTab('upload');
                                }}
                            >
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
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
        const campaign = await Campaign.findOne({ _id: campaignId })
        if (!campaign) {
            return {
                notFound: true,
            };
        }
        // Convert the campaign to a JSON object
        const campaignData = JSON.parse(JSON.stringify(campaign));
        const accountsCleaned = campaignData.sendToAccounts.map(account => ({ value: account.klaviyoPublic, label: account.name }))
        let mergeFields = []
        let imageFields = []
        let textFields = []
        let urlFields = []

        let template = ""
        if (campaign.templateType === 'merge-template' && campaign.mergeTemplate.klaviyoPublic === "custom") {
            template = campaignData.mergeTemplate.html
            mergeFields = await getMergeFields(campaignData.mergeTemplate.html)

        } else {
            const account = user.accounts.find(acc => acc.klaviyoPublic === campaignData.mergeTemplate.klaviyoPublic);
            // Extract the access token from the found account
            const { access_token, pk } = account
            // Map through each object in the array and remove the specified fields
            const { data } = await axios.get(campaignData.mergeTemplate.templateLink, { headers: { revision: "2024-06-15", Authorization: process.env.NEXT_PUBLIC_ENV === "DEV" ? `Klaviyo-API-Key ${pk}` : `Bearer ${access_token}` } })
            template = data.data.attributes.html
            mergeFields = await getMergeFields(data.data.attributes.html)
            const foundFields = await getNew(data.data.attributes.html)
            imageFields = foundFields.imageFields
            textFields = foundFields.textFields
            urlFields = foundFields.urlFields
        }
        console.log(imageFields)
        return {
            props: {
                user: user || null, // Ensure user is null if not authenticated
                campaignId: campaignData._id,
                template: template,
                mergeFields: mergeFields || [],
                imageFields: imageFields || [],
                textFields: textFields || [],
                urlFields: urlFields || [],
                accountDetails: accountsCleaned,
                initialCampaignName: campaignData.name,
                initialTags: campaignData.tags,
                initialStatus: campaignData.status || "DRAFT"
            },
        }
    }
}

const getMergeFields = async (template) => {
    const regex = /{\[(.*?)\]}/g;
    const fields = template.match(regex);
    const fieldNames = fields ? fields.map(field => field.slice(2, -2)) : [];
    const uniqueFieldNames = Array.from(new Set(fieldNames)); // Remove duplicates
    return uniqueFieldNames
}
const getNew = async (template) => {
    // Image source merge fields
    const imgRegex = /src="{\[(.*?)\]}"/g;
    const imgMatches = template.matchAll(imgRegex);
    const imgFields = Array.from(imgMatches, match => match[1]);

    // URL/href merge fields
    const urlRegex = /href="{\[(.*?)\]}"/g;
    const urlMatches = template.matchAll(urlRegex);
    const urlFields = Array.from(urlMatches, match => match[1]);

    // Text merge fields (not in src or href attributes)
    const textRegex = /{\[(.*?)\]}/g;
    const allMatches = template.matchAll(textRegex);
    const allFields = Array.from(allMatches, match => match[1]);

    // Filter text fields to exclude those already found in img and url fields
    const textFields = allFields.filter(field =>
        !imgFields.includes(field) &&
        !urlFields.includes(field)
    );

    // Remove duplicates
    const uniqueTextFields = Array.from(new Set(textFields));
    const uniqueUrlFields = Array.from(new Set(urlFields));
    const uniqueImgFields = Array.from(new Set(imgFields));

    return {
        textFields: uniqueTextFields,
        urlFields: uniqueUrlFields,
        imageFields: uniqueImgFields
    };
};

// First, create a custom header component
const CustomHeader = ({ label }) => (
    <div
        style={{
            padding: '6px 8px',
            userSelect: 'text',  // Make text selectable
            cursor: 'text',      // Show text cursor
            fontWeight: 'bold',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6'
        }}
    >
        {label}
    </div>
);

