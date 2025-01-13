import { generateApplePass } from 'services/applePass';
import { generateGooglePassUrl } from 'services/googlePass';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { uid } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    try {
        // Check device type
        const isIOS = /iPhone|iPad|iPod/.test(userAgent);
        const isAndroid = /Android/.test(userAgent);

        // Get pass data
        const pass = {}
        if (!pass) {
            return res.status(404).json({ error: 'Pass not found' });
        }

        if (isIOS) {

            // Generate Apple Wallet pass
            const applePass = await generateApplePass(pass);

            res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
            res.setHeader('Content-Disposition', `attachment; filename=${uid}.pkpass`);
            return res.send(applePass);
        }
        else if (isAndroid) {
            console.log("Android");
            // Redirect to Google Wallet
            const googlePassUrl = await generateGooglePassUrl(pass);
            return res.redirect(googlePassUrl);
        }
        else {
            // Redirect to QR code page for desktop
            return res.redirect(`/pass/${uid}`);
        }

    } catch (error) {
        console.error('Pass error:', error);
        return res.status(500).json({
            error: 'Error processing pass',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}