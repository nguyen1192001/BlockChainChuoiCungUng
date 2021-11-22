const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NhaCungCapmg = new Schema({
    tempSignature: {
        required: true,
        type: Schema.Types.String
    },
    publickey: {
        required: true,
        type: Schema.Types.String
    },
    data: { type: Object },
    idChain: { type: String }
}, {
    timestamps: true
})
module.exports = mongoose.model('NhaCungCapmg', NhaCungCapmg, 'NhaCungCapmg')