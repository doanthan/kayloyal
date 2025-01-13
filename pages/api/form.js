import connect from 'services/db'
import { onlyAuthUser } from 'services/server-library'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        query: { id },
        method,
    } = req
    await connect()    // Check if the user is authenticated before proceeding
    const isAuthenticated = await onlyAuthUser(req, res);
    if (!isAuthenticated) {
        console.log("NOT AUTHENTICATED")
        return;
    }


    try {
        const { fields, theme, name, country, termsUrl, planId } = req.body;

        // Console log each variable
        console.log('=== New Form Submission ===');
        console.log('Name:', name);
        console.log('Country:', country);
        console.log('Terms URL:', termsUrl);
        console.log('Plan ID:', planId);
        console.log('\nTheme Settings:', JSON.stringify(theme, null, 2));
        console.log('\nEnabled Fields:', JSON.stringify(fields, null, 2));
        console.log('========================\n');

        // Mock response for testing
        return res.status(201).json({
            message: 'Form created successfully',
            formId: 'test-' + Date.now() // Temporary ID for testing
        });

    } catch (error) {
        console.error('Error in /api/signup:', error);
        return res.status(500).json({
            message: 'Failed to create form',
            error: error.message
        });
    }
}
