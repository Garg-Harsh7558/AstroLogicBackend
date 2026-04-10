import { main } from "../genai.js";

/**
 * Controller to handle AI prompt requests
 */
const historyArray=[];

const callingAIController = async (req, res) => {
    try {
        const { prompt } = req.body || req.query;
        
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        console.log("Requesting AI with prompt:", prompt);
        const aiResponse = await main(prompt);
        return res.status(200).json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        console.error("CallingAI Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to get AI response",
            error: error.message
        });
    }
};

export default callingAIController;
