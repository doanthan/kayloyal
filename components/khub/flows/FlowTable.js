import React, { useState, useMemo, useEffect } from 'react';
import { Table, Row, Button } from 'react-bootstrap';
import { formatCurrency } from 'services/library'
import { ColumnsGap, Download, ArrowUp, ArrowDown, ArrowDownUp } from 'react-bootstrap-icons';
import Papa from 'papaparse';


const FlowDataTable = ({ data, groupByFlow }) => {
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortedData, setSortedData] = useState(data);


    useEffect(() => {
        setSortedData(data)
    }, [data])

    const getSortIcon = (columnName) => {
        if (sortField === columnName) {
            return sortDirection === 'asc'
                ? <ArrowUp className="ms-1" size={12} />
                : <ArrowDown className="ms-1" size={12} />;
        }
        return null;
    };

    const sortData = (field) => {
        const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        const newSortedData = [...sortedData].sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];

            console.log(valueA)
            console.log(valueB)
            // Handle percentage values
            if (typeof valueA === 'string' && valueA.endsWith('%')) {
                console.log("HERE")
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }

            // Handle currency values
            if (typeof valueA === 'string' && valueA.startsWith('$')) {
                console.log("HERE1")
                valueA = parseFloat(valueA.replace('$', '').replace(',', ''));
                valueB = parseFloat(valueB.replace('$', '').replace(',', ''));
            }

            // Handle numeric comparison
            if (!isNaN(valueA) && !isNaN(valueB)) {
                console.log("HERE2")

                return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            }

            // Handle string comparison
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                console.log(":HELLO")
                return sortDirection === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            // Fallback for other cases
            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setSortField(field);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        setSortedData(newSortedData);
    };

    const downloadCSV = () => {
        const csvData = data.map(item => ({
            Account: item.account,
            'Flow Name': item.name,
            Channel: item.send_channel,
            ...(!groupByFlow && { 'Message Name': item.messageName }),
            Delivered: item.delivered,
            Opens: item.opens_unique,
            'Open Rate': `${(item.openRate * 100).toFixed(2)}%`,
            Clicks: item.clicks_unique,
            'Click Rate': `${(item.clickRate * 100).toFixed(2)}%`,
            Conversions: item.conversion_uniques,
            'Conversion Rate': `${(item.conversionRate * 100).toFixed(2)}%`,
            'Conversion Value': `$${item.conversion_value.toFixed(2)}`
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'flow_data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Row>
            < div className="d-flex justify-content-end py-3" >
                <Button
                    variant="outline-primary"
                    onClick={downloadCSV}
                    className="btn-sm"
                >
                    <Download className="me-1" /> Download CSV
                </Button>
            </div >
            <Table striped bordered hover responsive className="flow-table">
                <thead>
                    <tr className='cursor-pointer'>
                        <th onClick={() => sortData('klaviyoPublic')}>
                            Account {getSortIcon('klaviyoPublic')}
                        </th>
                        <th onClick={() => sortData('name')}>
                            Flow Name {getSortIcon('name')}
                        </th>
                        <th onClick={() => sortData('send_channel')}>
                            Channel {getSortIcon('send_channel')}
                        </th>
                        {!groupByFlow && (
                            <th onClick={() => sortData('messageName')}>
                                Message Name {getSortIcon('messageName')}
                            </th>
                        )}
                        <th onClick={() => sortData('delivered')}>
                            Delivered {getSortIcon('delivered')}
                        </th>
                        <th onClick={() => sortData('opens_unique')}>
                            Opens {getSortIcon('opens_unique')}
                        </th>
                        <th onClick={() => sortData('openRate')}>
                            Open Rate {getSortIcon('openRate')}
                        </th>
                        <th onClick={() => sortData('clicks_unique')}>
                            Clicks {getSortIcon('clicks_unique')}
                        </th>
                        <th onClick={() => sortData('clickRate')}>
                            Click Rate {getSortIcon('clickRate')}
                        </th>
                        <th onClick={() => sortData('conversion_uniques')}>
                            Conversions {getSortIcon('conversion_uniques')}
                        </th>
                        <th onClick={() => sortData('conversionRate')}>
                            Conversion Rate {getSortIcon('conversionRate')}
                        </th>
                        <th onClick={() => sortData('conversion_value')}>
                            Conversion Value {getSortIcon('conversion_value')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.account}</td>
                            <td>{item.name}</td>
                            <td>{item.send_channel}</td>
                            {!groupByFlow && (
                                <>
                                    <td>{item.messageName}</td>
                                    <td>{item.messageSubject || 'N/A'}</td>

                                </>
                            )}
                            <td>{item.delivered}</td>
                            <td>{item.opens_unique}</td>
                            <td>{(item.openRate * 100).toFixed(2)}%</td>
                            <td>{item.clicks_unique}</td>
                            <td>{(item.clickRate * 100).toFixed(2)}%</td>
                            <td>{item.conversion_uniques}</td>
                            <td>{(item.conversionRate * 100).toFixed(2)}%</td>
                            <td>{formatCurrency(item.conversion_value)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Row >
    );
};

export default FlowDataTable;