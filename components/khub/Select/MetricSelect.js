import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useAuth } from 'services/AuthProvider'
import { getConfigToken } from 'services/library';
import axios from 'axios';

const ListSegmentSelect = ({ klaviyoPublic, onChange, disabled = false, initialValue = {} }) => {
    const [metrics, setMetrics] = useState([]);
    const { isAuthenticated } = useAuth();

    const handleSelectChange = selectedOption => {
        onChange(selectedOption)
    };

    useEffect(() => {
        const fetchMetrics = async (type, setState) => {
            if (!isAuthenticated()) {
                return;
            }
            const config = getConfigToken()
            try {
                const { data } = await axios.get(`/api/get-klaviyo-api?klaviyoPublic=${klaviyoPublic}&type=${type}`, config);
                setState(data.data);
            } catch (error) {
                console.error('Error fetching metrics:', error);
                setState([])
            }
        };

        if (klaviyoPublic) {
            fetchMetrics("metrics", setMetrics);
        }
    }, [klaviyoPublic]);

    if (initialValue.length === 0) {
        console.log(initialValue)
    }
    return (
        <Select
            classNamePrefix="select"
            name="metrics"
            isDisabled={disabled}
            isSearchable
            value={initialValue}
            onChange={handleSelectChange}
            options={metrics}
        />
    );
};

export default ListSegmentSelect;