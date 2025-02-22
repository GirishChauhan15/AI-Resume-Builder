import app from "./app.js";
import { dbConnect } from "./db/index.js";
import 'dotenv/config'

const port = process.env.PORT || 8000

dbConnect().then(()=>{
    app.on('error', (err)=>{
        // console.log('Error while connecting to server ', err)
    })
    app.listen(port, ()=>{
        // console.log(`Server is listening at http://localhost:${port}`)
    })
}).catch((err)=>{
    // console.log("Error while connecting to DB ", err)
})