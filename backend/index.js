import express, { urlencoded } from 'express'

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

const PORT = 3000

app.listen(PORT)

app.get('/',(req,res)=>{
    res.json({msg:'Running !!!',name:'alok'})
})