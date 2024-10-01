import mongoose from 'mongoose';


export interface User extends Document {
    username: string;
    password: string; 
}

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
export default User;
