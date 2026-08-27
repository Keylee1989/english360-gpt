/**
 * Conversation Practice Component
 *
 * Features:
 * - Chat interface with AI tutor
 * - Grammar correction display
 * - Vocabulary suggestions
 * - Real-time feedback
 */

import { useState, useCallback, useRef, useEffect } from "react";
import {
  type TutorMessage,
  type TutorLevel,
} from "@/engines/ai-tutor/v1";
import { isAIConfigured, chatWithAI } from "@/services/ai-settings";

interface ConversationPracticeProps {
  level: TutorLevel;
  topic: string;
  topicChinese: string;
  onComplete: (score: number) => void;
  onSkip?: () => void;
}

export function ConversationPractice({
  level,
  topic,
  topicChinese,
  onComplete,
  onSkip,
}: ConversationPracticeProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const useAI = isAIConfigured();

  // Initialize session
  useEffect(() => {
    // Add initial tutor message
    const initialMessage: TutorMessage = {
      id: "initial",
      role: "tutor",
      content: useAI
        ? `Hi! I'm your AI English teacher. Let's practice ${topic} in ${level} level. ${getInitialPrompt(level)}

中文: 你好！我是你的AI英语老师。让我们练习${topic}。${getInitialPromptChinese(level)}`
        : `Hello! Let's practice ${topic}. ${getInitialPrompt(level)}`,
      translationChinese: `你好！让我们练习${topic}。${getInitialPromptChinese(level)}`,
      timestamp: Date.now(),
    };
    setMessages([initialMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, topic, topicChinese, useAI]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Get initial prompt based on level
   */
  function getInitialPrompt(level: TutorLevel): string {
    switch (level) {
      case "A1":
        return "Can you introduce yourself?";
      case "A2":
        return "Tell me about your daily routine.";
      case "B1":
        return "What are your thoughts on this topic?";
      default:
        return "Let's have a conversation.";
    }
  }

  /**
   * Get initial prompt in Chinese
   */
  function getInitialPromptChinese(level: TutorLevel): string {
    switch (level) {
      case "A1":
        return "你能介绍一下自己吗？";
      case "A2":
        return "告诉我你的日常生活。";
      case "B1":
        return "你对这个话题有什么想法？";
      default:
        return "让我们开始对话吧。";
    }
  }

  /**
   * Handle send message
   */
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      // Both AI and local mode use chatWithAI (it auto-falls back to local mock)
      const systemPrompt = useAI
        ? `You are an English teacher for Chinese beginners. Level: ${level}. Topic: ${topicChinese}. Teach in a friendly way. When the student makes a mistake, correct them gently in Chinese. Always encourage them. Reply in English with Chinese explanations where helpful.`
        : `You are a friendly English teacher. Level: ${level}. Topic: ${topicChinese}. Reply in English with Chinese explanations. Correct mistakes gently.`;
      const chatHistory = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({
          role: m.role === "tutor" ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ];
      const aiReply = await chatWithAI(chatHistory);
      const aiMessage: TutorMessage = {
        id: `ai_${Date.now()}`,
        role: "tutor",
        content: aiReply,
        translationChinese: "",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        role: "tutor",
        content: "Sorry, something went wrong. Let's try again! (抱歉，出错了，请重试)",
        translationChinese: "",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, useAI, messages, level, topic, topicChinese]);

  /**
   * Handle key press
   */
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  /**
   * Handle complete
   */
  const handleComplete = useCallback(() => {
    onComplete(0);
  }, [onComplete]);

  return (
    <div className="conversation-practice flex flex-col h-full">
      {/* Header */}
      <div className="header bg-blue-500 text-white p-4 rounded-t">
        <h3 className="font-semibold">{topic}</h3>
        <p className="text-sm opacity-90">{topicChinese}</p>
        <p className="text-xs opacity-75">级别: {level}</p>
      </div>

      {/* Messages */}
      <div className="messages flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message mb-4 ${
              message.role === "tutor" ? "text-left" : "text-right"
            }`}
          >
            <div
              className={`inline-block max-w-[80%] p-3 rounded-lg ${
                message.role === "tutor"
                  ? "bg-white text-gray-800 border"
                  : "bg-blue-500 text-white"
              }`}
            >
              <p>{message.content}</p>
              {message.translationChinese && (
                <p className="text-xs opacity-75 mt-1">
                  {message.translationChinese}
                </p>
              )}
            </div>

            {/* Corrections */}
            {message.corrections &&
              message.corrections.length > 0 && (
                <div className="corrections mt-2 text-left">
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm">
                    <p className="font-medium text-yellow-800">修正:</p>
                    {message.corrections.map((correction, index) => (
                      <div key={index} className="mt-1">
                        <p className="text-red-600">
                          ❌ {correction.original}
                        </p>
                        <p className="text-green-600">
                          ✅ {correction.corrected}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {correction.explanationChinese}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Vocabulary Suggestions */}
            {message.vocabularySuggestions &&
              message.vocabularySuggestions.length > 0 && (
                <div className="vocabulary-suggestions mt-2 text-left">
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
                    <p className="font-medium text-blue-800">词汇建议:</p>
                    {message.vocabularySuggestions.map((suggestion, index) => (
                      <div key={index} className="mt-1">
                        <p className="font-medium">{suggestion.word}</p>
                        <p className="text-gray-600 text-xs">
                          {suggestion.meaningChinese}
                        </p>
                        <p className="text-gray-500 text-xs italic">
                          {suggestion.example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Encouragement */}
            {message.encouragement && (
              <div className="encouragement mt-1 text-left">
                <p className="text-sm text-green-600">{message.encouragement}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-area p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {isLoading ? "发送中..." : "发送"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons p-4 border-t flex gap-2">
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          跳过
        </button>
        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          完成练习
        </button>
      </div>
    </div>
  );
}
