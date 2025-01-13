import mongoose from "mongoose"
const { Schema } = mongoose
const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        plans: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan'
        }],
        passes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pass'
        }],
        paymentPlan: {
            //Trial, Free, Annual, Monthly or Suspended
            type: String,
            default: "Trial"
        },
        resetToken: {
            type: String,
            required: false,
        },
        resetTokenExpiry: {
            type: Date,
            required: false,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean
        }

    },
    { timestamps: true }
)

userSchema.methods.getPasses = async function () {
    await this.populate('passes')
    return this.passes
}

// Check if the model exists before compiling it
export default mongoose.models?.User || mongoose.model('User', userSchema);