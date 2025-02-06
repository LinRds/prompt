import { create } from 'zustand';
import { AppState, ProjectNode, PromptTemplate, PromptSegment, SentenceGroup } from '../types/store';

const planningNodes: ProjectNode[] = [
  {
    id: 'intro',
    stage: 'planning',
    category: 'code-generation',
    title: '介绍项目',
    description: '项目需求描述',
    defaultPrompt: "I'm starting a new project and I'd like to create a knowledge base for you to reference throughout our development process. The project is [brief description]. We'll be using [tech stack]. The key features we need to implement are [list features]. Some important constraints to keep in mind are [list constraints]. In terms of coding style, we prefer [mention preferences]. Can you summarize this information and suggest any additional details we should include in our knowledge base?"
  },
  {
    id: 'components',
    stage: 'planning',
    category: 'code-generation',
    title: '拆分组件',
    description: '项目组件结构设计',
    defaultPrompt: "Based on the project overview we just created, can you help me break down this project into manageable components or modules? For each component, please suggest:\n1. A name for the component\n2. Its main functionality\n3. Potential challenges in implementing it\n4. How it might interact with other components\nPlease also recommend a logical order for developing these components."
  },
  {
    id: 'tech-stack',
    stage: 'planning',
    category: 'code-generation',
    title: '技术路线',
    description: '技术选型和架构设计',
    defaultPrompt: "Using the component breakdown we've created, can you help me develop a project roadmap? Please include:\n1. A suggested order for developing the components\n2. Estimated time frames for each component (assuming I'm working on this part-time)\n3. Potential milestones or checkpoints\n4. Any dependencies between components that might affect the development order\n5. Suggestions for any proof-of-concept or prototype stages that might be beneficial"
  },
  {
    id: 'solution',
    stage: 'planning',
    category: 'code-generation',
    title: '技术方案',
    description: '详细技术方案设计',
    defaultPrompt: "Let's think step-by-step about the architecture for [specific component or system]. Please consider:\n1. The main functionalities this component needs to support\n2. Potential data structures or models\n3. Key classes or modules and their responsibilities\n4. How this component will interact with other parts of the system\n5. Potential design patterns that could be applicable\n6. Considerations for scalability and maintainability\nFor each step, provide a brief explanation of your reasoning."
  }
];

const implementationNodes: ProjectNode[] = [
  {
    id: 'code-impl',
    stage: 'implementation',
    category: 'code-generation',
    title: '代码实现',
    description: '生成代码实现',
    defaultPrompt: "I need to implement [specific functionality] in [programming language].\nKey requirements:\n1. [Requirement 1]\n2. [Requirement 2]\n3. [Requirement 3]\nPlease consider:\n- Error handling\n- Edge cases\n- Performance optimization\n- Best practices for [language/framework]\nPlease do not unnecessarily remove any comments or code.\nGenerate the code with clear comments explaining the logic."
  },
  {
    id: 'code-review',
    stage: 'implementation',
    category: 'code-review',
    title: '代码审核',
    description: '代码审核和建议',
    defaultPrompt: "Please review the following code:\n[paste your code]\nConsider:\n1. Code quality and adherence to best practices\n2. Potential bugs or edge cases\n3. Performance optimizations\n4. Readability and maintainability\n5. Any security concerns\nSuggest improvements and explain your reasoning for each suggestion."
  },
  {
    id: 'db-design',
    stage: 'implementation',
    category: 'database-design',
    title: '数据库设计',
    description: '数据库架构设计',
    defaultPrompt: "I'm designing a database for [describe your application]. The main entities are:\n[List main entities]\n\nKey requirements:\n1. [Requirement 1]\n2. [Requirement 2]\n3. [Requirement 3]\n\nPlease suggest a database schema that includes:\n1. Tables and their columns (with appropriate data types)\n2. Primary and foreign key relationships\n3. Any necessary junction tables for many-to-many relationships\n4. Suggested indexes for performance\n5. Considerations for scalability"
  },
  {
    id: 'doc-gen',
    stage: 'implementation',
    category: 'documentation',
    title: '文档生成',
    description: '生成项目文档',
    defaultPrompt: "I need to create documentation for [project/component name]. Please generate:\n\n1. An overview of the [project/component]\n2. Installation instructions\n3. Configuration options\n4. API reference (if applicable)\n5. Usage examples\n6. Troubleshooting guide\n7. FAQ section\n\nFor each section, consider:\n- The target audience (e.g., developers, end-users)\n- Any prerequisites or dependencies\n- Common pitfalls or misconceptions\n- Best practices\n\nPlease use clear, concise language and include relevant code snippets where appropriate."
  }
];

