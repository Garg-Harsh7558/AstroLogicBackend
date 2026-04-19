import jwt from "jsonwebtoken";
import Chart from "../../../models/chart.model.js";
import User from "../../../models/user.model.js";

/**
 * Controller to delete a specific astrological profile.
 * Optimized to handle both the structured 'allchart' array and the string-based 'birthdetails' array.
 */
const deleteChart = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken._id;
        const profileName = req.body.name;

        if (!profileName) {
            return res.status(400).json({ message: "Profile name is required." });
        }

        // Optimized Operation: Run both deletions in parallel using atomic database commands
        const [chartUpdate, userUpdate] = await Promise.all([
            // 1. Remove from Chart model (object array)
            Chart.findOneAndUpdate(
                { userId: userId },
                { $pull: { allchart: { name: profileName } } },
                { returnDocument: 'after' }
            ),
            // 2. Remove from User model (string array using regex)
            User.findByIdAndUpdate(
                userId,
                { $pull: { birthdetails: { $regex: new RegExp(`^${profileName}=`) } } },
                { returnDocument: 'after' }
            )
        ]);

        if (!chartUpdate) {
            return res.status(404).json({ message: "Chart record not found." });
        }

        if (!userUpdate) {
            return res.status(404).json({ message: "User profile not found." });
        }

        return res.status(200).json({ 
            message: `Profile '${profileName}' deleted successfully from all records.`,
            remainingCharts: chartUpdate.allchart.length
        });

    } catch (error) {
        console.error("Delete Chart Error:", error);
        return res.status(500).json({ message: "Internal server error during deletion." });
    }
}

export default deleteChart;