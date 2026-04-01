import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
    res.send("Server Running...")
})

app.listen(port, ()=>{
    console.log(`Server running : http://localhost:${port}`);
})

