const User = require('../model/userModel');

const signupUser = async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        const user = await User.findOne({$or:[{email},{username}]});

        if(user) {return res.status(400).json({error:"user already exists"})}

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

       await newUser.save();
        if(newUser){
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password

            })
        }else{
            res.status(400).json({error: "invalid user data"})
        }
    }catch (error) {
        res.status(500).json({error: error})
        console.log(error);
    }
}

const loginUser = async (req,res)=>{
    try{
        res.send("login successfully!");
    }catch (error){
        console.log(error)
    }
}

module.exports = {
    signupUser,
    loginUser,
}
