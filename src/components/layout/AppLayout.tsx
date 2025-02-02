'use client';

import React from 'react';
import { Layout } from 'antd';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  projectNodes: React.ReactNode;
  promptSelector: React.ReactNode;
  promptEditor: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  projectNodes,
  promptSelector,
  promptEditor,
}) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, lineHeight: '64px' }}>
          AI编程模版生成系统
        </h1>
      </Header>
      <Layout hasSider>
        <Sider
          width={250}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            height: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <div style={{ 
            flex: 1, 
            overflow: 'auto',
            padding: '16px',
            paddingBottom: '60px', // 为底部切换栏留出空间
          }}>
            {projectNodes}
          </div>
        </Sider>
        <Layout>
          <Sider
            width={300}
            style={{
              background: '#fff',
              borderRight: '1px solid #f0f0f0',
              overflow: 'auto',
              height: 'calc(100vh - 64px)',
            }}
          >
            <div style={{ padding: '16px' }}>{promptSelector}</div>
          </Sider>
          <Content
            style={{
              padding: '24px',
              background: '#f5f5f5',
              overflow: 'auto',
              height: 'calc(100vh - 64px)',
            }}
          >
            {promptEditor}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}; 