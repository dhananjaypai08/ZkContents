import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, User, RefreshCw, ArrowLeft, Terminal } from 'lucide-react';
import axios from 'axios';

const AIChatbot = () => {
  const [messages, setMessages] = useState(['Subgraph Loaded!']);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [first, setFirst] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    if (!text) return 'No response received';
    
    return text.toString().split('\n').map((line, i) => (
      <span key={i} className="block">
        {line.startsWith('*') ? (
          <span className="font-semibold text-blue-300">{line}</span>
        ) : line.startsWith('#') ? (
          <span className="text-purple-400">{line}</span>
        ) : (
          line
        )}
      </span>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      type: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      let endpoint = '/query';
      let params = { query: input.trim() };

      if (input.toLowerCase().includes('load this subgraph :') ||
          input.toLowerCase().includes('connect with this subgraph endpoint:')) {
        endpoint = '/';
        const urlMatch = input.match(/:\s*(.+)/);
        if (urlMatch) {
          params = { api_endpoint: urlMatch[1].trim() };
        }
      }

      const response = await axios.get(`http://localhost:8080${endpoint}`, { 
        params,
      });

      
      const botMessage = {
        type: 'bot',
        content: response.data || 'No response received'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        type: 'bot',
        content: `Error: ${error.response?.data?.detail || error.message || 'Something went wrong'}`,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Terminal className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold text-white">zkCDN AI Assistant</h1>
            </motion.div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </motion.button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : message.isError
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-gray-800/80 text-gray-100 border border-gray-700'
                  } shadow-xl`}
                >
                  <div className="flex items-start space-x-3">
                    {message.type === 'bot' ? (
                      <Bot className="h-5 w-5 mt-1 text-blue-400 flex-shrink-0" />
                    ) : (
                      <User className="h-5 w-5 mt-1 text-white flex-shrink-0" />
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {formatMessage(message.content)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3 text-blue-400 bg-gray-800/50 p-4 rounded-xl w-fit"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Processing your request...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom with proper spacing */}
        <div className="sticky bottom-0 p-6 bg-gray-800/50 border-t border-gray-700 mt-auto">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about zkCDN or load a subgraph..."
                className="flex-1 px-6 py-4 bg-gray-900 text-gray-100 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 pr-12 text-sm"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </motion.button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;