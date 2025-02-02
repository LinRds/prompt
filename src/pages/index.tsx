import React from 'react';
import { Layout, Typography } from 'antd';
import { TimelineNode } from '@/components/project-nodes/TimelineNode';
import { useStore } from '@/stores/useStore';

const { Content } = Layout;
const { Title } = Typography;

const nodes = [
  {
    id: '1',
    title: '项目概述',
    description: '定义项目目标、范围和主要功能'
  },
  {
    id: '2',
    title: '技术架构',
    description: '确定技术栈和系统架构设计'
  },
  {
    id: '3',
    title: '功能规划',
    description: '详细的功能列表和实现计划'
  },
  {
    id: '4',
    title: '开发指南',
    description: '编码规范和开发流程说明'
  }
];

export default function Home() {
  const { currentNodeId, setCurrentNodeId } = useStore();

  return (
    <Layout className="min-h-screen">
      <Content className="p-8">
        <Title level={2} className="mb-8">AI编程Prompt模版</Title>
        <div className="max-w-3xl mx-auto">
          {nodes.map((node) => (
            <TimelineNode
              key={node.id}
              number={parseInt(node.id)}
              title={node.title}
              description={node.description}
              isActive={currentNodeId === node.id}
              onClick={() => setCurrentNodeId(node.id)}
            />
          ))}
        </div>
      </Content>
    </Layout>
  );
} 