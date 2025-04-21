// src/components/InputArea.jsx
import React, { useState } from 'react';
import { Stack, TextField, PrimaryButton, IconButton, TooltipHost } from '@fluentui/react';
import { MicOffIcon, MicOnIcon } from '@fluentui/react-icons-mdl2';

const InputArea = ({ onSend, onRecord, recording, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Stack horizontal tokens={{ childrenGap: 10 }}>
      <TextField
        value={input}
        onChange={(_, newVal) => setInput(newVal)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        multiline
        resizable={false}
        disabled={disabled}
        styles={{
          fieldGroup: { minHeight: 36, width: '100%' },
          field: { padding: '8px' },
        }}
      />
      <TooltipHost content={recording ? 'Stop Recording' : 'Start Recording'}>
        <IconButton
          iconProps={{ iconName: recording ? 'MicrophoneOff' : 'Microphone' }}
          onClick={onRecord}
          disabled={disabled}
          styles={{
            root: {
              backgroundColor: recording ? '#c50f1f' : '#0078d4',
              color: 'white',
            },
            rootHovered: {
              backgroundColor: recording ? '#a80000' : '#005a9e',
            },
          }}
        />
      </TooltipHost>
      <PrimaryButton
        text="Send"
        onClick={handleSend}
        disabled={disabled || !input.trim()}
      />
    </Stack>
  );
};

export default InputArea;
