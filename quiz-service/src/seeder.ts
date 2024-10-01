import mongoose from 'mongoose';
import Quiz from './models/Quiz';
import dotenv from 'dotenv';

dotenv.config();
const dummyQuizzes = Array.from({ length: 10 }, (_, quizIndex) => ({
    title: `Quiz ${quizIndex + 1}`,
    questions: Array.from({ length: 10 }, (_, questionIndex) => ({
        question: `Question ${questionIndex + 1} for Quiz ${quizIndex + 1}`,
        options: [`Option A`, `Option B`, `Option C`, `Option D`],
        answer: `Option A`, // Set a dummy correct answer
    })),
}));

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || ''); 
        await Quiz.deleteMany(); 
        await Quiz.insertMany(dummyQuizzes); 
        console.log('Database seeded!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
