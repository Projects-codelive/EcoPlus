
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

const questions = [
    { questionText: "Which gas is most abundant in the Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], correctOptionIndex: 1 },
    { questionText: "What is the primary cause of global warming?", options: ["Deforestation", "Volcanic Eruptions", "Fossil Fuels", "Solar Flares"], correctOptionIndex: 2 },
    { questionText: "Which sector produces the most greenhouse gas emissions?", options: ["Agriculture", "Transportation", "Energy", "Industry"], correctOptionIndex: 2 },
    { questionText: "What is the main greenhouse gas emitted by human activities?", options: ["Methane", "Carbon Dioxide", "Nitrous Oxide", "Ozone"], correctOptionIndex: 1 },
    { questionText: "Which country currently emits the most CO2?", options: ["USA", "China", "India", "Russia"], correctOptionIndex: 1 },
    { questionText: "What agreement was signed in 2015 to combat climate change?", options: ["Kyoto Protocol", "Paris Agreement", "Copenhagen Accord", "Montreal Protocol"], correctOptionIndex: 1 },
    { questionText: "Which renewable energy source relies on the moon's gravity?", options: ["Solar", "Wind", "Tidal", "Geothermal"], correctOptionIndex: 2 },
    { questionText: "What percentage of the Earth's water is fresh water?", options: ["3%", "10%", "25%", "50%"], correctOptionIndex: 0 },
    { questionText: "Which diet has the lowest carbon footprint?", options: ["Paleo", "Vegan", "Vegetarian", "Pescatarian"], correctOptionIndex: 1 },
    { questionText: "What is the process of capturing and storing atmospheric CO2 called?", options: ["Carbon Copying", "Carbon Sequestration", "Carbon Dating", "Carbon Trading"], correctOptionIndex: 1 },
    { questionText: "Which of these is NOT a fossil fuel?", options: ["Coal", "Uranium", "Natural Gas", "Oil"], correctOptionIndex: 1 },
    { questionText: "How much has the global temperature risen since the late 19th century?", options: ["0.5°C", "1.1°C", "2.0°C", "3.5°C"], correctOptionIndex: 1 },
    { questionText: "What is 'The Great Pacific Garbage Patch' mostly made of?", options: ["Metal", "Glass", "Plastic", "Paper"], correctOptionIndex: 2 },
    { questionText: "Which animal is most threatened by melting sea ice?", options: ["Penguin", "Polar Bear", "Seal", "Whale"], correctOptionIndex: 1 },
    { questionText: "What does 'net zero' mean?", options: ["Zero emissions", "Balancing emissions with removal", "No new factories", "Stopping all travel"], correctOptionIndex: 1 },
    { questionText: "Which household item typically consumes the most electricity?", options: ["Fridge", "Lighting", "Heating/Cooling", "TV"], correctOptionIndex: 2 },
    { questionText: "What is the best way to reduce plastic waste?", options: ["Recycling", "Burning", "Reducing & Reusing", "Burying"], correctOptionIndex: 2 },
    { questionText: "How long does a plastic bottle take to decompose?", options: ["50 years", "100 years", "450 years", "1000 years"], correctOptionIndex: 2 },
    { questionText: "Which of these gases traps the most heat per molecule?", options: ["CO2", "Methane", "Water Vapor", "Nitrous Oxide"], correctOptionIndex: 1 },
    { questionText: "What is the term for cities getting hotter than rural areas?", options: ["Heat Wave", "Urban Heat Island", "Global Warming", "Greenhouse Effect"], correctOptionIndex: 1 }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for Seeding');
        await Question.deleteMany({});
        await Question.insertMany(questions);
        console.log('Questions Seeded');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
