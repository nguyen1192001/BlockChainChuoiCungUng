const VanChuyenmg = require('./model/VanChuyenmg')
const ChainBlockmg = require('./model/ChainBlockmg')
const { Blockchain, Block, DataInBlock } = require('./blockChain')



const express = require('express')

const router = express.Router();


//[get] http://localhost:4000/truyxuat
// get data of VanChuyen
router.get('/', async (req, res) => {
    const data = await ChainBlockmg.find({});
    res.json(data)

})

router.get('/:id',async(req,res)=>{
    const data = await ChainBlockmg.findById(req.params.id)
    res.json(data)
})

//[post] http://localhost:4000/NhaKiemDinh/addBlockInChain




module.exports = router;