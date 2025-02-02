'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectNodes } from '@/components/project-nodes/ProjectNodes';
import { PromptSelector } from '@/components/prompt-selector/PromptSelector';
import { PromptEditor } from '@/components/prompt-editor/PromptEditor';
import { useRouter } from 'next/navigation';

export default function Home() {
  return (
    <AppLayout
      projectNodes={<ProjectNodes />}
      promptSelector={<PromptSelector />}
      promptEditor={<PromptEditor />}
    />
  );
} 