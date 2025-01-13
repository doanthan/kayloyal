import React, { useState } from 'react';
import { Table, Button, Collapse, Card } from 'react-bootstrap';
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons';

const TagResultsTable = ({ tagResults }) => {
    console.log(tagResults)
    const [expandedTags, setExpandedTags] = useState({});

    const toggleExpand = (tag) => {
        setExpandedTags(prev => ({
            ...prev,
            [tag]: !prev[tag]
        }));
    };

    const renderStatistics = (statistics) => {
        return (
            <>
                <td>{statistics.recipients.toLocaleString()}</td>
                <td>{statistics.delivered.toLocaleString()}</td>
                <td>{(statistics.delivery_rate * 100).toFixed(2)}%</td>
                <td>{statistics.opens.toLocaleString()}</td>
                <td>{(statistics.open_rate * 100).toFixed(2)}%</td>
                <td>{statistics.clicks.toLocaleString()}</td>
                <td>{(statistics.click_rate * 100).toFixed(2)}%</td>
                <td>{statistics.conversions.toLocaleString()}</td>
                <td>${statistics.conversion_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </>
        );
    };

    return (
        <Card>
            <Card.Body>
                <Table responsive hover className="align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th>Tag</th>
                            <th>Recipients</th>
                            <th>Delivered</th>
                            <th>Delivery Rate</th>
                            <th>Opens</th>
                            <th>Open Rate</th>
                            <th>Clicks</th>
                            <th>Click Rate</th>
                            <th>Conversions</th>
                            <th>Conversion Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tagResults.map((tagResult) => (
                            <React.Fragment key={tagResult.tag}>
                                <tr>
                                    <td>
                                        <Button
                                            variant="link"
                                            onClick={() => toggleExpand(tagResult.tag)}
                                            className="d-flex align-items-center text-decoration-none"
                                        >
                                            {expandedTags[tagResult.tag] ? <ChevronDown /> : <ChevronRight />}
                                            <span className="ms-2">{tagResult.tag}</span>
                                        </Button>
                                    </td>
                                    {renderStatistics(tagResult.statistics)}
                                </tr>
                                <tr>
                                    <td colSpan="10" className="p-0">
                                        <Collapse in={expandedTags[tagResult.tag]}>
                                            <div>
                                                <Table responsive hover className="mb-0">
                                                    <tbody>
                                                        {tagResult.campaigns.map((campaign, index) => (
                                                            <tr key={index} className="bg-light">
                                                                <td className="ps-4">{campaign.campaignName}</td>
                                                                {renderStatistics(campaign.statistics)}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Collapse>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default TagResultsTable;