import React from 'react'

const RemoteButton: React.FC = () => {
  return (
    <button
      style={{
        padding: '10px 16px',
        borderRadius: '6px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={() => alert('Hello from Remote App!')}
    >
      Remote Button
    </button>
  )
}

export default RemoteButton
