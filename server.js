const express = require("express");
const SneaksAPI = require("sneaks-api");
const cors = require("cors");

const app = express();
const port = 5004;
const sneaks = new SneaksAPI();

// Middleware
app.use(cors());
app.use(express.json());

// Default Route (Fix "Cannot GET /" Issue)
app.get("/", (req, res) => {
    res.send("Welcome to the Sneaker API Backend!");
});

// API Route to Get Sneakers by Keyword
app.get("/sneakers/:keyword", (req, res) => {
    const keyword = req.params.keyword;
    sneaks.getProducts(keyword, 30, (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        const formattedData = products.map(shoe => ({
            id: shoe.styleID, // Unique ID
            img: shoe.thumbnail, // Image
            name: shoe.shoeName, // Name
            content: shoe.brand, // Brand info as content
            price: shoe.retailPrice || "N/A" // Price (if available)
        }));
        // res.json(products);
        res.json(formattedData);
    });
});

// API Route to Get Sneaker Prices by Style ID
app.get("/sneaker-prices/:styleID", (req, res) => {
    const styleID = req.params.styleID;
    sneaks.getProductPrices(styleID, (err, product) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(product);
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
