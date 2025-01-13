import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';


export default function EmailEditor() {
    const [mergeFields, setMergeFields] = useState({});
    const [updatedDoc, setUpdatedDoc] = useState();
    const iframeRef = useRef(null);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'updateMergeField') {
                console.log(event)
                setMergeFields(prev => ({
                    ...prev,
                    [event.data.key]: event.data.value
                }));
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        const handleIframeLoad = async () => {
            console.log("LOADING2")
            const iframe = iframeRef.current;
            if (!iframe) {
                console.log("No iframe found");
                return;
            }

            const doc = iframe.contentDocument || iframe.contentWindow.document;
            if (!doc.body) {
                console.log("No body found");
                return;
            }

            // Get the original content
            const originalContent = doc.body.innerHTML;
            console.log('Original content:', originalContent);

            // Wrap merge fields
            const updatedContent = wrapMergeFields(originalContent);
            console.log('Updated content:', updatedContent);

            // Update the document content
            doc.body.innerHTML = updatedContent;
            const mergeFields = doc.querySelectorAll('.merge-field');
            mergeFields.forEach(field => {
                console.log('Field data attribute:', field.dataset.field); // Debug log
            });


            // Inject the script
            await injectScript(doc);

            // Get the complete HTML content after all modifications
            const completeHtml = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Email Preview</title>
                        <style>
                            .merge-field {
                                background-color: #f0f0f0;
                                padding: 2px 4px;
                                border-radius: 3px;
                                cursor: pointer;
                            }
                        </style>
                    </head>
                    <body>
                        ${doc.body.innerHTML}
                    </body>
                </html>
            `;

            console.log('Complete HTML:', completeHtml);
            setUpdatedDoc(completeHtml);

            // Extract merge fields
            const fieldRegex = /{\[(.*?)\]}/g;
            let match;
            const fields = [];

            while ((match = fieldRegex.exec(updatedContent)) !== null) {
                fields[match[1]] = match[0]; // Store initial value
            }

            setMergeFields(fields);
        };

        // If iframe already exists, add the load event listener
        if (iframeRef.current) {
            handleIframeLoad()
        }


    }, []);

    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <iframe
                        ref={iframeRef}
                        srcDoc={updatedDoc}
                        src={!updatedDoc ? "/test2.html" : undefined}
                        style={{
                            width: '100%',
                            height: '100vh',
                            border: 'none'
                        }}
                        title="Email Preview"
                        onLoad={() => console.log("iframe loaded")}
                    />
                </Col>
                <Col md={6}>
                    <div>
                        <h3>Merge Fields and Values:</h3>
                        <ul>
                            {Object.entries(mergeFields).map(([field, value]) => (
                                <li key={field}>{field}: {value}</li>
                            ))}
                        </ul>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
function wrapMergeFields(htmlContent) {
    const mergeFieldRegex = /{\[(.*?)\]}/g;
    return htmlContent.replace(mergeFieldRegex, (match, fieldName) =>
        `<span class="merge-field" data-field="${fieldName}">{[${fieldName}]}</span>`
    );
}


async function injectScript(doc) {
    const script = doc.createElement('script');
    script.textContent = `
            document.querySelectorAll('.merge-field').forEach(field => {
                field.addEventListener('dblclick', function() {
                     const currentText = this.innerText;

                // Create a textarea instead of input
                const textarea = document.createElement('textarea');
                textarea.value = currentText;
                textarea.style.font = window.getComputedStyle(this).font;
                textarea.style.color = window.getComputedStyle(this).color;
                textarea.style.width = '100%';
                textarea.style.border = 'none';
                textarea.style.outline = 'none';
                textarea.style.resize = 'none';
                textarea.style.overflow = 'hidden';
                textarea.style.background = 'transparent';
                textarea.style.padding = '0';
                textarea.style.margin = '0';
                textarea.style.display = 'inline-block';

                // Function to adjust height automatically
                const adjustHeight = () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                };

                // Function to handle input completion
                const completeEdit = () => {
                    const newValue = textarea.value;
                    const fieldName = this.dataset.field;
                    this.innerHTML = newValue;
                    this.dataset.field = fieldName;

                    if (fieldName) {
                        console.log('Sending message for field:', fieldName, 'value:', newValue);
                        window.parent.postMessage({
                            type: 'updateMergeField',
                            key: fieldName,
                            value: newValue
                        }, '*');
                    }
                };

                    textarea.addEventListener('input', adjustHeight);
                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        textarea.blur();
                    }
                });

                this.innerHTML = '';
                this.appendChild(textarea);
                textarea.focus();
                adjustHeight(); // Initial height adjustment

                textarea.addEventListener('blur', completeEdit);
                });
            });
        `;
    doc.body.appendChild(script);
}