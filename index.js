const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
	const { webhookurl, payload } = req.body;
	if (!webhookurl || !webhookurl.startsWith("https://discord.com/api/webhooks/")) {
		return res.status(400).json({ error: "invalid webhook url" });
	}
	try {
		const response = await fetch(webhookurl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		res.status(response.status).json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.listen(process.env.PORT || 3000, () => console.log("proxy running"));
