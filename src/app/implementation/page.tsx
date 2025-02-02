'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectNodes } from '@/components/project-nodes/ProjectNodes';
import { PromptSelector } from '@/components/prompt-selector/PromptSelector';
import { PromptEditor } from '@/components/prompt-editor/PromptEditor';

export default function Implementation() {
  return (
    <AppLayout
      projectNodes={<ProjectNodes stage="implementation" />}
      promptSelector={<PromptSelector />}
      promptEditor={<PromptEditor />}
    />
  );
} 