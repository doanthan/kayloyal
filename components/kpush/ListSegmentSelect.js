import React, { useEffect, useState, useMemo, useRef } from 'react';
import Select from 'react-select';
import { useAuth } from 'services/AuthProvider'
import { getConfigToken } from 'services/library';
import axios from 'axios';

const ListSegmentSelect = ({ klaviyoPublic, onChange, disabled = false, initialValue = [] }) => {
    const [lists, setLists] = useState([]);
    const [segments, setSegments] = useState([]);
    //const [groupedOptions, setGroupedOptions] = useState([{ label: "Lists", options: [] }, { label: "Segments", options: [] }]);
    const { isAuthenticated } = useAuth();


    const handleSelectChange = selectedOption => {
        onChange(selectedOption)
    };

    useEffect(() => {
        const fetchListsOrSegments = async (type, setState) => {
            if (!isAuthenticated()) {
                return;
            }

            const config = getConfigToken()
            try {
                const { data } = await axios.get(`/api/get-klaviyo-api?klaviyoPublic=${klaviyoPublic}&type=${type}`, config);
                setState(data.data);
            } catch (error) {
                console.error('Error fetching segments:', error);
                setState([])
            }
        };

        if (klaviyoPublic) {
            fetchListsOrSegments("lists", setLists);
            fetchListsOrSegments("segments", setSegments);
        }
    }, [klaviyoPublic]);


    const groupedOptions = useMemo(() => [
        { label: "Lists", options: lists },
        { label: "Segments", options: segments }
    ], [lists, segments]);


    const filteredValue = useMemo(() => {
        const allOptions = [...lists, ...segments];
        // Check if initialValue is an array before filtering
        if (Array.isArray(initialValue)) {
            return initialValue.filter(item =>
                allOptions.some(option => option.value === item.value)
            );
        }
        // If initialValue is not an array, return an empty array
        return [];
    }, [lists, segments, initialValue]);

    const prevFilteredValueRef = useRef();
    // complicated code to check
    useEffect(() => {
        // Check if filteredValue has changed and is different from initialValue
        if (filteredValue.length > 0 &&
            JSON.stringify(filteredValue) !== JSON.stringify(prevFilteredValueRef.current) &&
            JSON.stringify(filteredValue) !== JSON.stringify(initialValue)) {
            onChange(filteredValue);
        }
        // Update the ref with the current filteredValue
        prevFilteredValueRef.current = filteredValue;
    }, [filteredValue, initialValue, onChange]);


    return (
        <Select
            classNamePrefix="select"
            name="list-segment"
            isDisabled={disabled}
            closeMenuOnSelect={false}
            isSearchable
            isMulti
            value={filteredValue}
            options={groupedOptions}
            onChange={handleSelectChange}
        />
    );
};

export default ListSegmentSelect;