'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectNodes } from '@/components/project-nodes/ProjectNodes';
import { PromptSelector } from '@/components/prompt-selector/PromptSelector';
import { PromptEditor } from '@/components/prompt-editor/PromptEditor';

export default function Maintenance() {
  return (
    <AppLayout
      projectNodes={<ProjectNodes stage="maintenance" />}
      promptSelector={<PromptSelector />}
      promptEditor={<PromptEditor />}
    />
  );
} 