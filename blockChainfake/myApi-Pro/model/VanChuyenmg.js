const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VanChuyenmg = new Schema({
    tempSignature: {
        required: true,
        type: Schema.Types.String
    },
    publickey: {
        required: true,
        type: Schema.Types.String
    },
    data: { type: Object },
    idChain: { required: true,type: String }
}, {
    timestamps: true
})
module.exports = mongoose.model('VanChuyenmg', VanChuyenmg, 'VanChuyenmg')