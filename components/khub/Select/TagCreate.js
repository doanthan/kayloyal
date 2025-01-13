import CreatableSelect from 'react-select/creatable';
import { useAuth } from 'services/AuthProvider'


const TagCreate = ({ handleTagSelection, initialValue = [], tags }) => {
    function getUniqueTags(accounts) {
        // Flatten the tags from all accounts
        console.log(accounts)
        const allTags = accounts.flatMap(account => account.tags);

        // Create a set to remove duplicates
        const uniqueTags = new Set(allTags);

        // Map the unique tags to the format { value: tag, label: tag }
        const options = Array.from(uniqueTags).map(tag => ({
            value: tag,
            label: tag
        }));

        return options;

    }

    const tagOptions = getUniqueTags(tags)
    return (
        <CreatableSelect
            classNamePrefix="select"
            name="metrics"
            isSearchable
            isMulti={true}
            value={initialValue}
            onChange={handleTagSelection}
            options={tagOptions}

        />
    );
};

export default TagCreate;