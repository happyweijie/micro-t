const express = require('express');
const cors = require('cors');
const xrpl = require('xrpl');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');

// --- Our Simple In-Memory Database ---
const db = {
  users: {}, // e.g., { 'creator-name': 'rXXXXXXX...' }
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the Micro-T Backend!');
});

app.post('/api/create-wallet', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
    }
    if (db.users[username]) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    await client.connect();
    console.log("Connected to Testnet for wallet creation");

    const newWallet = (await client.fundWallet()).wallet;
    console.log("Funded new wallet");

    await client.disconnect();
    console.log("Disconnected from Testnet");

    // --- Save user to our database ---
    db.users[username] = newWallet.address;
    console.log(`Saved user: ${username} with address: ${newWallet.address}`);
    console.log('Current DB:', db.users);

    res.status(200).json({
      address: newWallet.address,
      secret: newWallet.seed,
    });

  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).send('Failed to create wallet.');
    if (client.isConnected()) {
      await client.disconnect();
    }
  }
});

app.get('/api/creator/:username', (req, res) => {
  const { username } = req.params;
  const address = db.users[username];

  if (address) {
    console.log(`Found address for ${username}: ${address}`);
    res.status(200).json({ address: address });
  } else {
    console.log(`No user found for: ${username}`);
    res.status(404).json({ error: 'Creator not found.' });
  }
});


app.post('/api/create-trustline', (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Address is required.' });
  }

  // The raw transaction we want to sign
  const tx_json = {
    TransactionType: "TrustSet",
    Account: address,
    LimitAmount: {
      issuer: "rP9jPyP5kyvDBaLwALo8d9242mzsLi3pSA",
      currency: "RLD",
      value: "1000000000"
    }
  };

  // This is the correct, simple format for a generic sign request.
  // It tells the wallet "sign this transaction" without using the Xaman API.
  const payload = {
    "tx": tx_json
  };

  console.log(`Generated generic TrustSet payload for ${address}`);
  res.status(200).json(payload);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}` );
});