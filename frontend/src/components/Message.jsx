import React from 'react';

const Message = ({ message, isUser }) => {
    return (
        <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
            <p>{message}</p>
        </div>
    );
};

export default Message;