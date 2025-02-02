import { create } from 'zustand';
import { AppState, ProjectNode, PromptTemplate, PromptSegment, SentenceGroup } from '../types/store';

const planningNodes: ProjectNode[] = [
  {
    id: 'intro',
    stage: 'planning',
    title: '介绍项目',
    description: '项目需求描述',
    defaultPrompt: "I'm starting a new project and I'd like to create a knowledge base for you to reference throughout our development process. The project is [brief description]. We'll be using [tech stack]. The key features we need to implement are [list features]. Some important constraints to keep in mind are [list constraints]. In terms of coding style, we prefer [mention preferences]. Can you summarize this information and suggest any additional details we should include in our knowledge base?"
  },
  {
    id: 'components',
    stage: 'planning',
    title: '拆分组件',
    description: '项目组件结构设计',
    defaultPrompt: "Based on the project overview we just created, can you help me break down this project into manageable components or modules? For each component, please suggest:\n1. A name for the component\n2. Its main functionality\n3. Potential challenges in implementing it\n4. How it might interact with other components\nPlease also recommend a logical order for developing these components."
  },
  {
    id: 'tech-stack',
    stage: 'planning',
    title: '技术路线',
    description: '技术选型和架构设计',
    defaultPrompt: "Using the component breakdown we've created, can you help me develop a project roadmap? Please include:\n1. A suggested order for developing the components\n2. Estimated time frames for each component (assuming I'm working on this part-time)\n3. Potential milestones or checkpoints\n4. Any dependencies between components that might affect the development order\n5. Suggestions for any proof-of-concept or prototype stages that might be beneficial"
  },
  {
    id: 'solution',
    stage: 'planning',
    title: '技术方案',
    description: '详细技术方案设计',
    defaultPrompt: "Let's think step-by-step about the architecture for [specific component or system]. Please consider:\n1. The main functionalities this component needs to support\n2. Potential data structures or models\n3. Key classes or modules and their responsibilities\n4. How this component will interact with other parts of the system\n5. Potential design patterns that could be applicable\n6. Considerations for scalability and maintainability\nFor each step, provide a brief explanation of your reasoning."
  }
];

const implementationNodes: ProjectNode[] = [
  {
    id: 'setup',
    stage: 'implementation',
    title: '项目初始化',
    description: '项目环境搭建',
    defaultPrompt: '请帮助设置项目开发环境...'
  },
  {
    id: 'core-components',
    stage: 'implementation',
    title: '核心组件开发',
    description: '实现核心功能组件',
    defaultPrompt: '请生成核心组件的代码...'
  }
];

const maintenanceNodes: ProjectNode[] = [
  {
    id: 'optimize',
    stage: 'maintenance',
    title: '性能优化',
    description: '系统性能优化',
    defaultPrompt: '请分析并优化系统性能...'
  },
  {
    id: 'refactor',
    stage: 'maintenance',
    title: '代码重构',
    description: '优化代码结构',
    defaultPrompt: '请帮助重构以下代码...'
  }
];

// 为每个节点创建核心模板
const createCorePrompts = (nodes: ProjectNode[]): PromptTemplate[] => {
  return nodes.map(node => ({
    id: `${node.id}-core`,
    nodeId: node.id,
    type: 'core',
    title: node.title,
    description: `${node.title}的核心提示词模板`,
    content: node.defaultPrompt
  }));
};

// 辅助模板
const assistantPrompts: PromptTemplate[] = [
  {
    id: 'tech-risk',
    nodeId: 'tech-stack',
    type: 'assistant',
    title: '风险评估',
    description: '评估项目风险并提供缓解策略',
    content: "Based on our project plan, can you identify potential risks or challenges we might face during development? For each risk, suggest possible mitigation strategies."
  },
  {
    id: 'tech-compare',
    nodeId: 'tech-stack',
    type: 'assistant',
    title: '技术对比',
    description: '比较不同技术方案的优劣',
    content: "We're considering using [Technology A] or [Technology B] for [specific functionality]. Can you compare these options in the context of our project, considering factors like performance, ease of implementation, and future scalability?"
  },
  {
    id: 'solution-iteration',
    nodeId: 'solution',
    type: 'assistant',
    title: '迭代优化',
    description: '优化初始技术方案',
    content: "Thank you for that initial design. I have a few follow-up questions:\n1. What are the potential drawbacks or limitations of this approach?\n2. Can you suggest an alternative design that prioritizes [specific concern, e.g., performance, flexibility]?\n3. How would this design need to change if we needed to [potential future requirement]?"
  },
  {
    id: 'design-pattern',
    nodeId: 'solution',
    type: 'assistant',
    title: '设计模式',
    description: '选择合适的设计模式',
    content: "Given our requirement to [specific functionality], which design patterns might be applicable? For each suggested pattern, please explain how it could be implemented in our system and what benefits it would provide."
  },
  {
    id: 'db-schema',
    nodeId: 'solution',
    type: 'assistant',
    title: '数据库schema',
    description: '设计数据库结构',
    content: "We need to design a database schema for [specific part of the system]. Based on our requirements, can you suggest an initial schema design? Please include tables, key fields, and relationships. Also, consider potential indexing strategies for performance."
  },
  {
    id: 'api-design',
    nodeId: 'solution',
    type: 'assistant',
    title: 'API设计',
    description: '设计API接口',
    content: "We're planning to create a RESTful API for [specific functionality]. Can you help design the endpoints we'll need? For each endpoint, suggest the HTTP method, URL structure, request/response formats, and any authentication requirements."
  }
];

