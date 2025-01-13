import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { createGmailLikePreview } from 'services/library'

function CustomHtmlPreview({ initialHtml, setHtml, setTemplate }) {
    const [localHtml, setLocalHtml] = useState(initialHtml || '');
    const [mergeTags, setMergeTags] = useState([]);


    useEffect(() => {
        setHtml(localHtml);
        extractMergeTags(localHtml);
        console.log(initialHtml)

    }, [localHtml, setHtml]);

    const extractMergeTags = (html) => {
        const regex = /{\[(.*?)\]}/g;
        const tags = [...new Set(html.match(regex) || [])];
        setMergeTags(tags.map(tag => tag.slice(2, -2)));  // Remove {[ and ]}
    };

    const handleHtmlChange = (e) => {
        setLocalHtml(e.target.value);
    };

    const containerStyle = {
        height: '700px',
        marginBottom: '20px',
        width: '100%'
    };

    const columnStyle = {
        height: '100%',
        padding: '10px',
        width: '50%'
    };

    const iframeContainerStyle = {
        overflow: 'auto',
        height: '100%',
        width: '100%',
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
            height: '8px',              // Height for horizontal scrollbar
            width: '8px'               // Width for vertical scrollbar
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'      // Scrollbar track color
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',        // Scrollbar handle color
            borderRadius: '4px'        // Rounded corners
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#555'         // Scrollbar handle hover color
        }
    };

    const iframeStyle = {
        width: '600px',     // Set a fixed width for email template
        height: '100%',
        border: '1px solid #ccc',
        borderRadius: '4px',
        display: 'block',   // Ensures proper sizing
        minWidth: '600px'   // Minimum width for email content
    };

    const textareaStyle = {
        height: 'calc(100% - 30px)',  // Subtract the height of the label
        resize: 'none',
        fontFamily: 'monospace'  // Use a monospace font for better code readability
    };


    const mergeTagsStyle = {
        padding: '10px',
        marginTop: '10px',
        borderTop: '1px solid #eee',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center'
    };

    const badgeStyle = {
        backgroundColor: '#e9ecef',
        color: '#495057',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace'
    };


    return (
        <>
            <Row style={containerStyle}>
                <Col xs={7} >
                    <iframe
                        srcDoc={localHtml}
                        style={iframeStyle}
                        title="HTML Preview"
                        sandbox="allow-same-origin allow-scripts"
                    />
                </Col>
                <Col xs={4}  >
                    <Form.Label>HTML </Form.Label>
                    <Form.Control
                        as="textarea"
                        value={localHtml}
                        onChange={handleHtmlChange}
                        style={textareaStyle}
                    />

                </Col>
            </Row>
            {mergeTags.length > 0 && (
                <div style={mergeTagsStyle}>
                    <span>Merge Fields:</span>
                    {mergeTags.map((tag, index) => (
                        <span key={index} style={badgeStyle}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            {localHtml && <Button onClick={() => setTemplate()}>Set Template</Button>}

            <Row>

            </Row>
        </>
    )
}

export default CustomHtmlPreview