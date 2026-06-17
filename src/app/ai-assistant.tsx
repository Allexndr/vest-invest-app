import { View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, ChevronLeft, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme';
import { chatWithAI, type AiChatMessage } from '@/lib/ai';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import Animated, { FadeIn } from 'react-native-reanimated';

const QUICK_ACTIONS = [
  { id: 'portfolio', icon: TrendingUp, label: 'Analyze my portfolio', color: '#34d399' },
  { id: 'market', icon: Sparkles, label: 'Market outlook', color: '#fbbf24' },
  { id: 'risks', icon: AlertTriangle, label: 'Risk assessment', color: '#f87171' },
];

export default function AiAssistantScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm VEST AI. I can help you analyze your portfolio, research stocks, or provide market insights. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AiChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI({
        user_id: 1, // TODO: Get from auth store
        message: userMessage.content,
        history: messages.slice(-5), // Send last 5 messages for context
      });

      const aiMessage: AiChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: AiChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  const handleQuickAction = (actionId: string) => {
    const prompts: Record<string, string> = {
      portfolio: 'Analyze my portfolio and give me insights on diversification and risk',
      market: 'What is the current market outlook for this week?',
      risks: 'What are the main risks in my current portfolio?',
    };
    setInput(prompts[actionId] || '');
  };

  const renderMessage = ({ item }: { item: AiChatMessage }) => {
    const isUser = item.role === 'user';
    
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        style={{
          flexDirection: isUser ? 'row-reverse' : 'row',
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isUser ? colors.accent : colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: isUser ? 0 : 0,
            marginRight: isUser ? 0 : 12,
          }}
        >
          {isUser ? (
            <User size={16} color="#fff" />
          ) : (
            <Bot size={16} color={colors.accent} />
          )}
        </View>

        {/* Message Bubble */}
        <View
          style={{
            maxWidth: '80%',
            backgroundColor: isUser ? colors.accent : colors.surface,
            borderRadius: 16,
            padding: 12,
            borderBottomLeftRadius: isUser ? 16 : 4,
            borderBottomRightRadius: isUser ? 4 : 16,
          }}
        >
          <ThemedText
            variant={isUser ? 'inverse' : 'primary'}
            size="sm"
          >
            {item.content}
          </ThemedText>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ChevronLeft size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Bot size={20} color={colors.accent} />
            <ThemedText size="lg" weight="semibold" style={{ marginLeft: 8 }}>
              VEST AI
            </ThemedText>
          </View>
          <ThemedText variant="secondary" size="xs">
            AI Investment Assistant
          </ThemedText>
        </View>
        
        <View style={{ width: 36 }} />
      </View>

      {/* Quick Actions */}
      <View style={{ padding: 16 }}>
        <ThemedText variant="secondary" size="xs" style={{ marginBottom: 8 }}>
          Quick Actions
        </ThemedText>
        <View style={{ flexDirection: 'row' }}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => handleQuickAction(action.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: action.color + '15',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <action.icon size={14} color={action.color} />
              <ThemedText
                size="xs"
                weight="medium"
                style={{ marginLeft: 6, color: action.color }}
              >
                {action.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                color: colors.textPrimary,
                fontSize: 16,
                maxHeight: 100,
                paddingVertical: 8,
              }}
              placeholder="Ask VEST AI anything..."
              placeholderTextColor={colors.textSecondary}
              value={input}
              onChangeText={setInput}
              multiline
              onSubmitEditing={sendMessage}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: input.trim() && !isLoading ? colors.accent : colors.surfaceSecondary,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 8,
              }}
            >
              <Send
                size={18}
                color={input.trim() && !isLoading ? '#fff' : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          
          <ThemedText variant="secondary" size="xs" style={{ textAlign: 'center', marginTop: 8 }}>
            AI responses are for informational purposes only. Not financial advice.
          </ThemedText>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
