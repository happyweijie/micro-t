import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Make sure this import is here

// The styles object from before.
const styles = {
    container: {
      padding: '2rem',
      border: '1px solid #555',
      borderRadius: '8px',
      backgroundColor: '#3a3f4a',
      marginTop: '2rem',
      width: '350px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
    },
    input: {
      width: 'calc(100% - 22px)',
      padding: '10px',
      marginBottom: '1rem',
      borderRadius: '4px',
      border: '1px solid #777',
      backgroundColor: '#2c3038',
      color: 'white',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#61dafb',
      color: 'black',
      fontSize: '1.1rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginTop: '1rem',
    },
    label: {
      textAlign: 'left',
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      color: '#ccc',
    },
    h2: {
      marginTop: '0',
    },
    resultsContainer: {
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#2c3038',
        borderRadius: '8px',
        textAlign: 'left',
        wordWrap: 'break-word',
    },
    secretWarning: {
        color: '#ffc107',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    qrCodeContainer: {
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        display: 'inline-block',
        margin: '1rem 0',
    }
  };


function CreatorSignUp() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [xamanPayload, setXamanPayload] = useState(null); // New state for QR code data

  const handleSignUp = async () => {
    if (!username) {
      alert('Please enter a username.');
      return;
    }
    setIsLoading(true);
    setWallet(null);
    try {
      const response = await fetch('http://localhost:3001/api/create-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username } ),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWallet(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert(`A user with that username may already exist. Please try another.`);
    } finally {
      setIsLoading(false);
    }
  };

  // This is the new function to handle the Trust Line button click
  const handleSetTrustLine = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/create-trustline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: wallet.address } ),
      });
      const data = await response.json();
      setXamanPayload(data);
    } catch (error) {
      console.error("Failed to create TrustLine payload:", error);
      alert('Failed to prepare TrustLine. See console.');
    }
  };

  // This is the FIRST new screen to show the TrustLine QR code
  if (xamanPayload) {
    return (
        <div style={styles.container}>
            <h2 style={styles.h2}>Set Trust Line</h2>
            <p>Scan this with xaman to add the RLUSD token to your new wallet.</p>
            <div style={styles.qrCodeContainer}>
                <QRCodeSVG value={JSON.stringify(xamanPayload)} size={256} />
            </div>
            <button style={styles.button} onClick={() => setXamanPayload(null)}>
                Back
            </button>
        </div>
    )
  }

  // This is the SECOND screen, the one that shows after creating an account.
  // It has the new button.
  if (wallet) {
    return (
        <div style={styles.container}>
            <h2 style={styles.h2}>Account Created!</h2>
            <div style={styles.resultsContainer}>
                <p style={styles.secretWarning}>
                    IMPORTANT: Save your secret key now.
                </p>
                <p><strong>Address:</strong> {wallet.address}</p>
                <p><strong>Secret:</strong> {wallet.secret}</p>
            </div>
            <button style={styles.button} onClick={handleSetTrustLine}>
                Next: Set RLUSD Trust Line
            </button>
        </div>
    )
  }

  // This is the THIRD and default screen: the main sign-up form.
  return (
    <div style={styles.container}>
      <h2 style={styles.h2}>Create Your Account</h2>
      <label htmlFor="username" style={styles.label}>Username</label>
      <input
        type="text"
        id="username"
        style={styles.input}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="your-creator-name"
        disabled={isLoading}
      />
      <button
        style={{...styles.button, opacity: isLoading ? 0.6 : 1}}
        onClick={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create Account'}
      </button>
    </div>
  );
}

export default CreatorSignUp;
