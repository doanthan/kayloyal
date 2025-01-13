import mongoose, { Schema, model, models } from 'mongoose'

const planSchema = new Schema({
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    planName: {
        type: String,
        required: true,
        trim: true
    },
    cardType: {
        type: String,
        required: true,
        enum: ['One-Time Use Cards', 'Loyalty Cards']
    },
    brandLogo: {
        type: String,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    passes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    forms: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    coupons: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    }
}, {
    timestamps: true
})

// Check if the model exists before creating a new one
export default mongoose.models?.Plan || mongoose.model('Plan', planSchema);