const splitIntoSentences = (content: string): string[] => {
  // 使用正则表达式分割句子，保留序号和内容的关系
  return content
    .split(/(?<=\.)\s+(?=\d+\.)|(?<=\?)\s+(?=\d+\.)|(?<=!)\s+(?=\d+\.)|\n\n+/)
    .map(s => s.trim())
    .filter(Boolean);
};

const parsePromptContent = (content: string): { segments: PromptSegment[], sentences: SentenceGroup[] } => {
  const sentences = splitIntoSentences(content);
  const allSegments: PromptSegment[] = [];
  const sentenceGroups: SentenceGroup[] = [];

  sentences.forEach((sentence, sentenceIndex) => {
    const sentenceSegments: PromptSegment[] = [];
    let currentIndex = 0;
    const regex = /\[([^\]]+)\]/g;
    let match;

    // 重置regex
    regex.lastIndex = 0;
    
    // 处理所有匹配
    while ((match = regex.exec(sentence)) !== null) {
      // 添加匹配之前的静态文本
      if (match.index > currentIndex) {
        const staticText = sentence.slice(currentIndex, match.index);
        sentenceSegments.push({
          type: 'static',
          content: staticText,
          sentenceId: sentenceIndex
        });
      }

      // 添加输入字段
      sentenceSegments.push({
        type: 'input',
        content: '',
        placeholder: match[1],
        sentenceId: sentenceIndex
      });

      currentIndex = match.index + match[0].length;
    }

    // 添加剩余的静态文本
    if (currentIndex < sentence.length) {
      const remainingText = sentence.slice(currentIndex);
      sentenceSegments.push({
        type: 'static',
        content: remainingText,
        sentenceId: sentenceIndex
      });
    }

    if (sentenceSegments.length > 0) {
      allSegments.push(...sentenceSegments);
      sentenceGroups.push({
        id: sentenceIndex,
        segments: sentenceSegments
      });
    }
  });

  return { segments: allSegments, sentences: sentenceGroups };
};

// 处理所有模板，添加segments和sentences
const processPrompts = (prompts: PromptTemplate[]): PromptTemplate[] => {
  return prompts.map(prompt => {
    const { segments, sentences } = parsePromptContent(prompt.content);
    return {
      ...prompt,
      segments,
      sentences
    };
  });
};

const allNodes = [...planningNodes, ...implementationNodes, ...maintenanceNodes];
const corePrompts = createCorePrompts(allNodes);
const initialPrompts = processPrompts([...corePrompts, ...assistantPrompts]);

export const useStore = create<AppState>((set, get) => ({
  currentNodeId: '1',
  currentPromptId: null,
  nodes: allNodes,
  prompts: initialPrompts,
  customPrompt: '',
  promptInputs: {},
  
  setCurrentNode: (nodeId: string) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const corePrompt = get().getCorePromptByNodeId(nodeId);
      set({ 
        currentNodeId: nodeId,
        currentPromptId: corePrompt?.id || null,
        customPrompt: corePrompt?.content || node.defaultPrompt,
      });
    }
  },

  setCurrentPrompt: (promptId: string) => {
    const prompt = get().prompts.find(p => p.id === promptId);
    if (prompt) {
      set({ 
        currentPromptId: promptId,
        customPrompt: prompt.content,
      });
    }
  },

  setCustomPrompt: (prompt: string) => set({ customPrompt: prompt }),
  
  setPromptInput: (key: string, value: string) => {
    set(state => ({
      promptInputs: {
        ...state.promptInputs,
        [key]: value
      }
    }));
  },

  clearNodeInputs: (nodeId: string) => {
    const nodePrompts = get().getPromptsByNodeId(nodeId);
    const inputKeys = nodePrompts.reduce((keys: string[], prompt) => {
      return [...keys, ...Object.keys(get().promptInputs).filter(key => key.startsWith(`${prompt.id}-`))];
    }, []);

    set(state => ({
      promptInputs: Object.fromEntries(
        Object.entries(state.promptInputs).filter(([key]) => !inputKeys.includes(key))
      )
    }));
  },

  clearAllInputs: () => {
    set({ promptInputs: {} });
  },

  getNodesByStage: (stage: 'planning' | 'implementation' | 'maintenance') => {
    return get().nodes.filter(node => node.stage === stage);
  },

  getPromptsByNodeId: (nodeId: string) => {
    return get().prompts.filter(prompt => prompt.nodeId === nodeId);
  },

  getCorePromptByNodeId: (nodeId: string) => {
    return get().prompts.find(
      prompt => prompt.nodeId === nodeId && prompt.type === 'core'
    );
  },

  parsePromptToSegments: (content: string) => {
    return parsePromptContent(content).segments;
  },

  generateFullPrompt: () => {
    const state = get();
    const currentPrompt = state.prompts.find(p => p.id === state.currentPromptId);
    
    if (!currentPrompt?.sentences) return '';
    
    // 只处理完整的句子
    const completeSentences = currentPrompt.sentences
      .filter(sentence => {
        // 检查句子中的所有输入字段是否都已填写
        return sentence.segments.every(segment => {
          if (segment.type === 'static') return true;
          const inputKey = `${currentPrompt.id}-${segment.placeholder}`;
          const inputValue = state.promptInputs[inputKey];
          return inputValue && inputValue.trim() !== '';
        });
      })
      .map(sentence => {
        return sentence.segments.map(segment => {
          if (segment.type === 'static') {
            return segment.content;
          } else {
            const inputKey = `${currentPrompt.id}-${segment.placeholder}`;
            return state.promptInputs[inputKey].trim();
          }
        }).join('');
      });

    return completeSentences.join('\n');
  }
})); 