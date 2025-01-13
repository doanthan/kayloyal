import { IncomingForm } from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        // Check if the request is for a URL
        const contentType = req.headers['content-type']
        if (contentType && contentType.includes('application/json')) {
            const body = await new Promise((resolve) => {
                let data = ''
                req.on('data', chunk => { data += chunk })
                req.on('end', () => { resolve(JSON.parse(data)) })
            })

            // Validate URL
            const { fontUrl } = body
            if (!fontUrl) {
                return res.status(400).json({ message: 'No font URL provided' })
            }

            // Validate file extension
            const ext = path.extname(fontUrl).toLowerCase()
            const allowedTypes = ['.ttf', '.otf', '.woff', '.woff2']
            if (!allowedTypes.includes(ext)) {
                return res.status(400).json({
                    message: 'Invalid font format. Allowed: TTF, OTF, WOFF, WOFF2'
                })
            }

            // Return the validated URL
            return res.status(200).json({
                message: 'Font URL validated',
                fontUrl
            })
        }

        // Handle file upload
        const uploadDir = path.join(process.cwd(), 'public/fonts')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const form = new IncomingForm({
            uploadDir,
            keepExtensions: true,
            multiples: false,
        })

        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err)
                resolve([fields, files])
            })
        })

        const file = files.font?.[0] // Access first file in the array
        if (!file) {
            return res.status(400).json({ message: 'No font file provided' })
        }

        const allowedTypes = ['.ttf', '.otf', '.woff', '.woff2']
        const ext = path.extname(file.originalFilename || '').toLowerCase()
        if (!allowedTypes.includes(ext)) {
            fs.unlinkSync(file.filepath)
            return res.status(400).json({
                message: 'Invalid font format. Allowed: TTF, OTF, WOFF, WOFF2'
            })
        }

        const safeName = `font-${Date.now()}${ext}`
        const newPath = path.join(uploadDir, safeName)

        fs.renameSync(file.filepath, newPath)

        const fontUrl = `/fonts/${safeName}`
        res.status(200).json({
            message: 'Font uploaded successfully',
            fontUrl
        })

    } catch (error) {
        console.error('Font upload error:', error)
        res.status(500).json({
            message: 'Error processing font',
            error: error.message
        })
    }
} 