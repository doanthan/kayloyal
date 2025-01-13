import connect from 'services/db'
import Plan from 'models/plan'
import { onlyAuthUser } from 'services/server-library'
import User from 'models/user'


export default async function handler(req, res) {
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

    switch (method) {
        case 'POST':
            console.log("CREATE!")
            const { businessName, planName, cardType, brandLogo } = req.body

            try {
                // Create new plan
                const plan = await Plan.create({
                    businessName,
                    planName,
                    cardType,
                    brandLogo,
                    status: 'active',
                    users: [req.user._id],  // Add current user to plan
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                // Add plan to user's plans array
                await User.findByIdAndUpdate(
                    req.user._id,
                    {
                        $push: { plans: plan._id }
                    }
                )
                console.log("CRATE!D")
                return res.status(201).json({
                    success: true,
                    message: 'Plan created successfully',
                    data: plan
                })
            } catch (error) {
                return res.status(400).json({ message: error.message })
            }

        case 'GET':
            try {
                const plan = await Plan.findOne({
                    _id: id,
                    users: req.user._id
                }).lean()

                if (!plan) {
                    return res.status(404).json({ message: 'Plan not found' })
                }

                return res.status(200).json(plan)
            } catch (error) {
                return res.status(400).json({ message: error.message })
            }

        case 'PATCH':
            try {
                const updatedPlan = await Plan.findOneAndUpdate(
                    {
                        _id: id,
                        users: session.user.id
                    },
                    {
                        $set: {
                            ...req.body,
                            updatedAt: new Date()
                        }
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                ).lean()

                if (!updatedPlan) {
                    return res.status(404).json({ message: 'Plan not found' })
                }

                return res.status(200).json(updatedPlan)
            } catch (error) {
                return res.status(400).json({ message: error.message })
            }

        case 'DELETE':
            try {
                const deletedPlan = await Plan.findOneAndUpdate(
                    {
                        _id: id,
                        users: session.user.id
                    },
                    {
                        $set: {
                            status: 'deleted',
                            updatedAt: new Date()
                        }
                    },
                    { new: true }
                ).lean()

                if (!deletedPlan) {
                    return res.status(404).json({ message: 'Plan not found' })
                }

                return res.status(200).json({ message: 'Plan deleted successfully' })
            } catch (error) {
                return res.status(400).json({ message: error.message })
            }

        default:
            res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
            return res.status(405).json({ message: `Method ${method} Not Allowed` })
    }


}
