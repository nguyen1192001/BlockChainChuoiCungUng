const NhaCungCapmg = require('./model/NhaCungCapmg')
const fs = require('fs');

const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
let idProduct ;

const express = require('express')
const router = express.Router();

//[post] http://localhost:4000/NhaCungCap 
// create tempSignature

router.post('/', (req, res) => {
    let privatekey = req.body.privatekeyne;
    let publickey = req.body.publickeyne;
    // const data = {name : req.body.NameProduct , decrio}
    // console.log(data,publickey,privatekey)
    delete req.body.privatekeyne;
    delete req.body.publickeyne
    const data = req.body;
    
    
    var signature = function(signingkey){
        const hashTX = SHA256(JSON.stringify(data)).toString()
        const sig = signingkey.sign(hashTX, 'base64')
         return sig.toDER('hex')
    }
   
   
    let tempSignature = signature(ec.keyFromPrivate(privatekey));
    const chung = {tempSignature,data,publickey}
     res.send({tempSignature,data,publickey})
     const ncc = new NhaCungCapmg(chung)
    ncc.save()
        .then((data)=>{
            idProduct = data.id
            console.log("okkkkkkkkk")
        })
    
    res.send({data})
})



module.exports = router;