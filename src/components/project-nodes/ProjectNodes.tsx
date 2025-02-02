'use client';

import React, { useEffect } from 'react';
import { Card, Typography } from 'antd';
import { useStore } from '@/stores/useStore';
import Link from 'next/link';
import { FileTextOutlined, CodeOutlined, ToolOutlined } from '@ant-design/icons';
import { TimelineNode } from './TimelineNode';
import { ProjectNode } from '@/types/store';

const { Title } = Typography;

type ProjectNodesProps = {
  stage?: 'planning' | 'implementation' | 'maintenance';
};

const getCategoryTitle = (category: string) => {
  switch (category) {
    case 'code-generation':
      return '代码生成';
    case 'code-review':
      return '代码审核';
    case 'database-design':
      return '数据库设计';
    case 'documentation':
      return '文档生成';
    default:
      return category;
  }
};

export const ProjectNodes: React.FC<ProjectNodesProps> = ({ stage = 'planning' }) => {
  const { currentNodeId, setCurrentNode, getNodesByStage, clearAllInputs } = useStore();
  const nodes = getNodesByStage(stage);

  // 当 stage 改变时，重置状态
  useEffect(() => {
    const firstNode = nodes[0];
    const currentNodeInStage = nodes.some(node => node.id === currentNodeId);
    
    if (firstNode && !currentNodeInStage) {
      setCurrentNode(firstNode.id);
      clearAllInputs();
    }
  }, [stage]);

  const getStageTitle = () => {
    switch (stage) {
      case 'planning':
        return '生成技术方案';
      case 'implementation':
        return '代码实现';
      case 'maintenance':
        return '优化和维护';
      default:
        return '项目节点';
    }
  };

  // 渲染节点及其子节点
  const renderNode = (node: ProjectNode, globalIndex: number) => {
    const childNodes = nodes.filter(n => n.parentId === node.id);
    
    return (
      <div key={node.id}>
        <TimelineNode
          number={globalIndex + 1}
          title={node.title}
          description={node.description}
          isActive={currentNodeId === node.id}
          onClick={() => setCurrentNode(node.id)}
        />
        {childNodes.length > 0 && (
          <div className="ml-6 mt-2">
            {childNodes.map((childNode, childIndex) => (
              <TimelineNode
                key={childNode.id}
                number={childIndex + 1}
                title={childNode.title}
                description={childNode.description}
                isActive={currentNodeId === childNode.id}
                onClick={() => setCurrentNode(childNode.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <Title level={4} className="px-4 !mb-6">{getStageTitle()}</Title>
        <div className="px-4">
          {nodes.filter(node => !node.parentId).map((node, index) => renderNode(node, index))}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-[250px] h-10 bg-[#f0f0f0] border-t flex items-end px-2 z-50">
        <div className="flex gap-1">
          <Link 
            href="/" 
            className={`
              flex items-center gap-1 px-4 py-1.5 min-w-[80px]
              transition-all duration-200
              ${stage === 'planning' 
                ? 'bg-white text-blue-600 border-t border-l border-r border-gray-300 rounded-t-lg -mb-[1px]' 
                : 'text-gray-600 hover:bg-gray-200 rounded-t'
              }
            `}
          >
            <FileTextOutlined />
            <span className="truncate">方案</span>
          </Link>
          <Link 
            href="/implementation" 
            className={`
              flex items-center gap-1 px-4 py-1.5 min-w-[80px]
              transition-all duration-200
              ${stage === 'implementation' 
                ? 'bg-white text-blue-600 border-t border-l border-r border-gray-300 rounded-t-lg -mb-[1px]' 
                : 'text-gray-600 hover:bg-gray-200 rounded-t'
              }
            `}
          >
            <CodeOutlined />
            <span className="truncate">实现</span>
          </Link>
          <Link 
            href="/maintenance" 
            className={`
              flex items-center gap-1 px-4 py-1.5 min-w-[80px]
              transition-all duration-200
              ${stage === 'maintenance' 
                ? 'bg-white text-blue-600 border-t border-l border-r border-gray-300 rounded-t-lg -mb-[1px]' 
                : 'text-gray-600 hover:bg-gray-200 rounded-t'
              }
            `}
          >
            <ToolOutlined />
            <span className="truncate">维护</span>
          </Link>
        </div>
      </div>
    </>
  );
}; 