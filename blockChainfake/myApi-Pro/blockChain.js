const SHA256 = require('crypto-js/sha256')
const Blockmgfake = require('./model/ChainBlockmg')

class Block {
    constructor(timestamp, dataInBlock, previousHash = "") {
            this.timestamp = timestamp,
            this.dataInBlock = dataInBlock,
            this.previousHash = previousHash,
            this.hash = this.calculaterHash()
    }

    calculaterHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.dataInBlock)).toString()
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.pendingdata = []
    }
    createGenesisBlock() {
        return new Block("1/1/2001",[{data:'some thing data'}], "0")
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }
    
    addBlock(dataInBlock){

            this.pendingdata.push(dataInBlock)
    }

    minePendingdata(){
            let block = new Block(Date.now().toString(),this.pendingdata,this.getLatestBlock().hash)
            this.chain.push(block)
            this.pendingdata = []
    }
   

    getAlldataOnChain() {
       
        for (let i = 1; i < this.chain.length; i++) {
            console.log(this.chain[i].data)
        }
       
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]
           
            if (currentBlock.hash !== currentBlock.calculaterHash()) {
                return false
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }
        return true
    }
    
}

module.exports.Blockchain = Blockchain
module.exports.Block = Block
