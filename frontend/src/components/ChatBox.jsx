// src/components/ChatBox.jsx
import React from 'react';
import { Stack, MessageBar, MessageBarType, Text } from '@fluentui/react';
import { Spinner } from '@fluentui/react';

const ChatBox = ({ messages, loading, darkMode }) => {
  return (
    <div style={{
      backgroundColor: darkMode ? '#252423' : '#f3f2f1',
      padding: '1rem',
      borderRadius: '8px',
      maxHeight: '60vh',
      overflowY: 'auto',
      border: '1px solid #ddd'
    }}>
      <Stack tokens={{ childrenGap: 10 }}>
        {messages.map((msg, index) => (
          <MessageBar
            key={index}
            messageBarType={msg.sender === 'User' ? MessageBarType.severeWarning : MessageBarType.info}
            isMultiline
            truncated={false}
            styles={{
              root: {
                backgroundColor: msg.sender === 'User'
                  ? (darkMode ? '#323130' : '#fce100')
                  : (darkMode ? '#201f1e' : '#e1dfdd'),
              },
            }}
          >
            <Text variant="small">{msg.sender} ({msg.timestamp}):</Text>
            <div style={{ marginTop: 4 }}>{msg.text}</div>
          </MessageBar>
        ))}
        {loading && (
          <Spinner label="Generating response..." />
        )}
      </Stack>
    </div>
  );
};

export default ChatBox;
