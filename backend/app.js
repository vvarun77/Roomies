const express = require('express');
const { createClerkClient } = require('@clerk/clerk-sdk-node');
var cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

// Initialize Clerk client
app.use(express.json()); // Parse JSON request bodies

app.post('/createUser', (req, res) => {
    try {
        client = createClerkClient({secretKey: "sk_test_mRxO1J7Wy4ea8bbTK71socEYQEcP48mud9xjNdtN5s"})
        client.users.createUser({
            emailAddress: [req.body.email],
            password: req.body.userpassword,
        });
        res.json({ status: "success" , email: req.body.email, password: req.body.userpassword });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error" });
    }
});

app.listen(port, () => console.log(`API listening at https://localhost:${port}`));
