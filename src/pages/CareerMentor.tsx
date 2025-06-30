
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Bot, User, Sparkles, Lightbulb, Target, Zap } from 'lucide-react';

const CareerMentor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: newMessage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      // Simulate AI response for now
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Thank you for your question: "${newMessage}". I'm here to help you with your career development. This is a simulated response while we set up the full AI integration.`,
        created_at: new Date().toISOString()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
        toast({
          title: 'Response received!',
          description: 'Your AI career mentor has responded.',
        });
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const quickPrompts = [
    "How can I improve my resume?",
    "What skills should I develop for my career?",
    "How do I prepare for job interviews?",
    "What career path is right for me?",
    "How can I negotiate my salary?",
    "Tips for networking effectively?"
  ];

  if (sessionLoading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                <p className="text-gray-600 font-medium">Loading your career mentor...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">AI Career Mentor</h1>
                  <p className="text-purple-100 text-lg">Get personalized career guidance and advice</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Bot className="w-4 h-4 mr-1" />
                    AI Powered
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Smart Advice
                  </Badge>
                </div>
              </div>
            </div>

            {/* Chat Container */}
            <Card className="border-0 shadow-xl h-[600px] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg shrink-0">
                <CardTitle className="flex items-center text-gray-900">
                  <MessageCircle className="w-6 h-6 mr-2 text-purple-600" />
                  Career Conversation
                </CardTitle>
                <p className="text-gray-600">Chat with your AI career mentor for personalized guidance</p>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Bot className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to your AI Career Mentor!</h3>
                    <p className="text-gray-600 mb-6">Ask me anything about your career development, job search, or professional growth.</p>
                    
                    {/* Quick Prompts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {quickPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => setNewMessage(prompt)}
                          className="text-left justify-start h-auto p-4 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl transition-all duration-300"
                        >
                          <Sparkles className="w-4 h-4 mr-2 text-purple-500 shrink-0" />
                          <span className="text-sm">{prompt}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${
                          message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            message.role === 'user' 
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                              : 'bg-gradient-to-br from-purple-500 to-pink-600'
                          }`}>
                            {message.role === 'user' ? (
                              <User className="w-5 h-5 text-white" />
                            ) : (
                              <Bot className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className={`p-4 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 border border-gray-300'
                          }`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3 max-w-[80%]">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300">
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                              <span className="text-gray-600">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              
              {/* Input Area */}
              <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-lg">
                <div className="flex space-x-4">
                  <Textarea
                    placeholder="Ask your career mentor anything..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    className="flex-1 border-2 border-gray-300 focus:border-purple-500 rounded-xl resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <Zap className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CareerMentor;
