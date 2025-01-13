import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Card, Col } from 'react-bootstrap'
import { createGmailLikePreview } from 'services/library'

export default function HtmlPreview({ template, data, account, mergeFields }) {
    const [displayTemplate, setDisplayTemplate] = useState(template)

    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return; // Ensure iframe reference is not null

        if (iframe && iframe.contentWindow && Object.keys(mergeFields).length > 0) {
            console.log("THERE")

            // Save the current scroll position
            const scrollPosition = iframe.contentWindow.pageYOffset;

            // Update the iframe content directly if possible
            let newTemplate = template;
            Object.entries(mergeFields).forEach(([key, value]) => {
                const regex = new RegExp(`(?<!{){\\[${key}\\]}(?!})`, 'g');
                newTemplate = newTemplate.replace(regex, value);
            });
            iframe.contentDocument.body.innerHTML = newTemplate;
            console.log('Iframe content updated');
            // Restore the scroll position
            iframe.contentWindow.scrollTo(0, scrollPosition);
        }
    }, [mergeFields, template]); //


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