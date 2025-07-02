import express, { urlencoded } from 'express'

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

const PORT = 3000

const roomData=[
    {
        rn:123,
        players:['a','b','c']
    }
]
    

app.listen(PORT)

app.get('/',(req,res)=>{
    res.json({msg:'Running !!!',name:'alok'})
})

app.get('/room/:rn',(req,res)=>{
    // rn is the room number and the people coming at this will be able to join the room
    // we create an object 
})
