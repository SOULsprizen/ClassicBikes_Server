
const express=require('express')
const mongoose=require('mongoose')
const router=require('./Routes/Routes.js')
const app=express()
app.use(express.json())
const port=8080
 const mongoosedburl='mongodb+srv://abhinavr:Abhi145@ab1.n2khlb5.mongodb.net/'

 mongoose.connect(mongoosedburl)
    .then(() => console.log('mongoosedb connection successful'))
    .catch((e) =>console.log(e))
app.use('/',router)
    app.listen(port, () => console.log('server is running',port));
