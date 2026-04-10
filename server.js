import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";



connectDB();

// app.use('/api/auth',router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port : ${process.env.PORT || 3000}`);
});
 