const maintenanceNodes: ProjectNode[] = [];

// 将节点的默认提示词直接作为一个普通模板
const createDefaultPrompts = (nodes: ProjectNode[]): PromptTemplate[] => {
  return nodes.map(node => ({
    id: node.id,
    nodeId: node.id,
    title: node.title,
    description: node.description,
    content: node.defaultPrompt
  }));
};

// 修改 assistantPrompts 变量名为 additionalPrompts
const additionalPrompts: PromptTemplate[] = [
  // 代码实现的辅助模板
  {
    id: 'code-explain',
    nodeId: 'code-impl',
    title: '代码解释',
    description: '解释代码实现',
    content: "Can you explain the following part of the code in detail:\n[paste code section]\nSpecifically:\n1. What is the purpose of this section?\n2. How does it work step-by-step?\n3. Are there any potential issues or limitations with this approach?"
  },
  {
    id: 'algo-impl',
    nodeId: 'code-impl',
    title: '实现算法',
    description: '算法实现',
    content: "Implement a [name of algorithm] in [programming language].\nPlease include:\n1. The main function with clear parameter and return types\n2. Helper functions if necessary\n3. Time and space complexity analysis\n4. Example usage"
  },
  {
    id: 'class-gen',
    nodeId: 'code-impl',
    title: '生成类/模块',
    description: '生成类或模块代码',
    content: "Create a [class/module] for [specific functionality] in [programming language].\nInclude:\n1. Constructor/initialization\n2. Main methods with clear docstrings\n3. Any necessary private helper methods\n4. Proper encapsulation and adherence to OOP principles"
  },
  {
    id: 'code-optimize',
    nodeId: 'code-impl',
    title: '优化代码',
    description: '代码优化建议',
    content: "Here's a piece of code that needs optimization:\n[paste code]\nPlease suggest optimizations to improve its performance. For each suggestion, explain the expected improvement and any trade-offs."
  },
  {
    id: 'unit-test',
    nodeId: 'code-impl',
    title: '单元测试',
    description: '生成单元测试',
    content: "Generate unit tests for the following function:\n[paste function]\nInclude tests for:\n1. Normal expected inputs\n2. Edge cases\n3. Invalid inputs\nUse [preferred testing framework] syntax."
  },
  // 技术路线的辅助模板
  {
    id: 'tech-risk',
    nodeId: 'tech-stack',
    title: '风险评估',
    description: '评估项目风险并提供缓解策略',
    content: "Based on our project plan, can you identify potential risks or challenges we might face during development? For each risk, suggest possible mitigation strategies."
  },
  {
    id: 'tech-compare',
    nodeId: 'tech-stack',
    title: '技术对比',
    description: '比较不同技术方案的优劣',
    content: "We're considering using [Technology A] or [Technology B] for [specific functionality]. Can you compare these options in the context of our project, considering factors like performance, ease of implementation, and future scalability?"
  },
  {
    id: 'solution-iteration',
    nodeId: 'solution',
    title: '迭代优化',
    description: '优化初始技术方案',
    content: "Thank you for that initial design. I have a few follow-up questions:\n1. What are the potential drawbacks or limitations of this approach?\n2. Can you suggest an alternative design that prioritizes [specific concern, e.g., performance, flexibility]?\n3. How would this design need to change if we needed to [potential future requirement]?"
  },
  {
    id: 'design-pattern',
    nodeId: 'solution',
    title: '设计模式',
    description: '选择合适的设计模式',
    content: "Given our requirement to [specific functionality], which design patterns might be applicable? For each suggested pattern, please explain how it could be implemented in our system and what benefits it would provide."
  },
  {
    id: 'db-schema',
    nodeId: 'solution',
    title: '数据库schema',
    description: '设计数据库结构',
    content: "We need to design a database schema for [specific part of the system]. Based on our requirements, can you suggest an initial schema design? Please include tables, key fields, and relationships. Also, consider potential indexing strategies for performance."
  },
  {
    id: 'api-design',
    nodeId: 'solution',
    title: 'API设计',
    description: '设计API接口',
    content: "We're planning to create a RESTful API for [specific functionality]. Can you help design the endpoints we'll need? For each endpoint, suggest the HTTP method, URL structure, request/response formats, and any authentication requirements."
  },
  // 文档生成的辅助模板
  {
    id: 'doc-optimize',
    nodeId: 'doc-gen',
    title: '文档优化',
    description: '优化现有文档',
    content: "Please review and improve the following documentation section:\n[Paste section here]\n\nConsider:\n1. Clarity of explanation\n2. Completeness of information\n3. Appropriate level of detail for the target audience\n4. Consistency with best practices in technical writing\nSuggest improvements and explain your reasoning."
  },
  {
    id: 'api-doc',
    nodeId: 'doc-gen',
    title: 'API文档',
    description: '生成API文档',
    content: "Generate API documentation for the following endpoint:\n[Paste endpoint details]\nInclude:\n1. Endpoint URL and method\n2. Request parameters and their types\n3. Request body format (if applicable)\n4. Response format and possible status codes\n5. Example request and response\n6. Any authentication requirements\n7. Rate limiting information (if applicable)"
  },
  {
    id: 'readme-doc',
    nodeId: 'doc-gen',
    title: 'README文档',
    description: '生成README文档',
    content: "Create a README.md file for my GitHub repository. The project is [brief description]. Include:\n1. Project title and description\n2. Installation instructions\n3. Usage examples\n4. Contributing guidelines\n5. License information\n6. Badges (e.g., build status, version, etc.)\nUse proper Markdown formatting and consider adding a table of contents for easier navigation."
  },
  {
    id: 'user-guide',
    nodeId: 'doc-gen',
    title: '用户引导',
    description: '生成用户指南',
    content: "Generate a user guide for [product/feature name]. The target audience is [describe audience]. Include:\n1. Introduction and purpose of the product/feature\n2. Getting started guide\n3. Main features and how to use them\n4. Advanced usage tips\n5. Troubleshooting common issues\nUse simple language and consider including step-by-step instructions with hypothetical screenshots placeholders."
  },
  {
    id: 'code-comment',
    nodeId: 'doc-gen',
    title: '代码注释',
    description: '生成代码注释',
    content: "Generate appropriate comments and docstrings for the following code:\n[Paste code here]\nFollow [language-specific] conventions for docstrings. Include:\n1. Brief description of the function/class\n2. Parameters and their types\n3. Return value and type\n4. Any exceptions that might be raised\n5. Usage examples if the function/class usage is not immediately obvious"
  },
  {
    id: 'doc-update',
    nodeId: 'doc-gen',
    title: '文档更新',
    description: '更新现有文档',
    content: "I've made the following changes to my code:\n[Summarize changes]\nPlease update the relevant sections of the documentation to reflect these changes.\nHighlight any breaking changes or new features that users should be aware of."
  },
  {
    id: 'doc-review',
    nodeId: 'doc-gen',
    title: '文档审核',
    description: '审核现有文档',
    content: "Please review the following documentation:\n[Paste current docs]\nConsidering the latest best practices and common user pain points in similar projects:\n1. Suggest any sections that should be added or expanded\n2. Identify any parts that might be outdated or no longer relevant\n3. Recommend improvements for clarity and user-friendliness"
  }
];

