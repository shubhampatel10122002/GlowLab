'use client';

import { useState, useCallback } from 'react';
import ChatPanel from '@/components/ChatPanel';
import DashboardPanel from '@/components/DashboardPanel';
import { ChatMessage, NegotiationMessage, Product, BrandPolicies, DEFAULT_PRODUCTS, DEFAULT_POLICIES } from '@/lib/types';
import { runNegotiation } from '@/lib/agents';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [policies, setPolicies] = useState<BrandPolicies>(DEFAULT_POLICIES);

  const handleUpdateProduct = useCallback((index: number, product: Product) => {
    setProducts(prev => {
      const next = [...prev];
      next[index] = product;
      return next;
    });
  }, []);

  const handleAddProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const handleRemoveProduct = useCallback((index: number) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSend = useCallback(async (message: string) => {
    if (!apiKey.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setIsNegotiating(true);
    setNegotiationMessages([]);

    await runNegotiation(
      apiKey,
      message,
      products,
      policies,
      (msg: NegotiationMessage) => {
        setNegotiationMessages(prev => [...prev, msg]);
      },
      (summary: string) => {
        setChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: summary,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
        setIsNegotiating(false);
      },
      (error: string) => {
        setChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Something went wrong: ${error}`,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
        setIsNegotiating(false);
      }
    );
  }, [apiKey, products, policies]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Panel - Dashboard */}
      <div className="hidden md:flex w-[45%] lg:w-[50%] border-r border-white/[0.06]">
        <div className="w-full h-full">
          <DashboardPanel
            messages={negotiationMessages}
            isNegotiating={isNegotiating}
            products={products}
            policies={policies}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
            onUpdatePolicies={setPolicies}
          />
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 min-w-0">
        <ChatPanel
          messages={chatMessages}
          onSend={handleSend}
          isLoading={isLoading}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />
      </div>
    </div>
  );
}
