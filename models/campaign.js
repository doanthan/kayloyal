import mongoose from "mongoose"
const { Schema } = mongoose
const campaignSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId, // Reference to User model
            ref: 'User',
            required: true
        },
        status: {
            //(kayloyal)DRAFT or DRAFT or SCHEDULED or SENT
            type: String,
            required: true,
            default: "kayloyal-DRAFT"
        },
        inclusionAccountTags: { type: Array, default: [] },
        exclusionAccountTags: { type: Array, default: [] },
        inclusionAccounts: { type: Array, default: [] },
        exclusionAccounts: { type: Array, default: [] },
        tags: {
            type: [String], // Array of strings
            required: true
        },
        sendToAccounts: { type: Object },
        date: { type: Date },
        customTemplates: { type: Array },
        mergeTemplate: { type: Object },
        mergeTags: { type: Array, default: [] },
        subjectData: { type: Array, default: [] },
        templateType: { type: String },
        sendScheduleType: { type: String },
        scheduledDate: { type: String },
        isSendTimeOptimized: { type: Boolean },
        isSmartSending: { type: Boolean },
        klaviyoScheduledCampaigns: { type: Object }
    },
    { timestamps: true }
)

// Check if the model exists before compiling it
export default mongoose.models?.Campaign || mongoose.model('Campaign', campaignSchema);