const splitIntoSentences = (content: string): string[] => {
  // 只使用连续的换行符作为分隔符
  return content
    .split(/\n\n+/)
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
const defaultPrompts = createDefaultPrompts(allNodes);
const initialPrompts = processPrompts([...defaultPrompts, ...additionalPrompts]);

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
      const defaultPrompt = get().getDefaultPromptByNodeId(nodeId);
      set({ 
        currentNodeId: nodeId,
        currentPromptId: defaultPrompt?.id || null,
        customPrompt: defaultPrompt?.content || node.defaultPrompt,
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

  getDefaultPromptByNodeId: (nodeId: string) => {
    return get().prompts.find(prompt => prompt.id === nodeId);
  },

  parsePromptToSegments: (content: string) => {
    return parsePromptContent(content).segments;
  },

  generateFullPrompt: () => {
    const state = get();
    const currentPrompt = state.prompts.find(p => p.id === state.currentPromptId);
    
    if (!currentPrompt?.sentences) return '';

    // 处理每个句子组
    const completeSentences = currentPrompt.sentences.map(sentence => {
      return sentence.segments.map(segment => {
        if (segment.type === 'static') {
          return segment.content;
        } else {
          const inputKey = `${currentPrompt.id}-${segment.placeholder}`;
          // 如果输入框有值就用输入的值，否则保持占位符的方括号格式
          const inputValue = state.promptInputs[inputKey]?.trim();
          return inputValue || `[${segment.placeholder}]`;
        }
      }).join('');
    });

    return completeSentences.join('\n\n');
  }
})); 