const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChainBlockmg = new Schema({
    chuoiCungUng:{
        required:true,
        type:Schema.Types.Array,
    }
},{
    timestamps: true
})
module.exports = mongoose.model('ChainBlockmg',ChainBlockmg,'ChainBlockmg')