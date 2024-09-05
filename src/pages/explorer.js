import { useState } from 'react';
import Link from 'next/link';
export default function Explorer() {
  const protocols = [
    {
      protocol: 'http://contribution-reward-protocol.xyz',
      json: `{
  "protocol": "http://contribution-reward-protocol.xyz",
  "published": true,
  "types": {
    "contribution": {
      "schema": "contribution",
      "dataFormats": ["application/json"]
    },
    "reward": {
      "schema": "reward",
      "dataFormats": ["application/json"]
    }
  },
  "structure": {
    "contribution": {
      "$actions": [{
        "who": "anyone",
        "can": ["create", "update"]
      }]
    },
    "reward": {
      "$actions": [{
        "who": "author",
        "of": "contribution",
        "can": ["read"]
      }]
    }
  }
}`,
    },
    {
      protocol: 'http://chat-protocol.xyz',
      json: `{
  "protocol": "http://chat-protocol.xyz",
  "published": true,
  "types": {
    "thread": {
      "schema": "thread",
      "dataFormats": ["application/json"]
    },
    "message": {
      "schema": "message",
      "dataFormats": ["application/json"]
    }
  },
  "structure": {
    "thread": {
      "$actions": [{
        "who": "anyone",
        "can": ["create", "update"]
      },
      {
        "who": "author",
        "of": "thread",
        "can": ["read"]
      },
      {
        "who": "recipient",
        "of": "thread",
        "can": ["read"]
      }],
      "message": {
        "$actions": [{
          "who": "anyone",
          "can": ["create", "update"]
        },
        {
          "who": "author",
          "of": "thread/message",
          "can": ["read"]
        },
        {
          "who": "recipient",
          "of": "thread/message",
          "can": ["read"]
        }]
      }
    }
  }
}`,
    },
    {
      protocol: 'http://email-protocol.xyz',
      json: `{
  "protocol": "http://email-protocol.xyz",
  "published": true,
  "types": {
    "email": {
      "schema": "email",
      "dataFormats": ["text/plain"]
    }
  },
  "structure": {
    "email": {
      "$actions": [{
        "who": "anyone",
        "can": ["create"]
      },
      {
        "who": "author",
        "of": "email",
        "can": ["read"]
      },
      {
        "who": "recipient",
        "of": "email",
        "can": ["read"]
      }],
      "email": {
        "$actions": [{
          "who": "anyone",
          "can": ["create"]
        },
        {
          "who": "author",
          "of": "email/email",
          "can": ["read"]
        },
        {
          "who": "recipient",
          "of": "email/email",
          "can": ["read"]
        }]
      }
    }
  }
}`,
    },
  ];

  const [visibleProtocols, setVisibleProtocols] = useState(protocols.map(() => false));
  const [copySuccess, setCopySuccess] = useState('');

  const toggleVisibility = (index) => {
    const updatedVisibility = [...visibleProtocols];
    updatedVisibility[index] = !updatedVisibility[index];
    setVisibleProtocols(updatedVisibility);
  };

  const handleCopy = (json) => {
    navigator.clipboard.writeText(json).then(() => {
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2 seconds
    });
  };

  return (
    <div style={styles.container}>
        <nav style={styles.navbar}>
      <Link href="/" style={styles.navLink}>
        Home
      </Link>
      <Link href="/explorer" style={styles.navLink}>
        Protocol Explorer
      </Link>
    </nav>
      <h1 style={styles.header}>Protocol Explorer</h1>

      {protocols.map((protocol, index) => (
        <div key={index} style={styles.protocolCard}>
          <div style={styles.protocolHeader}>
            <h3>{protocol.protocol}</h3>
            <button style={styles.toggleButton} onClick={() => toggleVisibility(index)}>
              {visibleProtocols[index] ? 'Hide' : 'Show'}
            </button>
          </div>

          {visibleProtocols[index] && (
            <>
              <pre style={styles.protocolJson}>{protocol.json}</pre>
              <button style={styles.copyButton} onClick={() => handleCopy(protocol.json)}>
                Copy JSON
              </button>
            </>
          )}
        </div>
      ))}

      {copySuccess && <span style={styles.copySuccess}>{copySuccess}</span>}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
  },
  navbar: {
    marginBottom: '20px',
    backgroundColor: '#007bff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '5px 10px',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  protocolCard: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  protocolHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  protocolJson: {
    background: '#f4f4f4',
    padding: '10px',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap',
    fontSize: '14px',
    overflowX: 'auto',
    marginTop: '10px',
  },
  copyButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
  copySuccess: {
    color: 'green',
    fontSize: '14px',
    marginTop: '10px',
    display: 'block',
  },
};
