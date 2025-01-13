'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Form, Button, Modal, Dropdown, InputGroup, Badge, Tabs, Tab } from 'react-bootstrap'
import { Smartphone, Monitor, Image, Link, Type, ChevronLeft, ChevronRight } from 'lucide-react'
import Select from 'react-select';
import { DataSheetGrid, keyColumn, textColumn } from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/style.css'
import { sampleEmailTemplate } from '../data/test'

// Add constants at the top of your file
const TEMPLATE_MERGE_FIELDS_KEY = 'templateMergeFields';
const isClient = typeof window !== 'undefined';




// URL formatter helper
const formatUrl = (url) => {
    if (!url) return url;

    // Don't format merge field placeholders
    if (url.startsWith('{[') && url.endsWith(']}')) return url;

    // Remove any existing http:// or https:// and www.
    let cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');

    // Skip formatting if it's empty after cleaning
    if (!cleanUrl) return url;

    // Add https://www. prefix
    return `https://www.${cleanUrl}`;
};


// Clear function
const clearSavedMergeFields = () => {
    if (!isClient) return;

    try {
        localStorage.removeItem(TEMPLATE_MERGE_FIELDS_KEY);
        setMergeFieldStates({});
        setMergeFields({});

        // Reinitialize current template
        if (selectedTemplate) {
            handleTemplateSelect(selectedTemplate);
        }
    } catch (error) {
        console.error('Error clearing saved merge fields:', error);
    }
};

const emailTemplateOptions = [
    { value: 'template1', label: 'Welcome Email', template: sampleEmailTemplate },
    { value: 'template2', label: 'Newsletter', template: sampleEmailTemplate },
    { value: 'template3', label: 'Promotional', template: sampleEmailTemplate },
];

// Function to parse merge fields from HTML
const parseMergeFields = (html) => {
    const mergeFieldRegex = /\{\[(.*?)\]\}|<img[^>]*?src="\{\[(.*?)\]\}"[^>]*?>|href="\{\[(.*?)\]\}"/g;
    const matches = [...html.matchAll(mergeFieldRegex)];

    const fields = matches.map(match => {
        // Get the field name from any of the capture groups
        const fieldName = match[3] || match[2] || match[1];
        let type = 'string';

        // Determine field type
        if (match[0].startsWith('<img') || fieldName.toLowerCase().includes('img_')) {
            type = 'image';
        } else if (match[0].includes('href=') || fieldName.toLowerCase().includes('link')) {
            type = 'link';
        }

        return { name: fieldName, type };
    });

    return Array.from(new Map(fields.map(field => [field.name, field])).values());
};

