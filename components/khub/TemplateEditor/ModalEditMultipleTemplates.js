import { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Tab, InputGroup, Form } from 'react-bootstrap';
import { DataSheetGrid } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';

const EditMultipleTemplates = ({
    show,
    onHide,
    mergeFields,
    selectedTemplate,
    onSave,
    parseMergeFields
}) => {
    // State for managing rows
    const [rows, setRows] = useState([]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    // Initialize rows when modal opens or template changes
    useEffect(() => {
        if (selectedTemplate && show) {
            const fields = parseMergeFields(selectedTemplate.template);
            const initialRows = fields.map(field => ({
                name: field.name,
                value: mergeFields[field.name] || '',
                type: field.type || 'text'
            }));
            setRows(initialRows);
        }
    }, [selectedTemplate, mergeFields, show]);

    // Handle row changes for each type
    const handleRowsChange = (newRows) => {
        setRows(newRows);
    };

    // Handle image upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            setUploadedImageUrl(data.url);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Handle copying image URL
    const handleCopyImageUrl = () => {
        navigator.clipboard.writeText(uploadedImageUrl);
    };

    // Handle save
    const handleSave = () => {
        const newMergeFields = {};
        rows.forEach(row => {
            newMergeFields[row.name] = row.value;
        });
        onSave(newMergeFields);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" dialogClassName="modal-90w">
            <Modal.Header closeButton>
                <Modal.Title>Edit Multiple Templates</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="text" className="mb-3">
                    <Tab eventKey="text" title="Text">
                        <div className="mb-4">
                            <h6 className="mb-3">Text Fields</h6>
                            <DataSheetGrid
                                value={rows.filter(row => row.type !== 'link' && row.type !== 'image')}
                                onChange={(newRows) => {
                                    const otherRows = rows.filter(row => row.type === 'link' || row.type === 'image');
                                    handleRowsChange([...newRows, ...otherRows]);
                                }}
                                columns={[
                                    {
                                        title: 'Merge Field',
                                        width: '200px',
                                        render: (props) => (
                                            <div className="merge-field-cell">
                                                {props.row.name}
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary small ms-2">
                                                    text
                                                </span>
                                            </div>
                                        )
                                    },
                                    {
                                        title: 'Value',
                                        width: 'auto',
                                        renderCell: (props) => (
                                            <input
                                                type="text"
                                                value={props.row.value}
                                                onChange={(e) => props.onChange({ ...props.row, value: e.target.value })}
                                                className="form-control"
                                            />
                                        )
                                    }
                                ]}
                                rowHeight={40}
                                headerHeight={40}
                                addRowsComponent={false}
                                deleteRowsComponent={false}
                                lockRows={true}
                                style={{ height: '60vh' }}
                            />
                        </div>
                    </Tab>
                    <Tab eventKey="links" title="Links">
                        <div className="mb-4">
                            <h6 className="mb-3">Link Fields</h6>
                            <DataSheetGrid
                                value={rows.filter(row => row.type === 'link')}
                                onChange={(newRows) => {
                                    const otherRows = rows.filter(row => row.type !== 'link');
                                    handleRowsChange([...newRows, ...otherRows]);
                                }}
                                columns={[
                                    {
                                        title: 'Merge Field',
                                        width: '200px',
                                        render: (props) => (
                                            <div className="merge-field-cell">
                                                {props.row.name}
                                                <span className="badge bg-success bg-opacity-10 text-success small ms-2">
                                                    link
                                                </span>
                                            </div>
                                        )
                                    },
                                    {
                                        title: 'URL',
                                        width: 'auto',
                                        renderCell: (props) => (
                                            <input
                                                type="url"
                                                value={props.row.value}
                                                onChange={(e) => props.onChange({ ...props.row, value: e.target.value })}
                                                className="form-control"
                                            />
                                        )
                                    }
                                ]}
                                rowHeight={40}
                                headerHeight={40}
                                addRowsComponent={false}
                                deleteRowsComponent={false}
                                lockRows={true}
                                style={{ height: '60vh' }}
                            />
                        </div>
                    </Tab>
                    <Tab eventKey="images" title="Images">
                        <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <Button variant="primary" as="label">
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    Upload Image
                                </Button>
                                {uploadedImageUrl && (
                                    <InputGroup>
                                        <Form.Control
                                            value={uploadedImageUrl}
                                            readOnly
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleCopyImageUrl}
                                        >
                                            <i className="bi bi-clipboard"></i>
                                        </Button>
                                    </InputGroup>
                                )}
                            </div>
                            <h6 className="mb-3">Image Fields</h6>
                            <DataSheetGrid
                                value={rows.filter(row => row.type === 'image')}
                                onChange={(newRows) => {
                                    const otherRows = rows.filter(row => row.type !== 'image');
                                    handleRowsChange([...newRows, ...otherRows]);
                                }}
                                columns={[
                                    {
                                        title: 'Merge Field',
                                        width: '200px',
                                        render: (props) => (
                                            <div className="merge-field-cell">
                                                {props.row.name}
                                                <span className="badge bg-info bg-opacity-10 text-info small ms-2">
                                                    image
                                                </span>
                                            </div>
                                        )
                                    },
                                    {
                                        title: 'Image URL',
                                        width: 'auto',
                                        renderCell: (props) => (
                                            <input
                                                type="url"
                                                value={props.row.value}
                                                onChange={(e) => props.onChange({ ...props.row, value: e.target.value })}
                                                className="form-control"
                                            />
                                        )
                                    }
                                ]}
                                rowHeight={40}
                                headerHeight={40}
                                addRowsComponent={false}
                                deleteRowsComponent={false}
                                lockRows={true}
                                style={{ height: '60vh' }}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>

            <style jsx>{`
                .merge-field-cell {
                    display: flex;
                    align-items: center;
                    padding: 4px 8px;
                }

                :global(.modal-90w) {
                    width: 90%;
                    max-width: 1200px;
                }

                :global(.tab-content) {
                    padding: 1rem 0;
                }

                h6 {
                    color: #6c757d;
                    font-weight: 500;
                }
            `}</style>
        </Modal>
    );
};

export default EditMultipleTemplates;