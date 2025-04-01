const express = require("express");
const sequelize = require("./config/database");
const logger = require("./config/logger");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productsRoutes = require("./routes/productsRoutes");
const customerRoutes = require("./routes/customerRoutes");
const sliderRoutes = require("./routes/sliderRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());

// Use body-parser middleware
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/category", categoryRoutes);
app.use("/products", productsRoutes);
app.use("/customer", customerRoutes);
app.use("/slider", sliderRoutes);
app.use("/mpesa", mpesaRoutes);
app.use("/stripe", stripeRoutes);
app.use("/order", orderRoutes);

// Log each request
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.url}`);
	next();
});

app.get("/", (req, res) => {
	res.send("Server running");
});

// Test DB connection and start server
sequelize
	.authenticate()
	.then(() => console.log("Database connected..."))
	.catch((err) => console.log("Error: " + err));

sequelize.sync().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
