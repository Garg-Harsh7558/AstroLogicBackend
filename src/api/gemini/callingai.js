import { main } from "./genai.js";

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
        const feildtoconsider="----IMPORTANT----TO----CONSIDER------planetary positions,conjuctions,divisional charts,nakshatras,yogas,planetary aspects,Planet Transits(gochar),planet exaltion,debilitation,Current Mahadasha,benefic planets,neechbhhanga yoga,vipreet raja yoga,Rahu-Ketu dispositor for rahu-ketu strength,planet combustion,planet retro,planet degree,planetary friendship relation and any other things to consider------------"
const datainstruction="give response strictly in string format with line breaks with '#0#0' only and wrap bullet points inside **...** only and dont use over explanation for the response just give efficient and easy to understand and not to short to fall under the confusion by the user but if user ask the detailed response then give it in detail"
        console.log("Requesting AI with prompt:", prompt);
        const aiResponse = await main(feildtoconsider+prompt + datainstruction);
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
