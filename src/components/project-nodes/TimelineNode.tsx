import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface TimelineNodeProps {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

export const TimelineNode: React.FC<TimelineNodeProps> = ({
  number,
  title,
  description,
  isActive,
  onClick,
}) => {
  return (
    <div className="relative pl-16 pb-12 last:pb-0">
      {/* 连接线 */}
      <div 
        className={`
          absolute left-[23px] top-12 bottom-0 w-1
          ${isActive ? 'bg-blue-500' : 'bg-gray-200'}
          last:hidden
        `}
      />
      
      {/* 序号圆圈 */}
      <div 
        className={`
          absolute left-0 top-4 flex items-center justify-center
          w-12 h-12 rounded-full border-4 transition-all duration-300
          ${isActive 
            ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-200' 
            : 'border-gray-300 bg-white text-gray-500 hover:border-blue-300'
          }
          text-lg font-semibold z-10
        `}
      >
        {number}
      </div>

      {/* 卡片内容 */}
      <Card
        className={`
          cursor-pointer transition-all duration-300
          hover:shadow-lg hover:border-blue-200
          ${isActive 
            ? 'border-blue-500 border-2 shadow-md' 
            : 'hover:translate-x-1'
          }
        `}
        onClick={onClick}
      >
        <Title level={5} className={`!mb-1 ${isActive ? 'text-blue-500' : ''}`}>
          {title}
        </Title>
        <Text type="secondary" className="text-sm">
          {description}
        </Text>
      </Card>
    </div>
  );
}; 