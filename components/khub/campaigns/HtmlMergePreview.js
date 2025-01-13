import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Card, Col } from 'react-bootstrap'
import { createGmailLikePreview } from 'services/library'

export default function HtmlPreview({ template, data, account, rowIndex }) {
    const iframeRef = useRef(null);

    // Modify the template to add data attributes for all types of merge fields
    const wrapMergeFields = (html) => {
        // Handle all URL and source attributes commonly used in emails
        let processedHtml = html
            // Links
            .replace(
                /href="{\[(.*?)\]}"/g,
                (match, fieldName) => `href="" data-merge-href="${fieldName}"`
            )
            // Images and media
            .replace(
                /src="{\[(.*?)\]}"/g,
                (match, fieldName) => `src="" data-merge-src="${fieldName}"`
            )
            .replace(
                /background="{\[(.*?)\]}"/g,
                (match, fieldName) => `background="" data-merge-background="${fieldName}"`
            )
            .replace(
                /poster="{\[(.*?)\]}"/g,
                (match, fieldName) => `poster="" data-merge-poster="${fieldName}"`
            )
            // Background images in style attributes
            .replace(
                /background-image:\s*url\({\[(.*?)\]}\)/g,
                (match, fieldName) => `background-image: url() data-merge-bg-image="${fieldName}"`
            )
            // Image attributes
            .replace(
                /alt="{\[(.*?)\]}"/g,
                (match, fieldName) => `alt="" data-merge-alt="${fieldName}"`
            )
            .replace(
                /title="{\[(.*?)\]}"/g,
                (match, fieldName) => `title="" data-merge-title="${fieldName}"`
            )
            // Video/audio sources
            .replace(
                /<source[^>]*src="{\[(.*?)\]}"/g,
                (match, fieldName) => match.replace(/src="{\[(.*?)\]}"/, `src="" data-merge-source="${fieldName}"`)
            );

        // Then handle text content merge fields
        processedHtml = processedHtml.replace(
            /{\[(.*?)\]}/g,
            (match, fieldName) => `<span data-merge-field="${fieldName}">${match}</span>`
        );

        return processedHtml;
    };

    useEffect(() => {
        if (template && data && rowIndex !== undefined && data[rowIndex]) {
            const iframe = iframeRef.current;
            if (!iframe?.contentDocument) return;

            const doc = iframe.contentDocument;

            // Update text merge fields
            const mergeFieldElements = doc.body.querySelectorAll('[data-merge-field]');
            mergeFieldElements.forEach(element => {
                const fieldName = element.getAttribute('data-merge-field');
                const value = data[rowIndex][fieldName];
                if (value !== undefined) {
                    element.textContent = value;
                }
            });

            // Update href attributes
            const linkElements = doc.body.querySelectorAll('[data-merge-href]');
            linkElements.forEach(element => {
                const fieldName = element.getAttribute('data-merge-href');
                const value = data[rowIndex][fieldName];
                if (value !== undefined) {
                    element.href = value;
                }
            });

            // Update src attributes
            const imgElements = doc.body.querySelectorAll('[data-merge-src]');
            imgElements.forEach(element => {
                const fieldName = element.getAttribute('data-merge-src');
                const value = data[rowIndex][fieldName];
                if (value !== undefined) {
                    element.src = value;
                }
            });

            // Update background attributes
            const bgElements = doc.body.querySelectorAll('[data-merge-background]');
            bgElements.forEach(element => {
                const fieldName = element.getAttribute('data-merge-background');
                const value = data[rowIndex][fieldName];
                if (value !== undefined) {
                    element.background = value;
                }
            });

            // Update background-image styles
            const bgImageElements = doc.body.querySelectorAll('[data-merge-bg-image]');
            bgImageElements.forEach(element => {
                const fieldName = element.getAttribute('data-merge-bg-image');
                const value = data[rowIndex][fieldName];
                if (value !== undefined) {
                    element.style.backgroundImage = `url(${value})`;
                }
            });

            // Update video/audio source elements
            const sourceElements = doc.body.querySelectorAll('[data-merge-source]');
            sourceElements.forEach(element => {
                const fieldName = element.getAttribute('data-merge-source');
                const value = data[rowIndex][fieldName];
                if (value !== undefined) {
                    element.src = value;
                }
            });

            // Update alt attributes
            const altElements = doc.body.querySelectorAll('[data-merge-alt]');
            altElements.forEach(element => {
                const fieldName = element.getAttribute('data-merge-alt');
                const value = data[rowIndex][fieldName];
                if (value !== undefined) {
                    element.alt = value;
                }
            });

            // Update title attributes
            const titleElements = doc.body.querySelectorAll('[data-merge-title]');
            titleElements.forEach(element => {
                const fieldName = element.getAttribute('data-merge-title');
                const value = data[rowIndex][fieldName];
                if (value !== undefined) {
                    element.title = value;
                }
            });
        }
    }, [template, data, rowIndex]);
    return (
        <div className="preview-container d-flex flex-column h-100">
            <h6>{account.label}</h6>
            <div className="flex-grow-1 position-relative">
                <iframe
                    ref={iframeRef}
                    srcDoc={createGmailLikePreview(wrapMergeFields(template))}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                    title="HTML Preview"
                />
            </div>
        </div>
    );
}