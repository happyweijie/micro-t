# Micro-T: A Micropayments Tipping Platform on the XRP Ledger

**Micro-T** is a functional, non-custodial Minimum Viable Product (MVP) that enables content creators to receive instant, low-fee tips directly from their audience using the XRP Ledger (XRPL) and RLUSD stablecoin.

This project was built for the NUS Fintech Summit Hackathon. It directly addresses the challenge of leveraging XRPL's core features to solve a real-world financial problem.

---

## 🚀 The Problem

The creator economy is booming, but monetizing content through small tips ("micropayments") is fundamentally broken in traditional finance. When a fan wants to tip a creator $1.00, high transaction fees (e.g., 2.9% + $0.30) can consume over 30% of the value, making it impractical. This stifles a creator's ability to earn from casual supporters.

## ✨ Our Solution

Micro-T solves this by using the XRP Ledger, where transaction fees are fractions of a cent. Our platform provides two simple user flows:

1.  **For Creators:** A one-click process to generate a new, secure XRPL wallet and a unique, shareable tipping page (e.g., `yoursite.com/your-name`).
2.  **For Tippers:** A clean, simple tipping page where they can enter an amount and pay directly from their own wallet by scanning a single QR code.

The entire process is **non-custodial**, meaning the creator has sole control over their keys and funds from the moment their account is created.

---

## 🛠️ How We Used the XRP Ledger (Use of XRPL - 30%)

This project deeply integrates several core XRPL features, demonstrating a full-circle financial application.

*   **Low-Cost Transactions:** The entire business model is built on the XRPL's ability to settle transactions in 3-5 seconds for a cost of less than $0.001. This makes tipping $1, $0.50, or even $0.10 economically viable.

*   **Issued Currencies (RLUSD Integration):** We use **RLUSD**, a 1:1 USD-backed stablecoin, for all payments. This provides the stability of fiat currency while retaining the benefits of the blockchain. The payment QR code is specifically encoded to request payment in RLUSD.

*   **Account Generation & Funding:** The backend uses the `xrpl.js` library to programmatically generate a new wallet (`Wallet.generate()`) and fund it with test XRP using the Testnet Faucet (`client.fundWallet()`). This creates a ready-to-use account for the creator instantly.

*   **Trust Lines:** We correctly implemented the full Trust Line lifecycle, a critical concept for holding tokens on the XRPL.
    1.  The application guides the creator to sign a `TrustSet` transaction, enabling their wallet to receive RLUSD.
    2.  The tipping page fails gracefully if a tipper tries to send funds to a creator who has not yet set their Trust Line, enforcing the rules of the ledger.

*   **JSON-based QR Code Payloads:** Instead of relying on older URI schemes, we generate robust JSON payloads for all QR code interactions. This is the modern, standard way to request signatures for complex transactions (`TrustSet`) and payments (`Payment`) via wallets like Xaman, ensuring maximum compatibility and reliability.

---

## 📦 Completeness of Solution (30%) & Business Potential (20%)

This MVP is a complete, testable, end-to-end application that solves a clear business problem.

*   **Full User Lifecycle:** A user can create an account, configure it to receive tokens, and receive a payment from another user who visits their public page.
*   **Clear Path to Production:** The architecture is sound. To move to production (Mainnet), one would simply change the XRPL client URL and the RLUSD issuer details.
*   **Scalability:** The non-custodial nature means our platform doesn't hold user funds, dramatically reducing security overhead and liability as the user base grows.
*   **Market Fit:** The creator economy is a multi-billion dollar industry, and Micro-T provides a tangible tool that solves a direct pain point for millions of creators.

---

## 📋 How to Test the MVP

Our project consists of a Node.js backend and a React frontend.

### Prerequisites
*   Node.js and `npm` installed.
*   **Xaman (formerly Xumm)** wallet installed on your smartphone, set to the **XRPL Testnet**.
*   Two separate Testnet accounts funded via the [XRPL Testnet Faucet](https://xrpl.org/xrp-testnet-faucet.html ):
    1.  One account to act as the **Tipper**, which must also be funded with Testnet RLUSD from the [Official RLUSD Faucet](https://ripple.com/build/rlusd-faucet/ ).
    2.  One empty account slot in Xaman to import the new **Creator** wallet into.

### 1. Run the Backend

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Start the server
npm start
```
The backend will be running on http://localhost:3001.

### 2. Run the Frontend
```bash
# Open a new terminal and navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will open in your browser at http://localhost:3000.

### 3. The End-to-End Test Flow
1. Create a Creator Account: On the homepage, enter a username (e.g., "my-artist" ) and click "Create Account".
2. Import Creator Account: The app will show a new Address and Secret. In Xaman, add a new account by importing this secret ("Family Seed"). Make this new account the active one in Xaman.
3. Set the Creator's Trust Line: Back in the browser, click the "Next: Set RLUSD Trust Line" button. Scan the resulting QR code with Xaman (while controlling the creator's account) to sign the TrustSet transaction. The creator can now receive RLUSD.
4. Prepare to Tip: In Xaman, switch your active account back to your original "Tipper" account (the one with RLUSD).
5. Send the Tip: In the browser, navigate to the public tipping page (e.g., http://localhost:3000/my-artist ). Scan the payment QR code with Xaman. You will see a correct payment request. Approve it.
6. Congratulations, you've just sent a nearly-free, instant tip on the XRP Ledger!
