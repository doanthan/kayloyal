import React from 'react'
import { useState, useEffect } from 'react';
import { Card, Col, Badge } from 'react-bootstrap'
import HtmlModal from 'components/khub/campaigns/HtmlModal'


export default function HtmlPreview({ template, link, name, setTemplate }) {
    const [mergeFields, setMergeFields] = useState([]);
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (template) {
            console.log(link)
            const keyExtractionRegex = /{[\[]([^[\]]+)[\]]}/g;
            let match;
            let fieldNames = [];

            while ((match = keyExtractionRegex.exec(template)) !== null) {
                fieldNames.push(match[1]); // match[1] is the first capture group, i.e., the key
            }

            const uniqueFieldNames = Array.from(new Set(fieldNames)); // Remove duplicates
            setMergeFields(uniqueFieldNames);
        }
    }, [template]);

    const selectTemplate = () => {
        console.log(showModal)
        setShowModal(!showModal)
    }

    return (
        <Col xs={4} className='pt-3' key={link} hover> {/* Adjust the column sizes as needed */}
            <Card onClick={selectTemplate} hover >
                <Card.Header>
                    <h6>{name}</h6>
                </Card.Header>
                <Card.Body  >
                    <div style={{ position: 'relative' }}>
                        <iframe
                            srcDoc={template}
                            style={{
                                width: '100%', // Ensure the iframe takes the full width of the card
                                height: '375px', // Set a fixed height for the iframe
                                border: 'none' // Remove default iframe border
                            }}
                            title="HTML Preview"
                            sandbox="allow-same-origin allow-scripts"
                        />
                        <div onClick={selectTemplate} style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            cursor: 'pointer',
                            zIndex: 2,
                        }}></div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <div>
                        {mergeFields.length === 0 ? (
                            <Badge bg="secondary">No merge fields</Badge>
                        ) : (
                            mergeFields.map(field => (
                                <Badge key={field} bg="secondary" className="me-1">{field}</Badge>
                            ))
                        )}
                    </div>                </Card.Footer>
            </Card>
            <HtmlModal showModal={showModal} selectTemplate={selectTemplate} template={template} name={name} mergeFields={mergeFields} setTemplate={setTemplate} link={link} />
        </Col>

    )
}