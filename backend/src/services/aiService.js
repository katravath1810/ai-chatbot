const axios = require('axios');

class AIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.example.com/ai'; // Replace with actual AI service URL
    }

    async processInput(userInput) {
        try {
            const response = await axios.post(this.apiUrl, {
                prompt: userInput,
                max_tokens: 150, // Adjust as needed
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data.choices[0].text.trim();
        } catch (error) {
            console.error('Error processing input:', error);
            throw new Error('AI service is currently unavailable.');
        }
    }
}

module.exports = new AIService(process.env.AI_API_KEY); // Ensure AI_API_KEY is set in .env file