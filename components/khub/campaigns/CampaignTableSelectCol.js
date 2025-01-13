import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';

const CampaignTableSelectCol = ({ showOffcanvas, handleCloseOffcanvas, columns, setColumns }) => {
    const handleColumnChange = (section, column, isChecked) => {
        setColumns(prevColumns => ({
            ...prevColumns,
            [section]: {
                ...prevColumns[section],
                [column]: isChecked
            }
        }));
    };


    return (
        <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Select Columns to Display</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <h5>Main Metrics</h5>
                {Object.entries(columns.main).map(([column, isChecked]) => (
                    column !== "Tags" && <Form.Check
                        key={column}
                        type="checkbox"
                        label={column}
                        checked={isChecked}
                        onChange={(e) => handleColumnChange('main', column, e.target.checked)}
                    />
                ))}
                <h5 className="mt-3">Additional Metrics</h5>
                {Object.entries(columns.additional).map(([column, isChecked]) => (
                    <Form.Check
                        key={column}
                        type="checkbox"
                        label={column}
                        checked={isChecked}
                        onChange={(e) => handleColumnChange('additional', column, e.target.checked)}
                    />
                ))}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CampaignTableSelectCol;