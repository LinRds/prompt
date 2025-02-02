export type PromptType = 'core' | 'assistant';

export type NodeCategory = 
  | 'code-generation'    // 代码生成
  | 'code-review'        // 代码审核
  | 'database-design'    // 数据库设计
  | 'documentation';     // 文档生成

export interface PromptSegment {
  type: 'static' | 'input';
  content: string;
  placeholder?: string;
  sentenceId?: number;
}

export interface SentenceGroup {
  id: number;
  segments: PromptSegment[];
}

export interface ProjectNode {
  id: string;
  stage: 'planning' | 'implementation' | 'maintenance';
  category: NodeCategory;
  title: string;
  description: string;
  defaultPrompt: string;
  parentId?: string;  // 父节点ID
  isParent?: boolean; // 是否是父节点
}

export interface PromptTemplate {
  id: string;
  nodeId: string;
  type: PromptType;
  title: string;
  description: string;
  content: string;
  segments?: PromptSegment[];
  sentences?: SentenceGroup[];
}

export interface AppState {
  currentNodeId: string | null;
  currentPromptId: string | null;
  nodes: ProjectNode[];
  prompts: PromptTemplate[];
  customPrompt: string;
  promptInputs: Record<string, string>;
  
  setCurrentNode: (nodeId: string) => void;
  setCurrentPrompt: (promptId: string) => void;
  setCustomPrompt: (prompt: string) => void;
  setPromptInput: (key: string, value: string) => void;
  clearNodeInputs: (nodeId: string) => void;
  clearAllInputs: () => void;
  getNodesByStage: (stage: 'planning' | 'implementation' | 'maintenance') => ProjectNode[];
  getPromptsByNodeId: (nodeId: string) => PromptTemplate[];
  getCorePromptByNodeId: (nodeId: string) => PromptTemplate | undefined;
  parsePromptToSegments: (content: string) => PromptSegment[];
} 