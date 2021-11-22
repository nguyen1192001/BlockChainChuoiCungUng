const NhaCungCapmg = require('./model/NhaCungCapmg')
const ChainBlockmg = require('./model/ChainBlockmg')
const VanChuyenmg = require('./model/VanChuyenmg')
const fs = require('fs');
const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
let idChain;

const express = require('express')
const { Blockchain } = require('./blockChain');
const { getFips } = require('crypto');
const router = express.Router();


// [get] http://localhost:4000/VanChuyen
// get data for verify

router.get('/', async (req, res) => {
    const data = await NhaCungCapmg.find({})
    res.json(data)

})

//[post] http://localhost:4000/VanChuyen/addBlockInChain
router.post('/addBlockInChain', async (req, res) => {

    const getdata = await NhaCungCapmg.findById(req.body.id)
     console.log(">>>>>>>>>", getdata)
    const data = getdata.data
    const id = getdata.id
    const publicKey = getdata.publickey
    const signature = getdata.tempSignature
    const verify = ec.keyFromPublic(publicKey, 'hex')
    const result = verify.verify(SHA256(JSON.stringify(data)).toString(), signature)

    if (result) {
        let nongsan = new Blockchain()
        nongsan.addBlock(data, data.id = id)
        nongsan.minePendingdata()
        const chain = new ChainBlockmg({ chuoiCungUng: nongsan.chain });
        // console.log(JSON.stringify(nongsan, null, 4))

            

        await chain.save((req1, res1) => {
            NhaCungCapmg.findByIdAndUpdate(req.body.id,{idChain : res1.id}).then(()=>{console.log("ok ne")})
            res.send(res1.id)
            
        })

        
        //  const getidChain = await ChainBlockmg.find({})
        // res.send('day la id chain ne dmm')
         
        // // console.log(getidChain)
        // for (var i = 0; i < getidChain.length; i++) {
        //     const arr = getidChain[i].chuoiCungUng
        //     for (var j = 0; j < arr.length; j++) {
        //         //    console.log(arr[j].dataInBlock[0].id)
        //         if (arr[j].dataInBlock[0].id === id) {
        //              console.log(">>>>>>>>>",getidChain[i]._id)
        //             //  await NhaCungCapmg.findByIdAndRemove(req.body.id);
        // console.log("delete 2 ")
        //             res.send(getidChain[i]._id)
        //             console.log("delete")
        //         }
        //     }
        // }
       
        


    } else {
        res.send("error")
    }
})

//[post] http://localhost:4000/VanChuyen/idChain
// router.post('/idChain', async (req, res) => {
//     const id = req.body.id
//     console.log(">>>>>id:", id)
//     const getidChain = await ChainBlockmg.find({})
//     for (var i = 0; i < getidChain.length; i++) {
//         const arr = getidChain[i].chuoiCungUng
//         for (var j = 0; j < arr.length; j++) {
//             //    console.log(arr[j].dataInBlock[0].id)
//             if (arr[j].dataInBlock[0].id === id) {
//                 res.send(getidChain[i]._id)
//             }
//         }
//     }

// })

//[post] http://localhost:4000/VanChuyen
// create tempSignature
router.post('/', async (req, res) => {

    await NhaCungCapmg.findOneAndDelete({idChain : req.body.idChain})
    let privatekey = req.body.privatekey;
    let publickey = req.body.publickey
    let idChain = req.body.idChain
    delete req.body.privatekey
    delete req.body.publickey
    delete req.body.idChain
    const data = req.body

    var signature = function (signingkey) {
        const hashTX = SHA256(data).toString()
        const sig = signingkey.sign(hashTX, 'base64')
        return sig.toDER('hex')
    }
   
    let tempSignature = signature(ec.keyFromPrivate(privatekey));
    const chung = { tempSignature, data, publickey, idChain }
    console.log({ chung })
    res.send({ chung })
    const vc = new VanChuyenmg(chung)
    vc.save()
        .then(() => console.log("okkkkkkkkk"))
    res.send({ data })
})



module.exports = router;