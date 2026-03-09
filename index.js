const express = require("express");
const https = require("https");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
	const { webhookurl, payload } = req.body;
	if (!webhookurl || !webhookurl.startsWith("https://discord.com/api/webhooks/")) {
		return res.status(400).json({ error: "invalid webhook url" });
	}

	const body = JSON.stringify(payload);
	const url = new URL(webhookurl);

	const options = {
		hostname: url.hostname,
		path: url.pathname,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(body)
		}
	};

	const request = https.request(options, (response) => {
		res.status(response.statusCode).json({ success: true });
	});

	request.on("error", (e) => {
		res.status(500).json({ error: e.message });
	});

	request.write(body);
	request.end();
});

app.listen(process.env.PORT || 3000, () => console.log("proxy running"));
