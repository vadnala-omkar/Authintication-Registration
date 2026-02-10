const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(bodyParser.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('Connected to MongoDB'))
.catch((err)=> console.log('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
    username:{type: String, required: true, unique: true},
    password:{type:String, required: true}
})
const User = mongoose.model('User', userSchema);
app.post('/register', async(req, res)=>{
    const {username, password} = req.body;
    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            console.log('Username already exists');
            return res.status(400).json({message: 'Username already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, password: hashedPassword});
        await newUser.save();
        console.log('User registered successfully', newUser);
        res.status(201).json({message: 'User registered successfully'})
    }catch(err){
        console.log('Error registering user:', err);
        res.status(500).json({message: 'Error registering user', error: err});
    }
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);
