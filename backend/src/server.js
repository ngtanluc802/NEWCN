// backend/src/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes")); 
app.use("/api/staff", require("./routes/staffRoutes")); 

// === SỬA LỖI Ở ĐÂY ===
// Đường dẫn /api/vehicles PHẢI trỏ đến file adminRoutes (chứa code đã sửa)
app.use("/api/vehicles", require("./routes/adminRoutes")); 
// === KẾT THÚC SỬA ===

app.use("/api/routes", require("./routes/routeRoutes"));
app.use("/api/schedules", require("./routes/scheduleRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/promotions", require("./routes/promotionRoutes"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));