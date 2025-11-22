import React, { useState, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

// Sparkle Icon for loading
const SparkleIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C10.12 6.42 11.474 5.625 12.98 5.625c1.507 0 2.86.795 3.665 1.959a.75.75 0 01-1.22.868c-.604-.82-1.628-1.327-2.445-1.327-.817 0-1.841.507-2.445 1.327a.75.75 0 01-1.22-.868zM12.98 12.75c.817 0 1.841.507 2.445 1.327a.75.75 0 11-1.22.868c-.604-.82-1.628-1.327-2.445-1.327-.817 0-1.841.507-2.445 1.327a.75.75 0 01-1.22-.868c.604-.82 1.628-1.327 2.445-1.327zM12.98 18.375c.817 0 1.841.507 2.445 1.327a.75.75 0 11-1.22.868c-.604-.82-1.628-1.327-2.445-1.327-.817 0-1.841.507-2.445 1.327a.75.75 0 11-1.22-.868c.604-.82 1.628-1.327 2.445-1.327z"
      clipRule="evenodd"
    />
  </svg>
);

// Close Icon
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Send Icon
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// System prompt for the Gemini API
const systemPrompt = `You are PocketPal, a friendly and helpful AI assistant for the "Pocket Money Manager" web app.
Your role is to answer user questions about their finances and how to use the app.
The app has three main sections:
1.  **Dashboard**: Shows current balance, total income vs. expenses, and a list of recent transactions.
2.  **Transactions**: Allows users to add new income or expense transactions (with a description, amount, type, and category). It also shows a complete history of all transactions, which can be edited or deleted.
3.  **Analytics**: Displays a pie chart visualizing spending habits by category.

Keep your answers concise, friendly, and focused on helping the user manage their money within this app.
If the user asks something unrelated to finance or the app, gently guide them back on topic.
Do not make up features that don't exist.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm PocketPal. Ask me anything about using the app or managing your finances!",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For typing indicator
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || 'light';
  const chatEndRef = useRef(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // --- API Call to Gemini ---
  const getGeminiResponse = async (userMessage, chatHistory) => {
    setIsLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    if (!apiKey) {
      setIsLoading(false);
      return "I'm sorry, but the Gemini API key is not configured. Please add your API key to the .env file as VITE_GEMINI_API_KEY. You can get a free API key from https://aistudio.google.com/app/apikey";
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // Convert message history to Gemini format
    const contents = [
      ...chatHistory.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    };

    try {
      // Add exponential backoff for retries
      let response;
      let retries = 3;
      let delay = 1000;
      for (let i = 0; i < retries; i++) {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          break; // Success
        }
        if (response.status === 429 || response.status >= 500) {
          // Retry on rate limit or server error
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          break; // Don't retry on other errors (e.g., 400)
        }
      }

      if (!response.ok) {
        console.error(
          'Gemini API Error:',
          response.status,
          await response.text()
        );
        return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return "I'm not sure how to respond to that. Could you try rephrasing?";
      }
      return text;
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      return "I'm sorry, I couldn't connect to my brain. Please check your connection and try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessageText = inputValue;
    setInputValue(''); // Clear input immediately

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: userMessageText,
    };

    // Pass current messages *before* adding the new user one for history
    const currentChatHistory = [...messages];
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Get and add bot response from Gemini
    const botResponseText = await getGeminiResponse(
      userMessageText,
      currentChatHistory
    );

    const botMessage = {
      id: messages.length + 2,
      sender: 'bot',
      text: botResponseText,
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 sm:w-96 h-96 sm:h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-40 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-semibold text-lg">PocketPal Assistant</h3>
            <button
              onClick={toggleChat}
              className="p-1 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg shadow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 ${
                        theme === 'dark' ? 'bg-white' : 'bg-gray-600'
                      } rounded-full animate-pulse [animation-delay:-0.3s]`}
                    ></div>
                    <div
                      className={`w-2 h-2 ${
                        theme === 'dark' ? 'bg-white' : 'bg-gray-600'
                      } rounded-full animate-pulse [animation-delay:-0.15s]`}
                    ></div>
                    <div
                      className={`w-2 h-2 ${
                        theme === 'dark' ? 'bg-white' : 'bg-gray-600'
                      } rounded-full animate-pulse`}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={
                isLoading ? 'PocketPal is typing...' : 'Ask a question...'
              }
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              aria-label="Send message"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <SendIcon />
              )}
            </button>
          </div>
        </div>
      )}

      {/* FAB Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50 group">
        <button
          onClick={toggleChat}
          className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          title="Chatbot Assistance"
        >
          {isOpen ? (
            <CloseIcon />
          ) : (
            <SparkleIcon className="w-6 h-6 text-white" />
          )}
        </button>
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chatbot Assistance
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        )}
      </div>
    </>
  );
}