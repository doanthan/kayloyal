import axios from 'axios';
import { createUniversalContent, createTemplate, createTestFlow } from 'services/klaviyoAPI'
import connect from 'services/db';
import { onlyAuthUser } from 'services/server-library';

export default async function handler(req, res) {
    if (req.method === 'POST') {

        try {
            const id = await createUniversalContent("pk_3be420dd382568161aeef933baff48a3ca", null, "TESTUC", "<p>TEST<p>")
            console.log(id)
        } catch (error) {
            console.log(error.message)
        }


    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}