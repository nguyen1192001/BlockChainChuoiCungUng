const VanChuyenmg = require('./model/VanChuyenmg')
const ChainBlockmg = require('./model/ChainBlockmg')
const { Blockchain, Block, DataInBlock } = require('./blockChain')
const fs = require('fs');
const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')


const express = require('express')

const router = express.Router();


//[get] http://localhost:4000/NhaKiemDinh
// get data of VanChuyen
router.get('/', async (req, res) => {
    const data = await VanChuyenmg.find({});
    res.json(data)

})

//[post] http://localhost:4000/NhaKiemDinh/addBlockInChain
router.post('/addBlockInChain', async (req, res) => {
    const getdata = await VanChuyenmg.findById(req.body.id)
    const data = getdata.data
    const publicKey = getdata.publickey
    const signature = getdata.tempSignature
    const verify = ec.keyFromPublic(publicKey, 'hex')
    const result = verify.verify(SHA256(data).toString(), signature)
    res.send({ result })
    if (result) {

        let nongsan = new Blockchain()
        // console.log("id chainnn" ,)
        //  ChainBlockmg.findById(getdata[0].idChain,(err,data)=>{
        //     if(err) console.log(err)
        //     else console.log(data)
        //  })

         let chainmg = await ChainBlockmg.findById(getdata.idChain);
        
        // nếu trong data có nhiều chuỗi thì tìm cách lấy ra chuỗi phù hợp chứ không thể bỏ hẳn Chainmg[0] như này được


        for(let i = 1 ; i<chainmg.chuoiCungUng.length ; i++){
            const dataNhaCC = chainmg.chuoiCungUng[i].dataInBlock[0];
            nongsan.addBlock(dataNhaCC)
            nongsan.minePendingdata()
        }
         
        nongsan.addBlock(data)
        nongsan.minePendingdata()
        console.log(JSON.stringify(nongsan, null, 4))
        const chain = new ChainBlockmg({chuoiCungUng : nongsan.chain});

        console.log({chain})
        // await ChainBlockmg.findOneAndReplace(getdata.idChain , chain);
        // await ChainBlockmg.findOneAndReplace(chainmg,chain)
        console.log("id",getdata.idChain)
        delete chain._id;
         await ChainBlockmg.findByIdAndUpdate(getdata.idChain, {chuoiCungUng : chain.chuoiCungUng})
         // sáng mai làm tiếp cái nhấn 2 lần , h lưu xong rồi, đi ngủ á, buồn ngủ quá :))) để tắt máy cho :))

        //  await chain.save()

        await VanChuyenmg.findByIdAndRemove(req.body.id)
    } else {
        console.log("error")
    }
})



module.exports = router;