import mongoose from 'mongoose';

const walletRegistrationSchema = new mongoose.Schema({
    passId: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        enum: ['apple', 'google'],
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    pushToken: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    unregisteredAt: Date,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for unique registrations
walletRegistrationSchema.index(
    { platform: 1, deviceId: 1, passId: 1 },
    { unique: true }
);

export default mongoose.models.WalletRegistration ||
    mongoose.model('WalletRegistration', walletRegistrationSchema);