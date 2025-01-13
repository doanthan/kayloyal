import connect from 'services/db'
import Pass from 'models/pass'
import { onlyAuthUser } from 'services/server-library'

export default async function handler(req, res) {
    if (req.method !== 'PATCH' && req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        })
    }

    try {
        await connect()
        const isAuthenticated = await onlyAuthUser(req, res)
        if (!isAuthenticated) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            })
        }

        const { id } = req.query
        const updates = req.body


        if (req.method === 'GET') {
            if (!req.pass) {
                return res.status(404).json({
                    success: false,
                    message: 'Pass not found'
                })
            }
            return res.status(200).json({
                success: true,
                data: req.pass
            })
        }

        if (req.method === 'PATCH') {

            // Verify user owns this pass
            const pass = await Pass.findOne({
                _id: id,
                _id: { $in: req.user.passes } // Ensure user owns this pass
            })

            if (!pass) {
                return res.status(404).json({
                    success: false,
                    message: 'Pass not found or access denied'
                })
            }

            // Update the pass
            const updatedPass = await Pass.findByIdAndUpdate(
                id,
                {
                    $set: {
                        name: updates.name,
                        type: updates.type,
                        barcodeType: updates.barcodeType,
                        backgroundColor: updates.backgroundColor,
                        textColor: updates.textColor,
                        labelColor: updates.labelColor,
                        'images.logo.google': updates.images?.logo?.google,
                        'images.strip.google': updates.images?.strip?.google,
                        updatedAt: new Date()
                    }
                },
                {
                    new: true,      // Return updated document
                    runValidators: true  // Run model validations
                }
            )

            return res.status(200).json({
                success: true,
                message: 'Pass updated successfully',
                data: updatedPass
            })
        }

    } catch (error) {
        console.error('Error updating pass:', error)
        return res.status(500).json({
            success: false,
            message: 'Error updating pass',
            error: error.message
        })
    }
}
