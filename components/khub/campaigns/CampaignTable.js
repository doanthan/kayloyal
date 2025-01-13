import { useMemo } from 'react';
import { Table, Tabs, Tab, Button, Offcanvas } from "react-bootstrap"
import { useState, useEffect } from 'react';
import CampaignTableSelectCol from 'components/khub/campaigns/CampaignTableSelectCol'
import { formatDateString, formatTagNames, formatRate, formatNumberWithCommas } from 'services/library'
import { ColumnsGap, Download, ArrowUp, ArrowDown } from 'react-bootstrap-icons';
import Papa from 'papaparse';
import EventModal from 'components/khub/campaigns/EventModal';


const CampaignTable = ({ campaigns, showOffcanvas, setShowOffcanvas, viewByTags, setEmailsReceived, setSMSReceived }) => {

    const [selectedEvent, setSelectedEvent] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const handleSelectCampaign = (campaign) => {
        console.log("TEST")
        setSelectedEvent(campaign)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedEvent(null)
    }

    const handleCloseOffcanvas = () => setShowOffcanvas(false);

    const [columns, setColumns] = useState(() => {
        const savedColumns = localStorage.getItem('campaignTableColumns');
        if (savedColumns) {
            return JSON.parse(savedColumns);
        }
        return initialColumns; // Your default initial columns
    });

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const handleSort = (column) => {
        let direction = 'asc';
        if (sortConfig.key === column && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === column && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key: column, direction });
    };

    const parseValue = (value, column) => {
        if (typeof value === 'string') {
            if (value.includes(',')) {
                return parseFloat(value.replace(/,/g, '').replace('$', ''));
            } else if (value.includes('%')) {
                return parseFloat(value.replace('%', '')) / 100;
            } else if (column === 'Send Time') {
                return new Date(value);
            }
        }
        return value;
    };



    const sortedCampaigns = useMemo(() => {
        let sortableCampaigns = [...campaigns];
        if (sortConfig.key !== null) {
            sortableCampaigns.sort((a, b) => {
                const key = columnKeyMap[sortConfig.key];
                let aValue = ""
                let bValue = ""
                if (['tagNames', 'accountName', 'campaignName', 'send_channel', 'send_time'].includes(key)) {
                    aValue = parseValue(key ? a[key] : a[sortConfig.key], sortConfig.key);
                    bValue = parseValue(key ? b[key] : b[sortConfig.key], sortConfig.key);
                } else {
                    aValue = parseValue(key ? a.statistics[key] : a[sortConfig.key], sortConfig.key);
                    bValue = parseValue(key ? b.statistics[key] : b[sortConfig.key], sortConfig.key);
                }

                if (sortConfig.key === 'Send Time') {
                    const aDate = new Date(aValue);
                    const bDate = new Date(bValue);
                    return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
                } else if (['Tags', 'Account', 'Campaign Name', 'Channel'].includes(sortConfig.key)) {
                    console.log(sortConfig.direction)
                    return sortConfig.direction === 'asc'
                        ? String(aValue).localeCompare(String(bValue))
                        : String(bValue).localeCompare(String(aValue));
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }
                return 0;
            });
        }
        return sortableCampaigns;
    }, [campaigns, sortConfig]);



    useEffect(() => {
        localStorage.setItem('campaignTableColumns', JSON.stringify(columns));
    }, [columns]);

    const downloadCSV = () => {
        let csvData;
        const totalColumns = { ...columns.main, ...columns.additional }
        if (viewByTags) {
            csvData = campaigns.map(group => {
                console.log(group)
                const row = {
                    Tag: group.tagName,
                    "Channel ": group.channel,
                };
                Object.entries(totalColumns).forEach(([column, isVisible]) => {
                    if (isVisible && !['Tags', 'Account', 'Send Time', 'Campaign Name', 'Channel'].includes(column)) {
                        const key = columnKeyMap[column];
                        if (key && group.statistics[key] !== undefined) {
                            row[column] = group.statistics[key];
                        } else {
                            row[column] = ''; // If the key doesn't exist, set it to an empty string
                        }
                    }
                });
                return row;
            });
        } else {
            csvData = campaigns.map(campaign => {
                const row = {};
                Object.entries(totalColumns).forEach(([column, isVisible]) => {
                    if (isVisible) {
                        const key = columnKeyMap[column];
                        if (key) {
                            if (campaign[key] !== undefined) {
                                row[column] = campaign[key];
                            } else if (campaign.statistics && campaign.statistics[key] !== undefined) {
                                row[column] = campaign.statistics[key];
                            } else {
                                row[column] = ''; // If the key doesn't exist, set it to an empty string
                            }
                        }
                    }
                });
                return row;
            });
        }

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'campaigns.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderTableContent = (data, columns) => {
        return (
            <tbody>
                {sortedCampaigns.map((campaign, index) => (
                    <tr key={index} className='cursor-pointer' onClick={() => handleSelectCampaign(campaign)}>
                        {columns['Tags'] && <td>{campaign.isTag ? campaign.tagName : formatTagNames(campaign.tagNames)}</td>}
                        {columns['Account'] && <td>{campaign.accountName}</td>}
                        {columns['Send Time'] && <td>{formatDateString(campaign.send_time)}</td>}
                        {columns['Campaign Name'] && <td>{campaign.campaignName}</td>}
                        {columns['Channel'] && <td>{campaign.isTag ? campaign.channel : campaign.send_channel}</td>}
                        {columns['Recipients'] && <td>{formatNumberWithCommas(campaign.statistics.recipients, false)}</td>}
                        {columns['Delivered'] && <td>{formatNumberWithCommas(campaign.statistics.delivered, false)}</td>}
                        {columns['Delivery Rate'] && <td>{formatRate(campaign.statistics.delivery_rate)}</td>}
                        {columns['Opens'] && <td>{formatNumberWithCommas(campaign.statistics.opens, false)}</td>}
                        {columns['Opens Unique'] && <td>{formatNumberWithCommas(campaign.statistics.opens_unique, false)}</td>}
                        {columns['Open Rate'] && <td>{formatRate(campaign.statistics.open_rate)}</td>}
                        {columns['Clicked'] && <td>{formatNumberWithCommas(campaign.statistics.clicks, false)}</td>}
                        {columns['Clicks Unique'] && <td>{formatNumberWithCommas(campaign.statistics.clicks_unique, false)}</td>}
                        {columns['Click Rate'] && <td>{formatRate(campaign.statistics.click_rate)}</td>}
                        {columns['Conversions'] && <td>{formatNumberWithCommas(campaign.statistics.conversions, false)}</td>}
                        {columns['Conversion Value'] && <td>{"$" + formatNumberWithCommas(campaign.statistics.conversion_value)}</td>}
                        {columns['Conversion Rate'] && <td>{formatRate(campaign.statistics.conversion_rate)}</td>}
                        {columns['AOV'] && <td>{"$" + formatNumberWithCommas(campaign.statistics.average_order_value)}</td>}
                        {columns['Revenue per recipient'] && <td>{"$" + formatNumberWithCommas(campaign.statistics.revenue_per_recipient)}</td>}
                    </tr>
                ))}
                <tr className="table-active font-weight-bold" style={{ fontWeight: 'bold' }}>
                    <td style={{ fontWeight: 'bold' }}>Total</td>
                    {Object.entries(columns).map(([column, isVisible], index) => {
                        if (index === 0) { return null; } // Skip the first column as it's already covered by the 'Total' cell
                        if (column === 'Send Time' || column === 'Campaign Name' || column === 'Channel' || column === 'Tags') {
                            return <td key={column} style={{ fontWeight: 'bold' }}>-</td>;
                        } else if (isVisible) {
                            const key = columnKeyMap[column];
                            if (key && totals[key] !== undefined) {
                                if (key.endsWith('_rate')) {
                                    return <td key={column} style={{ fontWeight: 'bold' }}>{formatRate(totals[key])}</td>;
                                } else if (key === 'conversion_value' || key === 'average_order_value' || key === 'revenue_per_recipient') {
                                    return <td key={column} style={{ fontWeight: 'bold' }}>{"$" + formatNumberWithCommas(totals[key])}</td>;
                                } else {
                                    return <td key={column} style={{ fontWeight: 'bold' }}>{formatNumberWithCommas(totals[key])}</td>;
                                }
                            }
                            return <td key={column} style={{ fontWeight: 'bold' }}>-</td>;
                        }
                        return null;
                    })}
                </tr>
            </tbody>
        );
    };

    const renderAdditionalContent = (data, columns) => {
        return (
            <tbody>
                {sortedCampaigns.map((campaign, index) => (
                    < tr key={index} >
                        {columns['Tags'] && <td>{campaign.isTag ? campaign.tagName : formatTagNames(campaign.tagNames)}</td>}
                        {columns['Account'] && <td>{campaign.accountName}</td>}
                        {columns['Send Time'] && <td>{formatDateString(campaign.send_time)}</td>}
                        {columns['Campaign Name'] && <td>{campaign.campaignName}</td>}
                        {columns['Channel'] && <td>{campaign.isTag ? campaign.channel : campaign.send_channel}</td>}
                        {columns['Bounced'] && <td>{campaign.statistics.bounced}</td>}
                        {columns['Bounced Rate'] && <td>{campaign.statistics.bounce_rate}</td>}
                        {columns['Failed'] && <td>{campaign.statistics.failed}</td>}
                        {columns['Failed Rate'] && <td>{campaign.statistics.failed_rate}</td>}
                        {columns['Spam Complaints'] && <td>{campaign.statistics.spam_complaints}</td>}
                        {columns['Spam Complaint Rate'] && <td>{campaign.statistics.spam_complaint_rate}</td>}
                        {columns['Unsubscribes'] && <td>{campaign.statistics.unsubscribes}</td>}
                        {columns['Unsubscribe Rate'] && <td>{campaign.statistics.unsubscribe_rate}</td>}
                    </tr>
                ))
                }
                <tr className="table-active font-weight-bold" style={{ fontWeight: 'bold' }}>
                    <td style={{ fontWeight: 'bold' }}>Total</td>
                    {Object.entries(columns).map(([column, isVisible], index) => {
                        if (index === 0) { return null; } // Skip the first column as it's already covered by the 'Total' cell
                        if (column === 'Send Time' || column === 'Campaign Name' || column === 'Channel' || column === 'Tags') {
                            return <td key={column} style={{ fontWeight: 'bold' }}>-</td>;
                        } else if (isVisible) {
                            const key = columnKeyMap[column];
                            if (key && totals[key] !== undefined) {
                                if (key.endsWith('_rate')) {
                                    return <td key={column} style={{ fontWeight: 'bold' }}>{formatRate(totals[key])}</td>;
                                } else if (key === 'conversion_value' || key === 'average_order_value') {
                                    return <td key={column} style={{ fontWeight: 'bold' }}>{"$" + formatNumberWithCommas(totals[key])}</td>;
                                } else {
                                    return <td key={column} style={{ fontWeight: 'bold' }}>{formatNumberWithCommas(totals[key], false)}</td>;
                                }
                            }
                            return <td key={column} style={{ fontWeight: 'bold' }}>-</td>;
                        }
                        return null;
                    })}
                </tr>
            </tbody >
        );
    };


    const totals = useMemo(() => {
        const totals = {};
        campaigns.forEach(campaign => {
            Object.entries(campaign.statistics).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    totals[key] = (totals[key] || 0) + value;
                }
            });
        });

        // Calculate averages for rate fields
        ['delivery_rate', 'open_rate', 'click_rate', 'conversion_rate'].forEach(key => {
            if (totals[key]) {
                totals[key] /= campaigns.length;
            }
        });

        return totals;
    }, [campaigns]);

    return (
        <>
            <div className="d-flex justify-content-end mt-1">
                <Button
                    variant="outline-primary"
                    onClick={setShowOffcanvas}
                    className="me-2 btn-sm"
                >
                    <ColumnsGap className="me-1" /> Select Columns
                </Button>
                <Button
                    variant="outline-primary"
                    onClick={downloadCSV}
                    className="btn-sm"
                >
                    <Download className="me-1" /> Download CSV
                </Button>
            </div>
            <EventModal showModal={showModal} selectedEvent={selectedEvent} handleCloseModal={handleCloseModal} />
            <Tabs defaultActiveKey="main" id="campaign-table-tabs">
                <Tab eventKey="main" title="Delivery Metrics">
                    <Table striped bordered hover responsive className="flow-table">
                        <thead>
                            <tr>
                                {Object.entries(columns.main).map(([column, isVisible]) =>
                                    isVisible && (
                                        <th key={column} className="cursor-pointer"
                                            onClick={() => handleSort(column)}>
                                            {column}{' '}
                                            {sortConfig.key === column && (
                                                sortConfig.direction === 'asc'
                                                    ? <ArrowDown className="ms-1" size={12} />
                                                    : <ArrowUp className="ms-1" size={12} />
                                            )}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        {renderTableContent(campaigns, columns.main)}
                    </Table>

                </Tab >
                <Tab eventKey="additional" title="Additional Metrics" >
                    <Table striped bordered hover responsive className="flow-table">
                        <thead>
                            <tr className="cursor-pointer">
                                {Object.entries(columns.additional).map(([column, isVisible]) =>
                                    isVisible && (
                                        <th key={column} hover onClick={() => handleSort(column)}>
                                            {column}{' '}
                                            {sortConfig.key === column && (
                                                sortConfig.direction === 'asc'
                                                    ? <ArrowDown className="ms-1" size={12} />
                                                    : <ArrowUp className="ms-1" size={12} />
                                            )}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        {renderAdditionalContent(campaigns, columns.additional)}

                    </Table>
                </Tab>
            </Tabs >
            <CampaignTableSelectCol
                showOffcanvas={showOffcanvas}
                handleCloseOffcanvas={handleCloseOffcanvas}
                columns={columns}
                setColumns={setColumns}
            />


        </>
    );
};

export default CampaignTable;


const initialColumns = {
    main: {
        Tags: true,
        Account: true,
        'Send Time': true,
        'Campaign Name': true,
        Channel: true,
        Recipients: true,
        Delivered: true,
        'Delivery Rate': true,
        Opens: true,
        'Opens Unique': true,
        'Open Rate': true,
        Clicked: true,
        'Clicks Unique': true,
        'Click Rate': true,
        Conversions: true,
        'Conversion Value': true,
        'Conversion Rate': true,
        AOV: true,
        "Revenue per recipient": true,
    },
    additional: {
        Tags: true,
        Account: true,
        'Send Time': true,
        'Campaign Name': true,
        Channel: true,
        Bounced: true,
        'Bounced Rate': true,
        Failed: true,
        'Failed Rate': true,
        'Spam Complaints': true,
        'Spam Complaint Rate': true,
        Unsubscribes: true,
        'Unsubscribe Rate': true
    }
};

const columnKeyMap = {
    "Tags": "tagNames",
    'Account': 'accountName',
    'Send Time': 'send_time',
    'Campaign Name': 'campaignName',
    'Channel': 'send_channel',
    'Recipients': 'recipients',
    'Delivered': 'delivered',
    'Delivery Rate': 'delivery_rate',
    'Opens': 'opens',
    'Opens Unique': 'opens_unique',
    'Open Rate': 'open_rate',
    'Clicked': 'clicks',
    'Clicks Unique': 'clicks_unique',
    'Click Rate': 'click_rate',
    'Conversions': 'conversions',
    'Conversion Value': 'conversion_value',
    'Conversion Rate': 'conversion_rate',
    'Tags': 'tagNames',
    'Bounced': 'bounced',
    'Bounced Rate': 'bounce_rate',
    'Failed': 'failed',
    'Failed Rate': 'failed_rate',
    'Spam Complaints': 'spam_complaints',
    'Spam Complaint Rate': 'spam_complaint_rate',
    'Unsubscribes': 'unsubscribes',
    'Unsubscribe Rate': 'unsubscribe_rate',
    "AOV": "average_order_value",
    "Revenue per recipient": "revenue_per_recipient",
};