export default function AdvancedEmailEditor() {

    const klaviyoAPI = "pk_6347370ff7b2368ac5b76af9928ca0ff00"
    const [emailContent, setEmailContent] = useState(sampleEmailTemplate)
    const iframeRef = useRef(null)
    const [mergeFields, setMergeFields] = useState({});
    const [parsedFields, setParsedFields] = useState([]); // Initialize as empty array instead of object
    const [showImageModal, setShowImageModal] = useState(false)
    const [previewMode, setPreviewMode] = useState('desktop')
    const [selectedTemplate, setSelectedTemplate] = useState(emailTemplateOptions[0]);
    const [showMultiEditModal, setShowMultiEditModal] = useState(false);
    const [activeImageField, setActiveImageField] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [activeTab, setActiveTab] = useState('upload');
    // Add isClient check
    const isClient = typeof window !== 'undefined';
    const [mergeFieldStates, setMergeFieldStates] = useState(() => {
        if (!isClient) return {};

        try {
            const savedState = localStorage.getItem(TEMPLATE_MERGE_FIELDS_KEY);
            return savedState ? JSON.parse(savedState) : {};
        } catch (error) {
            console.error('Error loading saved merge fields:', error);
            return {};
        }
    });



    // Update useEffect to safely access localStorage
    useEffect(() => {
        if (!isClient) return;

        try {
            localStorage.setItem(TEMPLATE_MERGE_FIELDS_KEY, JSON.stringify(mergeFieldStates));
        } catch (error) {
            console.error('Error saving merge fields:', error);
        }
    }, [mergeFieldStates]);

    // Handle template selection and maintain state for each template
    const handleTemplateSelect = async (template) => {
        setSelectedTemplate(template);

        // Get all merge fields from the template
        const fields = parseMergeFields(template.template);

        // Get existing state or create new state with all fields initialized
        const savedTemplateState = mergeFieldStates[template.value] || {};
        const initializedState = {};

        // Initialize all fields, keeping existing values if they exist
        fields.forEach(field => {
            initializedState[field.name] = savedTemplateState[field.name] || `{[${field.name}]}`;
        });

        // Update current merge fields
        setMergeFields(initializedState);

        // Update template states if needed
        if (!mergeFieldStates[template.value]) {
            setMergeFieldStates(prev => ({
                ...prev,
                [template.value]: initializedState
            }));
        }
    };

    // Update merge fields for the current template
    const handleMergeFieldUpdate = (fieldName, value, fieldType) => {
        // Format value if it's a link field
        const formattedValue = fieldType === 'link' ? formatUrl(value) : value;

        // Update both current and stored states
        setMergeFields(prev => ({
            ...prev,
            [fieldName]: formattedValue
        }));

        setMergeFieldStates(prev => ({
            ...prev,
            [selectedTemplate.value]: {
                ...prev[selectedTemplate.value],
                [fieldName]: formattedValue
            }
        }));
    };

    // Get current merge fields for the selected template
    const getCurrentMergeFields = () => {
        return mergeFieldStates[selectedTemplate?.value] || {};
    };



    // Save to localStorage whenever mergeFieldStates changes
    useEffect(() => {
        if (!isClient) return;

        try {
            localStorage.setItem(TEMPLATE_MERGE_FIELDS_KEY, JSON.stringify(mergeFieldStates));
        } catch (error) {
            console.error('Error saving merge fields:', error);
        }
    }, [mergeFieldStates]);

    // Add this function to clean up the HTML for download
    const getCleanEmailHtml = () => {
        let emailHtml = sampleEmailTemplate;

        // Remove TinyMCE comments
        emailHtml = emailHtml.replace(/<!-- x-tinymce\/html -->/g, '');

        Object.entries(mergeFields).forEach(([key, value]) => {
            const field = parsedFields.find(f => f.name === key);

            if (field?.type === 'image') {
                // Handle both image merge field formats
                const imgRegex = new RegExp(`\\{\\[${key}\\]\\}|<img[^>]*?src="\\{\\[${key}\\]\\}"[^>]*?>`, 'g');

                // Always wrap the value in an img tag if it's not already an img tag
                const imgTag = value ?
                    (value.startsWith('<img') ? value : `<img src="${value}" alt="${key}" style="max-width: 100%; height: auto;"/>`) :
                    `{[${key}]}`;

                emailHtml = emailHtml.replace(imgRegex, imgTag);
            } else {
                const regex = new RegExp(`\\{\\[${key}\\]\\}`, 'g');
                emailHtml = emailHtml.replace(regex, value || `{[${key}]}`);
            }
        });

        // Clean up any remaining editing attributes
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = emailHtml;

        tempDiv.querySelectorAll('.merge-field').forEach(el => {
            const content = el.innerHTML;
            el.replaceWith(content);
        });

        return tempDiv.innerHTML;
    };

    // Add download function
    const handleDownloadHtml = () => {
        const cleanHtml = getCleanEmailHtml();
        const blob = new Blob([cleanHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'email-template.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    // Initialize merge fields state
    useEffect(() => {
        if (sampleEmailTemplate) {
            const fields = parseMergeFields(sampleEmailTemplate);
            setParsedFields(fields);

            // Initialize mergeFields state with empty values for each field
            const initialMergeFields = {};
            fields.forEach(field => {
                initialMergeFields[field.name] = '';
            });
            setMergeFields(initialMergeFields);
        }
    }, [sampleEmailTemplate]);

    // Update the container styles
    const previewContainerStyle = {
        position: 'relative',
        overflow: 'auto',
        minHeight: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        height: '100%'
    };

    const mobilePreviewStyle = {
        width: '375px',
        height: '667px',
        border: '16px solid #000',
        borderRadius: '36px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        flexShrink: 0
    };

    const iframeStyle = {
        width: '100%',
        height: '100%',
        border: 'none',
        margin: 0,
        padding: 0
    };

    useEffect(() => {
        updateIframeContent()
    }, [emailContent, mergeFields, previewMode])


    useEffect(() => {
        if (sampleEmailTemplate) {
            const fields = parseMergeFields(sampleEmailTemplate);
            // You might want to store these categorized fields in state
            // or use them directly in your render method
        }
    }, [sampleEmailTemplate]);

    const updateIframeContent = () => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            const activeElement = doc.activeElement;
            const selection = doc.getSelection();

            // Only update if no field is being edited
            if (!activeElement?.classList?.contains('merge-field')) {
                doc.open();
                doc.write(generatePreviewHtml());
                doc.close();
                addEditableListeners(doc);
            }
        }
    };

    // Update useEffect to prevent updates while editing
    useEffect(() => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc?.activeElement?.classList?.contains('merge-field')) {
            updateIframeContent();
        }
    }, [emailContent, mergeFields, previewMode]);

    // Update generatePreviewHtml to always create editable fields
    const generatePreviewHtml = () => {
        if (!selectedTemplate?.template) return '';

        let previewHtml = selectedTemplate.template;
        previewHtml = previewHtml.replace(/<!-- x-tinymce\/html -->/g, '');

        // Get all fields from the template
        const fields = parseMergeFields(selectedTemplate.template);

        // Process each field
        fields.forEach(field => {
            const value = mergeFields[field.name];

            if (field.type === 'image') {
                const imgRegex = new RegExp(`\\{\\[${field.name}\\]\\}|<img[^>]*?src="\\{\\[${field.name}\\]\\}"[^>]*?>`, 'g');
                const displayValue = value && value !== `{[${field.name}]}` ?
                    `<img src="${value}" alt="${field.name}" style="max-width: 100%; height: auto;"/>` :
                    `{[${field.name}]}`;

                previewHtml = previewHtml.replace(imgRegex, displayValue);
            } else if (field.type === 'link') {
                const linkRegex = new RegExp(`href="\\{\\[${field.name}\\]\\}[^"]*"`, 'g');
                const replacement = value && value !== `{[${field.name}]}` ?
                    `href="${value}"` :
                    `href="{[${field.name}]}"`;
                previewHtml = previewHtml.replace(linkRegex, replacement);
            } else {
                const regex = new RegExp(`\\{\\[${field.name}\\]\\}`, 'g');
                previewHtml = previewHtml.replace(
                    regex,
                    `<span class="merge-field" contenteditable="true" data-field="${field.name}">${value || `{[${field.name}]}`}</span>`
                );
            }
        });

        return previewHtml;
    };

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

    // Add clipboard copy handler
    const handleCopyImageUrl = () => {
        navigator.clipboard.writeText(uploadedImageUrl);
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

                setMergeFields(prev => ({
                    ...prev,
                    [activeImageField]: uploadedImageUrl
                }));
                setShowImageModal(false);
                setUploadedImageUrl('');

            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };



    const addEditableListeners = (doc) => {
        // Prevent link clicks
        doc.addEventListener('click', (e) => {
            const linkElement = e.target.closest('a');
            if (linkElement) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        const mergeFieldElements = doc.querySelectorAll('.merge-field');

        mergeFieldElements.forEach(el => {
            el.setAttribute('contenteditable', 'true');

            // Remove existing listeners
            const newEl = el.cloneNode(true);
            newEl.setAttribute('contenteditable', 'true');
            el.parentNode.replaceChild(newEl, el);

            // Add hover effect
            newEl.addEventListener('mouseenter', () => {
                newEl.style.backgroundColor = 'rgba(64, 158, 255, 0.1)';
                newEl.style.outline = '1px solid #409EFF';
            });

            newEl.addEventListener('mouseleave', () => {
                if (!newEl.matches(':focus')) {
                    newEl.style.backgroundColor = 'transparent';
                    newEl.style.outline = 'none';
                }
            });

            // Update input event handler to force React state update
            newEl.addEventListener('input', (e) => {
                e.stopPropagation();
                const fieldName = e.target.getAttribute('data-field');
                const content = e.target.innerHTML;

                // Force immediate state update
                const newMergeFields = {
                    ...mergeFields,
                    [fieldName]: content
                };

                setMergeFields(newMergeFields);

                // Update template state
                setMergeFieldStates(prev => ({
                    ...prev,
                    [selectedTemplate.value]: {
                        ...prev[selectedTemplate.value],
                        [fieldName]: content
                    }
                }));

                // Force update the input field
                const inputField = document.querySelector(`input[name="${fieldName}"]`);
                if (inputField) {
                    inputField.value = content;
                }
            });

            // Add blur handler to ensure state is updated
            newEl.addEventListener('blur', (e) => {
                const fieldName = e.target.getAttribute('data-field');
                const content = e.target.innerHTML;

                // Force immediate state update
                const newMergeFields = {
                    ...mergeFields,
                    [fieldName]: content
                };

                setMergeFields(newMergeFields);

                // Update template state
                setMergeFieldStates(prev => ({
                    ...prev,
                    [selectedTemplate.value]: {
                        ...prev[selectedTemplate.value],
                        [fieldName]: content
                    }
                }));
            });
        });
    };


    const handleImageSelect = (fieldName) => {
        setActiveImageField(fieldName);
        setShowImageModal(true);
    };



    const handlePrevTemplate = () => {
        const currentIndex = emailTemplateOptions.findIndex(t => t.value === selectedTemplate.value);
        if (currentIndex > 0) {
            const prevTemplate = emailTemplateOptions[currentIndex - 1];
            handleTemplateSelect(prevTemplate);
        }
    };

    const handleNextTemplate = () => {
        const currentIndex = emailTemplateOptions.findIndex(t => t.value === selectedTemplate.value);
        if (currentIndex < emailTemplateOptions.length - 1) {
            const nextTemplate = emailTemplateOptions[currentIndex + 1];
            handleTemplateSelect(nextTemplate);
        }
    };

    // Create columns configuration
    const columns = [
        {
            ...keyColumn('templateName', textColumn),
            title: 'Template Name',
            width: 150,
        },
        ...Object.keys(mergeFields).map(key => ({
            ...keyColumn(key, textColumn),
            title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            width: 200,
        }))
    ];

    // Create initial data
    const initialData = emailTemplateOptions.map(template => ({
        templateName: template.label,
        ...mergeFields
    }));

    const [data, setData] = useState(initialData);

    const handleMergeFieldChange = (fieldName, value) => {
        // If it's a link field, ensure proper URL formatting
        if (parsedFields.find(f => f.name === fieldName && f.type === 'link')) {
            // Add https:// if no protocol is specified
            if (value && !value.match(/^https?:\/\//)) {
                value = 'https://' + value;
            }
        }

        setMergeFields(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleLinkSelect = (fieldName) => {
        // Get the actual link value from mergeFields
        const link = mergeFields[fieldName];

        // Check if the link is valid
        if (link && typeof link === 'string') {
            // Add https:// if the link doesn't start with http:// or https://
            const url = link.startsWith('http') ? link : `https://${link}`;

            // Open in new tab
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    // Add useEffect to monitor state changes
    useEffect(() => {
        if (selectedTemplate) {
            updateIframeContent();
        }
    }, [selectedTemplate, mergeFields]);

    // Update the helper function to return colored badges
    const getFieldBadge = (fieldType) => {
        switch (fieldType) {
            case 'image':
                return <span className="badge bg-info bg-opacity-10 text-info small">Image</span>;
            case 'link':
                return <span className="badge bg-success bg-opacity-10 text-success small">Link</span>;
            default:
                return <span className="badge bg-primary bg-opacity-10 text-primary small">Text</span>;
        }
    };

    // Add useEffect for initial load
    useEffect(() => {
        if (!isClient) return;

        if (emailTemplateOptions.length > 0) {
            const initialTemplate = emailTemplateOptions[0];
            handleTemplateSelect(initialTemplate);
        }
    }, []); // Run only on mount

    // Optional: Add clear button to your UI
    return (
        <Container fluid className="vh-100 py-4 email-editor-container">
            <Row className="h-100">
                <Col md={4} className="d-flex flex-column">
                    <div className="mb-3 text-center">
                        <h2>Edit Templates</h2>
                        <div className="d-flex gap-2 justify-content-center">
                            <Button
                                variant="outline-primary"
                                onClick={() => setShowMultiEditModal(true)}
                            >
                                Subject Lines
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => setShowMultiEditModal(true)}
                            >
                                Edit Multiple
                            </Button>
                        </div>
                    </div>

                    <Form>
                        <Form.Group className="my-3">
                            {selectedTemplate && (
                                <div className="flex-grow-1 overflow-auto mt-3">
                                    {parseMergeFields(selectedTemplate.template).map(field => (
                                        <Form.Group key={field.name} className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <Form.Label className="mb-0">{field.name}</Form.Label>
                                                {getFieldBadge(field.type)}
                                            </div>
                                            <InputGroup>
                                                <Form.Control
                                                    name={field.name}
                                                    value={mergeFields[field.name] || ''}
                                                    onChange={(e) => handleMergeFieldUpdate(field.name, e.target.value, field.type)}
                                                    placeholder={`Enter ${field.name}`}
                                                />
                                                {field.type === 'image' && (
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => handleImageSelect(field.name)}
                                                    >
                                                        <Image size={18} />
                                                    </Button>
                                                )}
                                                {field.type === 'link' && (
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => handleLinkSelect(field.name)}
                                                    >
                                                        <Link size={18} />
                                                    </Button>
                                                )}
                                            </InputGroup>
                                        </Form.Group>
                                    ))}
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={8} className="h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center" style={{ flex: 1 }}>
                            <Button
                                variant="link"
                                className="p-0 me-3"
                                onClick={handlePrevTemplate}
                                disabled={emailTemplateOptions.indexOf(selectedTemplate) === 0}
                            >
                                <ChevronLeft size={24} />
                            </Button>
                            <Select
                                options={emailTemplateOptions}
                                value={selectedTemplate}
                                onChange={handleTemplateSelect}
                                placeholder="Select template..."
                                styles={{
                                    container: (base) => ({
                                        ...base,
                                        width: '250px'
                                    })
                                }}
                            />
                            <Button
                                variant="link"
                                className="p-0 ms-3"
                                onClick={handleNextTemplate}
                                disabled={emailTemplateOptions.indexOf(selectedTemplate) === emailTemplateOptions.length - 1}
                            >
                                <ChevronRight size={24} />
                            </Button>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary">Back</Button>
                            <Button variant="outline-primary" onClick={handleDownloadHtml}>
                                Download HTML
                            </Button>
                            <Button variant="primary">Next Page</Button>
                        </div>
                    </div>
                    <div className="flex-grow-1 border rounded" style={previewContainerStyle}>
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            zIndex: 1000,
                            display: 'flex',
                            gap: '8px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '5px',
                            borderRadius: '4px'
                        }}>
                            <Button
                                variant={previewMode === 'desktop' ? 'primary' : 'outline-primary'}
                                onClick={() => setPreviewMode('desktop')}
                                title="Desktop Preview"
                                size="sm"
                            >
                                <Monitor size={20} />
                            </Button>
                            <Button
                                variant={previewMode === 'mobile' ? 'primary' : 'outline-primary'}
                                onClick={() => setPreviewMode('mobile')}
                                title="Mobile Preview"
                                size="sm"
                            >
                                <Smartphone size={20} />
                            </Button>
                        </div>
                        {previewMode === 'mobile' ? (
                            <div style={mobilePreviewStyle}>
                                <iframe
                                    ref={iframeRef}
                                    title="Email Preview"
                                    style={iframeStyle}
                                    scrolling="yes"
                                />
                            </div>
                        ) : (
                            <iframe
                                ref={iframeRef}
                                title="Email Preview"
                                style={{ ...iframeStyle, width: '600px' }}
                            />
                        )}
                    </div>
                </Col>
            </Row>


            <Modal
                show={showMultiEditModal}
                onHide={() => setShowMultiEditModal(false)}
                size="xl"
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Multiple Templates</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: '70vh' }}>
                        <DataSheetGrid
                            value={data}
                            onChange={setData}
                            columns={columns}
                            rowHeight={40}
                            headerHeight={40}
                            style={{ height: '100%' }}
                            addRowsComponent={false}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMultiEditModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            // Add logic to save changes
                            setShowMultiEditModal(false);
                        }}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>




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
                                            value={""}
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

            <style jsx global>{`
                .custom-sheet {
                    width: 100%;
                }
                .custom-sheet td {
                    min-width: 150px;
                    height: 40px;
                }
                .custom-sheet td:first-child {
                    background-color: #f8f9fa;
                    font-weight: 500;
                }
                .custom-sheet tr:first-child td {
                    background-color: #f8f9fa;
                    font-weight: 600;
                }
                .modal-90w {
                    width: 90%;
                    max-width: 1200px;
                }
                .container-fluid {
                    padding-left: 0;
                    padding-right: 0;
                }
                
                .row {
                    margin-left: 0;
                    margin-right: 0;
                }
                
                .col, [class*="col-"] {
                    padding-left: 0;
                    padding-right: 0;
                }
                .badge {
                    font-weight: 500;
                    padding: 0.35em 0.65em;
                }
            `}</style>
        </Container>
    )
}