import mongoose, { Schema } from 'mongoose'



const passSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    uid: {
        type: String,
        required: true,
        unique: true,
        length: 7,
    },
    cardType: {
        type: String,
        required: true,
        enum: ['One-Time Use Cards', 'Loyalty Cards']
    },
    backgroundColor: {
        type: String,
    },
    textColor: {
        type: String,
    },
    images: {
        logo: {
            google: {
                type: String,
            }
        },
        strip: {
            google: {
                type: String,
            }
        },
        thumbnail: {
            type: String,
            required: false
        }
    },
    users: [{
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

export default mongoose.models?.Pass || mongoose.model('Pass', passSchema)