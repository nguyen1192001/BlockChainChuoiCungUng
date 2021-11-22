const express = require('express')
const app = express()
const port = 4000
const {Blockchain,Block} = require('./blockChain')
const fs = require('fs')
const db = require('./config')
const cors = require('cors');
app.use(cors());
db.connect()



// let nongsan1 = new Blockchain()
// const datakhoi1 = {name:"rau hanh",description:"rat la ngon"}
// nongsan1.addBlock(datakhoi1)
// nongsan1.minePendingdata()
// console.log(JSON.stringify(nongsan1, null, 4))


app.use(express.urlencoded({ extended: false }))   
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
     next();
});   
const nhacungcapRouter = require('./NhaCungCap')
const keygeneratorRouter = require('./keygeneratorApi')
const nhakiemdinhRouter = require('./NhaKiemDinh')
const vanchuyenRouter = require('./VanChuyen')
const truyxuatnRouter = require('./TruyXuat')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/createKey',keygeneratorRouter)
app.use('/nhacungcap',nhacungcapRouter)
app.use('/nhakiemdinh',nhakiemdinhRouter)
app.use('/vanchuyen',vanchuyenRouter)
app.use('/truyxuat',truyxuatnRouter)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

