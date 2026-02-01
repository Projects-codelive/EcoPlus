import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Post from './models/Post.js';
import User from './models/User.js';

dotenv.config();

const quizQuestions = [
    {
        questionText: "What percentage of global greenhouse gas emissions come from transportation?",
        options: ["10%", "14%", "24%", "35%"],
        correctOptionIndex: 2,
        subject: "Climate Change"
    },
    {
        questionText: "Which renewable energy source is the fastest growing globally?",
        options: ["Wind", "Solar", "Hydro", "Geothermal"],
        correctOptionIndex: 1,
        subject: "Renewable Energy"
    },
    {
        questionText: "How much CO2 does an average tree absorb per year?",
        options: ["10 kg", "22 kg", "48 kg", "100 kg"],
        correctOptionIndex: 2,
        subject: "Environment"
    },
    {
        questionText: "What is the most effective way to reduce your carbon footprint?",
        options: ["Recycling", "Using public transport", "Eating less meat", "Reducing air travel"],
        correctOptionIndex: 3,
        subject: "Sustainability"
    },
    {
        questionText: "Which country produces the most renewable energy?",
        options: ["China", "USA", "Germany", "India"],
        correctOptionIndex: 0,
        subject: "Renewable Energy"
    },
    {
        questionText: "What is the Paris Agreement's main goal?",
        options: [
            "Limit global warming to 1.5°C",
            "Ban fossil fuels by 2030",
            "Plant 1 trillion trees",
            "Reduce plastic waste"
        ],
        correctOptionIndex: 0,
        subject: "Climate Change"
    },
    {
        questionText: "How long does it take for a plastic bottle to decompose?",
        options: ["50 years", "100 years", "450 years", "1000 years"],
        correctOptionIndex: 2,
        subject: "Environment"
    },
    {
        questionText: "Which sector uses the most water globally?",
        options: ["Agriculture", "Industry", "Domestic use", "Energy production"],
        correctOptionIndex: 0,
        subject: "Sustainability"
    },
    {
        questionText: "What is the main cause of ocean acidification?",
        options: [
            "Plastic pollution",
            "CO2 absorption",
            "Oil spills",
            "Overfishing"
        ],
        correctOptionIndex: 1,
        subject: "Environment"
    },
    {
        questionText: "How much energy can LED bulbs save compared to incandescent bulbs?",
        options: ["25%", "50%", "75%", "90%"],
        correctOptionIndex: 2,
        subject: "Energy Efficiency"
    },
    {
        questionText: "Which gas is the primary contributor to global warming?",
        options: ["Methane", "Carbon Dioxide", "Nitrous Oxide", "Ozone"],
        correctOptionIndex: 1,
        subject: "Climate Change"
    },
    {
        questionText: "What percentage of the Earth's water is freshwater?",
        options: ["1%", "3%", "10%", "25%"],
        correctOptionIndex: 1,
        subject: "Environment"
    },
    {
        questionText: "Which appliance typically uses the most electricity in a home?",
        options: ["Refrigerator", "Air conditioner", "Water heater", "Television"],
        correctOptionIndex: 1,
        subject: "Energy Efficiency"
    },
    {
        questionText: "How many trees are needed to offset one person's annual carbon footprint?",
        options: ["5 trees", "15 trees", "31 trees", "100 trees"],
        correctOptionIndex: 2,
        subject: "Sustainability"
    },
    {
        questionText: "What is the most recycled material in the world?",
        options: ["Paper", "Plastic", "Glass", "Steel"],
        correctOptionIndex: 3,
        subject: "Recycling"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing questions
        await Question.deleteMany({});
        console.log('🗑️  Cleared existing questions');

        // Insert quiz questions
        const insertedQuestions = await Question.insertMany(quizQuestions);
        console.log(`✅ Inserted ${insertedQuestions.length} quiz questions`);

        // Check if there are any users to create sample posts
        const users = await User.find().limit(1);

        if (users.length > 0) {
            // Clear existing posts
            await Post.deleteMany({});
            console.log('🗑️  Cleared existing posts');

            // Create sample posts
            const samplePosts = [
                {
                    userId: users[0]._id,
                    content: "Just completed my first carbon footprint tracking! 🌱 Reduced my emissions by 15% this month by using public transport. Small steps make a big difference!",
                    images: [],
                    likes: [],
                    comments: []
                },
                {
                    userId: users[0]._id,
                    content: "Did you know? Switching to LED bulbs can save up to 75% energy! 💡 Just replaced all bulbs in my home. #SustainableLiving",
                    images: [],
                    likes: [],
                    comments: []
                },
                {
                    userId: users[0]._id,
                    content: "Planted 5 trees today with the local community! 🌳 Each tree will absorb about 48kg of CO2 per year. Let's make our planet greener!",
                    images: [],
                    likes: [],
                    comments: []
                }
            ];

            const insertedPosts = await Post.insertMany(samplePosts);
            console.log(`✅ Inserted ${insertedPosts.length} sample posts`);
        } else {
            console.log('⚠️  No users found. Create a user account first to see sample posts.');
        }

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Quiz Questions: ${insertedQuestions.length}`);
        console.log(`   - Sample Posts: ${users.length > 0 ? 3 : 0}`);
        console.log('\n💡 You can now:');
        console.log('   1. Take quizzes in the app');
        console.log('   2. View posts in the social feed');
        console.log('   3. Create your own posts and content');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// Run the seed function
seedDatabase();
