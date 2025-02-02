'use client';

import { Inter } from 'next/font/google';
import { MessageProvider } from '@/components/common/MessageProvider';
import './globals.css';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import StyledComponentsRegistry from '@/components/AntdRegistry'

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <MessageProvider>
          <StyledComponentsRegistry>
            <ConfigProvider
              locale={zhCN}
              theme={{
                token: {
                  colorPrimary: '#1677ff',
                },
              }}
            >
              {children}
            </ConfigProvider>
          </StyledComponentsRegistry>
        </MessageProvider>
      </body>
    </html>
  )
} 