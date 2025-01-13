import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useAuth } from 'services/AuthProvider'
import { getConfigToken } from 'services/library';
import axios from 'axios';

const SegmentSelect = ({ setSendTo, initialSendTo, disabled = false }) => {
    const [segments, setSegments] = useState([{ label: "All Web Push Subscribers", value: "all" }]);
    const { isAuthenticated, currentAccount } = useAuth();

    const handleSelectChange = selectedOption => {
        setSendTo(selectedOption);  // Assuming you want to store the selected value
        console.log("Selected:", selectedOption);  // Optional: for debugging
    };

    useEffect(() => {
        const uid = currentAccount?.value
        const fetchSegments = async () => {
            if (!isAuthenticated()) {
                return;
            }

            const config = getConfigToken()
            try {
                const { data } = await axios.get(`/api/get-segments?uid=${uid}`, config);

                console.log("data", data)
                setSegments([...[{ label: "All Web Push Subscribers", value: "all" }], ...data.data]);
                setSendTo(segments[0])
            } catch (error) {
                console.error('Error fetching segments:', error);
                setSegments([{ label: "All Web Push Subscribers", value: "all" }])
                setSendTo(segments[0])
            }
        };
        if (uid) {
            fetchSegments();
        }
    }, [isAuthenticated, currentAccount]); // Depend on isAuthenticated and token to refetch if these change

    return (
        <Select
            options={segments}
            className="basic-single"
            classNamePrefix="select"
            defaultValue={initialSendTo ? initialSendTo : segments[0]}
            name="segment"
            isDisabled={disabled}
            isSearchable
            onChange={handleSelectChange}
        />
    );
};

export default SegmentSelect;