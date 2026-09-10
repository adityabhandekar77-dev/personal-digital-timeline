const express = require("express");
const timelineRoutes = require("./routes/timelineRoutes");

const app = express();

app.use(express.json());

app.use("/api/timeline", timelineRoutes);

app.get("/", (req, res)=>{
    res.send("Personal Digital Timeline API");
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});