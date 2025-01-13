import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Card, Col } from 'react-bootstrap'
import { createGmailLikePreview } from 'services/library'

export default function HtmlPreview({ template, data, account, mergeFields }) {
    const [displayTemplate, setDisplayTemplate] = useState(template)
    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const handleIframeLoad = () => {
            console.log("TEST")
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.body.innerHTML = createEmailPreview(template, mergeFields);
            injectScript(doc);
        };

        iframe.addEventListener('load', handleIframeLoad);
        iframe.srcdoc = createEmailPreview(template, mergeFields); // Trigger reload

        return () => {
            iframe.removeEventListener('load', handleIframeLoad);
        };
    }, [template, mergeFields]);


    return (
        <>
            <h6>{account.label}</h6>
            <iframe
                ref={iframeRef}
                srcDoc={createGmailLikePreview(displayTemplate)}
                style={{
                    width: '100%', // Ensure the iframe takes the full width of the card
                    height: '600px', // Set a fixed height for the iframe
                    border: 'none' // Remove default iframe border
                }}
                title="HTML Preview"
            />
        </>

    )
}

function createEmailPreview(template, mergeFields) {
    let previewTemplate = template;
    Object.keys(mergeFields).forEach(key => {
        const regex = new RegExp(`{\\[${key}\\]}`, 'g');
        previewTemplate = previewTemplate.replace(regex, `<span class="editable-merge-field" data-field="${key}">${mergeFields[key]}</span>`);
    });
    return previewTemplate;
}

function injectScript(doc) {
    const script = doc.createElement('script');
    script.textContent = `
        document.querySelectorAll('.editable-merge-field').forEach(field => {
            field.addEventListener('click', function() {
                if (this.querySelector('input')) return; // Prevent multiple inputs
                const input = document.createElement('input');
                input.type = 'text';
                input.value = this.innerText;
                this.innerHTML = '';
                this.appendChild(input);
                input.focus();

                input.addEventListener('blur', () => {
                    this.innerText = input.value;
                });
            });
        });
    `;
    doc.body.appendChild(script);
}