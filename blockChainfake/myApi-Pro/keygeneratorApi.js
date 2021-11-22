const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const express = require('express')
const router = express.Router();

// ------------------------- CREATE KEY AND Digital Signature ---------------------- 

// http://localhost:4000/createKey
router.get('/', (req, res) => {
    const key = ec.genKeyPair();
    const publickey = key.getPublic('hex')
    const privatekey = key.getPrivate('hex')
    res.send({ publickey: publickey.toString('base64'), privatekey: privatekey.toString('base64') })
})

//http://localhost:4000/createKey/sign
router.post('/sign', (req, res) => {
    
    let privatekey = req.body.privatekey;
    const data = req.body.data;
    var signature = function(signingkey){
        const hashTX = SHA256(data).toString()
        const sig = signingkey.sign(hashTX, 'base64')
         return sig.toDER('hex')
    }
   
    let tempSignature = signature(ec.keyFromPrivate(privatekey));
     res.send({tempSignature,data})

})

// lỗi ở bước cuối cùng không biết lí do là sao ( Cannot read property '-1' of null)
//http://localhost:4000/createKey/verify
router.post('/verify',(req,res)=>{
    const data = req.body.data
    const publicKey = req.body.publickey
    const signature = req.body.signature
    const verify = ec.keyFromPublic(publicKey,'hex')
    const result = verify.verify(SHA256(data).toString(),signature)
    res.send({result})
    
})





module.exports = router;