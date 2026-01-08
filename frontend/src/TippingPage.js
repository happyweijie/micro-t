import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // Import the QR code component

// (Make sure your styles object is here)
const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      color: 'white',
    },
    tipBox: {
      padding: '2rem',
      border: '1px solid #555',
      borderRadius: '8px',
      backgroundColor: '#3a3f4a',
      width: '350px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    h2: { marginTop: 0 },
    input: {
        width: 'calc(100% - 22px)',
        padding: '10px',
        margin: '1rem 0',
        borderRadius: '4px',
        border: '1px solid #777',
        backgroundColor: '#2c3038',
        color: 'white',
        fontSize: '1rem',
    },
    qrCodeContainer: {
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        display: 'inline-block',
        marginTop: '1rem',
    },
    loadingText: {
        fontStyle: 'italic',
        color: '#ccc',
    }
};

function TippingPage() {
  const { username } = useParams();
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState('1'); // Default tip amount of 1 RLUSD

  useEffect(() => {
    // This function runs when the component loads
    const fetchCreatorAddress = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/creator/${username}` );
        if (!response.ok) {
          throw new Error('Creator not found');
        }
        const data = await response.json();
        setAddress(data.address);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorAddress();
  }, [username]); // Re-run if the username in the URL changes

  const getPaymentPayload = () => {
      if (!address || !amount || parseFloat(amount) <= 0) return null;

      // The raw transaction we want the tipper to sign
      const tx_json = {
        TransactionType: "Payment",
        Destination: address, // The creator's address
        Amount: {
          issuer: "rP9jPyP5kyvDBaLwALo8d9242mzsLi3pSA",
          currency: "524C555344000000000000000000000000000000", // Correct RLUSD hex
          value: amount.toString() // The amount from the input box
        }
      };

      // The generic payload format that we know works
      return {
        "tx": tx_json
      };
    };

    const paymentPayload = getPaymentPayload();

  // --- Render Logic ---
  if (isLoading) {
    return <div style={styles.container}><p style={styles.loadingText}>Loading creator details...</p></div>;
  }

  if (error) {
    return <div style={styles.container}><div style={styles.tipBox}><h2>Error</h2><p>{error}</p></div></div>;
  }

   return (
    <div style={styles.container}>
      <div style={styles.tipBox}>
        <h2 style={styles.h2}>Send a tip to {username}</h2>
        
        <label htmlFor="amount">Amount (RLUSD)</label>
        <input
          type="number"
          id="amount"
          style={styles.input}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.1"
          step="0.1"
        />

        {/* THIS IS THE SECOND PART OF THE FIX */}
        {paymentPayload && (
          <div style={styles.qrCodeContainer}>
            {/* We now stringify the JSON object, just like in the working file */}
            <QRCodeSVG value={JSON.stringify(paymentPayload)} size={256} />
          </div>
        )}
        <p>Scan with a compatible XRPL wallet (like Xaman).</p>
      </div>
    </div>
  );
}

export default TippingPage;
