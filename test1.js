// Update your modal content
<Modal show={showModal} onHide={handleCloseModal} size="xl">
    <Modal.Header closeButton>
        <Modal.Title>Edit Merge Fields</Modal.Title>
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
                                ...keyColumn,
                                title: 'Value',
                                width: 'auto'
                            }
                        ]}
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
                                ...keyColumn,
                                title: 'URL',
                                width: 'auto'
                            }
                        ]}
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
                                ...keyColumn,
                                title: 'Image URL',
                                width: 'auto'
                            }
                        ]}
                    />
                </div>
            </Tab>
        </Tabs>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
        </Button>
    </Modal.Footer>

    <style jsx>{`
        .merge-field-cell {
            display: flex;
            align-items: center;
            padding: 4px 8px;
        }

        .tab-content {
            padding: 1rem 0;
        }

        h6 {
            color: #6c757d;
            font-weight: 500;
        }
    `}</style>
</Modal>