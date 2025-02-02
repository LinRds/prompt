'use client';

import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { useStore } from '@/stores/useStore';

const { Title, Text } = Typography;

export const PromptSelector: React.FC = () => {
  const { prompts, currentNodeId, currentPromptId, setCurrentPrompt } = useStore();
  const filteredPrompts = prompts.filter((prompt) => prompt.nodeId === currentNodeId);

  if (!currentNodeId) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty description="请先选择左侧项目节点" />
      </div>
    );
  }

  if (filteredPrompts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty description="当前节点暂无可用的Prompt模版" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPrompts.map((prompt) => (
        <Card
          key={prompt.id}
          className={`
            cursor-pointer transition-all duration-300
            hover:shadow-lg hover:shadow-blue-100 hover:border-blue-200
            ${currentPromptId === prompt.id 
              ? 'border-blue-500 border-[3px] shadow-xl shadow-blue-300/50 bg-blue-50 scale-[1.02] ring-4 ring-blue-200/50' 
              : 'hover:translate-x-1'
            }
          `}
          onClick={() => setCurrentPrompt(prompt.id)}
        >
          <Title 
            level={5} 
            className={`
              !mb-1
              ${currentPromptId === prompt.id ? 'text-blue-500' : ''}
            `}
          >
            {prompt.title}
          </Title>
          <Text 
            type={currentPromptId === prompt.id ? undefined : "secondary"} 
            className={`
              text-sm
              ${currentPromptId === prompt.id ? 'text-blue-400' : ''}
            `}
          >
            {prompt.description}
          </Text>
        </Card>
      ))}
    </div>
  );
};
