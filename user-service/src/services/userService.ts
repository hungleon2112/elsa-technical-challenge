import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Service to register a new user
export const registerUser = async (username: string, password: string) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Username already exists'); 
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
};

// Service to login a user
export const loginUser = async (username: string, password: string) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials (password)');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'BT2eX2HJ3c71FNJ1HGbCWoH37rwU6LxLTwRhU4A60oPCeX16dhycIyqH3bWac2T7', { expiresIn: '1h' });

    return { token, userId: user._id };
};

// Service to get users by an array of user IDs
export const getUsersByIds = async (userIds: string[]) => {
    return await User.find({ _id: { $in: userIds } }); // Fetch users based on IDs
};
