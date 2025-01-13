import { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import { DataSheetGrid } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';

const EditAllTemplates = ({
    show,
    onHide,
    emailTemplates,
    mergeFieldStates,
    onSave
}) => {
    // Helper to determine field type
    const getFieldType = (fieldName) => {
        if (fieldName.toLowerCase().includes('link')) return 'link';
        if (fieldName.toLowerCase().includes('img')) return 'image';
        return 'text';
    };

    // Create data rows for each type
    const createDataRows = (type) => {
        return emailTemplates.map(template => {
            const templateData = mergeFieldStates[template.value] || {};

            // Create base row with template info
            const row = {
                templateId: template.value,
                templateName: template.label,
            };

            // Add all fields of the current type
            Object.entries(templateData).forEach(([fieldName, value]) => {
                if (getFieldType(fieldName) === type) {
                    row[fieldName] = value;
                }
            });

            return row;
        });
    };

    // Create columns for each type
    const createColumns = (type) => {
        // Get all unique field names of this type across all templates
        const fieldNames = new Set();
        Object.values(mergeFieldStates).forEach(templateData => {
            Object.keys(templateData).forEach(fieldName => {
                if (getFieldType(fieldName) === type) {
                    fieldNames.add(fieldName);
                }
            });
        });

        return [
            {
                title: 'Template',
                width: 200,
                readOnly: true,
                render: (props) => (
                    <div className="template-cell">
                        {props.row.templateName}
                    </div>
                )
            },
            ...Array.from(fieldNames).map(fieldName => ({
                title: fieldName,
                width: 250,
                render: (props) => (
                    <input
                        type="text"
                        value={props.row[fieldName] || ''}
                        onChange={(e) => {
                            const newRow = {
                                ...props.row,
                                [fieldName]: e.target.value
                            };
                            props.onChange(newRow);
                        }}
                        className="form-control"
                    />
                )
            }))
        ];
    };

    // Handle data changes
    const handleDataChange = (newData, type) => {
        const updates = { ...mergeFieldStates };

        newData.forEach(row => {
            const templateId = row.templateId;
            const currentTemplateData = updates[templateId] || {};

            // Update only the fields that changed
            Object.entries(row).forEach(([key, value]) => {
                if (key !== 'templateId' && key !== 'templateName') {
                    currentTemplateData[key] = value;
                }
            });

            updates[templateId] = currentTemplateData;
        });

        onSave(updates);
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title>Edit All Fields</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="text" className="mb-3">
                    <Tab eventKey="text" title="Text">
                        <DataSheetGrid
                            value={createDataRows('text')}
                            onChange={(newData) => handleDataChange(newData, 'text')}
                            columns={createColumns('text')}
                            rowHeight={40}
                            headerHeight={40}
                            addRowsComponent={false}
                            deleteRowsComponent={false}
                            lockRows={true}
                            style={{ height: '60vh' }}
                        />
                    </Tab>
                    <Tab eventKey="link" title="Links">
                        <DataSheetGrid
                            value={createDataRows('link')}
                            onChange={(newData) => handleDataChange(newData, 'link')}
                            columns={createColumns('link')}
                            rowHeight={40}
                            headerHeight={40}
                            addRowsComponent={false}
                            deleteRowsComponent={false}
                            lockRows={true}
                            style={{ height: '60vh' }}
                        />
                    </Tab>
                    <Tab eventKey="image" title="Images">
                        <DataSheetGrid
                            value={createDataRows('image')}
                            onChange={(newData) => handleDataChange(newData, 'image')}
                            columns={createColumns('image')}
                            rowHeight={40}
                            headerHeight={40}
                            addRowsComponent={false}
                            deleteRowsComponent={false}
                            lockRows={true}
                            style={{ height: '60vh' }}
                        />
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onHide}>
                    Save Changes
                </Button>
            </Modal.Footer>

            <style jsx>{`
                .template-cell {
                    padding: 4px 8px;
                    font-weight: 500;
                }

                :global(.modal-90w) {
                    width: 90%;
                    max-width: 1200px;
                }

                :global(.form-control) {
                    width: 100%;
                    padding: 4px 8px;
                }
            `}</style>
        </Modal>
    );
};

export default EditAllTemplates;