import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a form name'],
        trim: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: [true, 'Form must be associated with a plan']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Form must be associated with a user']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'draft'
    },
    uid: {
        type: String,
        required: [true, 'Please provide a unique identifier for the form'],
        unique: true
    },
    fields: {
        email: {
            enabled: { type: Boolean, default: true },
            required: { type: Boolean, default: true }
        },
        firstName: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        lastName: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        phone: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        birthDate: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        yearOfBirth: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        gender: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        postcode: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        company: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        newsletter: {
            enabled: { type: Boolean, default: false },
            required: { type: Boolean, default: false }
        },
        terms: {
            enabled: { type: Boolean, default: true },
            required: { type: Boolean, default: true }
        },
        captcha: {
            enabled: { type: Boolean, default: true },
            required: { type: Boolean, default: true }
        }
    },
    theme: {
        primaryColor: {
            type: String,
            default: '#0d6efd'
        },
        secondaryColor: {
            type: String,
            default: '#6c757d'
        },
        backgroundColor: {
            type: String,
            default: '#ffffff'
        },
        textColor: {
            type: String,
            default: '#212529'
        },
        fontFamily: {
            type: String,
            default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
        },
        customFont: {
            enabled: {
                type: Boolean,
                default: false
            },
            url: String, // e.g., "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            fontFamily: String // e.g., "'Roboto', sans-serif"
        },
        borderRadius: {
            type: String,
            default: '0.375rem'
        },
        inputBorderColor: {
            type: String,
            default: '#ced4da'
        },
        buttonStyle: {
            type: String,
            enum: ['filled', 'outline'],
            default: 'filled'
        },
        labelStyle: {
            type: String,
            enum: ['bold', 'normal'],
            default: 'bold'
        },
        spacing: {
            type: String,
            enum: ['compact', 'normal', 'relaxed'],
            default: 'normal'
        }
    },

    integrations: {
        klaviyo: {
            enabled: { type: Boolean, default: false },
            apiKey: String,
            listId: String
        }
        // Add other integrations as needed
    },
    settings: {
        redirectUrl: String,
        successMessage: String,
        notificationEmail: String
    }
}, {
    timestamps: true
});

// Indexes
FormSchema.index({ userId: 1 });
FormSchema.index({ planId: 1 });
FormSchema.index({ status: 1 });
FormSchema.index({ createdAt: 1 });

// Virtual for submission count
FormSchema.virtual('submissionCount').get(function () {
    return this.submissions.length;
});

// Method to check if form is active
FormSchema.methods.isActive = function () {
    return this.status === 'active';
};

// Static method to find active forms for a user
FormSchema.statics.findActiveForUser = function (userId) {
    return this.find({ userId, status: 'active' });
};

const Form = mongoose.models.Form || mongoose.model('Form', FormSchema);

export default Form; 