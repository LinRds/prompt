import React from 'react';
import { Input } from 'antd';
import { useStore } from '@/stores/useStore';
import { PromptSegment } from '@/types/store';

const { TextArea } = Input;

interface SegmentedPromptProps {
  segments: PromptSegment[];
  promptId: string;
}

export const SegmentedPrompt: React.FC<SegmentedPromptProps> = ({ segments, promptId }) => {
  const { promptInputs, setPromptInput } = useStore();

  const handleInputChange = (placeholder: string, value: string) => {
    setPromptInput(`${promptId}-${placeholder}`, value);
  };

  return (
    <div className="space-y-2">
      {segments.map((segment, index) => {
        if (segment.type === 'static') {
          const isNewSentence = index > 0 && 
            segments[index - 1].sentenceId !== segment.sentenceId;

          return (
            <React.Fragment key={index}>
              {isNewSentence && <div className="h-4" />}
              <span className="text-gray-800 whitespace-pre-wrap">
                {segment.content}
              </span>
            </React.Fragment>
          );
        } else {
          const inputKey = `${promptId}-${segment.placeholder}`;
          return (
            <TextArea
              key={index}
              placeholder={segment.placeholder}
              value={promptInputs[inputKey] || ''}
              onChange={(e) => handleInputChange(segment.placeholder!, e.target.value)}
              className="inline-block mx-1"
              style={{ 
                width: 'calc(100% - 0.5rem)',
                minHeight: '32px',
                resize: 'vertical',
                marginTop: '0.5rem',
                marginBottom: '0.5rem'
              }}
              autoSize={{ minRows: 1, maxRows: 6 }}
              variant="outlined"
              allowClear
            />
          );
        }
      })}
    </div>
  );
}; 