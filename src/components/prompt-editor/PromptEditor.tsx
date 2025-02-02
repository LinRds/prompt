'use client';

import React, { useMemo } from 'react';
import { Card, Button, Typography, Divider, Space } from 'antd';
import { CopyOutlined, EyeOutlined, ClearOutlined } from '@ant-design/icons';
import { useStore } from '@/stores/useStore';
import { SegmentedPrompt } from './SegmentedPrompt';
import { SentenceGroup } from '@/types/store';
import { useMessage } from '@/components/common/MessageProvider';

const { Text, Title, Paragraph } = Typography;

export const PromptEditor: React.FC = () => {
  const { currentPromptId, currentNodeId, prompts, promptInputs, clearNodeInputs, generateFullPrompt } = useStore();
  const message = useMessage();
  const currentPrompt = currentPromptId ? prompts.find(p => p.id === currentPromptId) : null;

  const previewContent = useMemo(() => {
    if (!currentPrompt) return '暂无内容可预览';
    return generateFullPrompt() || '暂无内容可预览';
  }, [currentPrompt, generateFullPrompt, promptInputs]);

  const isSentenceComplete = (sentence: SentenceGroup): boolean => {
    // 检查句子中是否有输入框
    const hasInputs = sentence.segments.some(seg => seg.type === 'input');
    if (!hasInputs) return true; // 如果没有输入框，句子总是完整的

    // 检查所有输入框是否都有值
    return sentence.segments.every(segment => {
      if (segment.type === 'input') {
        const inputKey = `${currentPromptId}-${segment.placeholder}`;
        return promptInputs[inputKey] && promptInputs[inputKey].trim() !== '';
      }
      return true;
    });
  };

  const handleCopy = () => {
    const content = generateFullPrompt();
    if (!content?.trim()) {
      message.warning('没有可复制的完整句子');
      return;
    }
    navigator.clipboard.writeText(content);
    message.success('已复制到剪贴板');
  };

  const handleClear = () => {
    if (currentNodeId) {
      clearNodeInputs(currentNodeId);
      message.success('已清空当前节点的所有输入');
    }
  };

  if (!currentPrompt) {
    return (
      <Card title="提示词编辑器" className="h-full">
        <div className="text-gray-400 text-center">
          请先选择左侧项目节点
        </div>
      </Card>
    );
  }

  const hasInputs = Object.keys(promptInputs).some(key => 
    key.startsWith(`${currentPrompt.id}-`) && promptInputs[key].trim() !== ''
  );

  return (
    <div className="flex flex-col gap-6">
      <Card 
        title="提示词编辑器"
        className="h-full"
        extra={
          <Space>
            {hasInputs && (
              <Button 
                icon={<ClearOutlined />}
                onClick={handleClear}
              >
                清空输入
              </Button>
            )}
            <Button 
              type="primary" 
              icon={<CopyOutlined />} 
              onClick={handleCopy}
            >
              复制内容
            </Button>
          </Space>
        }
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            {currentPrompt.segments ? (
              <SegmentedPrompt 
                segments={currentPrompt.segments} 
                promptId={currentPrompt.id} 
              />
            ) : (
              <div className="text-gray-400 text-center">
                该模板暂不支持编辑
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        <Title level={4} className="!mb-0">预览</Title>
        <Card 
          className="w-full bg-gray-50"
          bodyStyle={{ 
            padding: '16px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <Paragraph 
            className="
              !mb-0 whitespace-pre-wrap break-words
              font-mono text-sm text-gray-700
            "
          >
            {previewContent}
          </Paragraph>
        </Card>
      </div>
    </div>
  );
}; 