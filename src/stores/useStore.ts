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

const maintenanceNodes: ProjectNode[] = [
  {
    id: 'test',
    stage: 'maintenance',
    category: 'testing',
    title: '测试',
    description: '单元测试、集成测试等测试相关任务',
    defaultPrompt: `I need unit tests for the following function:
[Paste your function here]

Please generate a comprehensive set of unit tests that cover:
1. Happy path scenarios
2. Edge cases
3. Error conditions
4. Boundary value analysis

For each test case, please:
1. Provide a brief description of what the test is checking
2. Write the actual test code using [preferred testing framework, e.g., pytest]
3. Explain any mock objects or fixtures that might be needed

Also, suggest any additional tests that might be relevant based on common pitfalls or best practices for this type of function.`
  },
  {
    id: 'security',
    stage: 'maintenance',
    category: 'security',
    title: '代码安全',
    description: '代码安全审计与漏洞检测',
    defaultPrompt: `Please perform a security audit on the following code:
[Paste your code here]

In your audit, please:
1. Identify any potential security vulnerabilities, including but not limited to:
   - Injection flaws (SQL, NoSQL, OS command injection, etc.)
   - Broken authentication
   - Sensitive data exposure
   - XML External Entities (XXE)
   - Broken access control
   - Security misconfigurations
   - Cross-Site Scripting (XSS)
   - Insecure deserialization
   - Using components with known vulnerabilities
   - Insufficient logging & monitoring
2. For each vulnerability found:
   - Explain the potential impact
   - Suggest a fix or mitigation strategy
   - Provide a code snippet demonstrating the fix, if applicable
3. Suggest any general security improvements or best practices that could be applied to this code.
4. Recommend any security-related libraries or tools that could help improve the overall security posture of the application.`
  },
  {
    id: 'optimization',
    stage: 'maintenance',
    category: 'optimization',
    title: '优化',
    description: '代码优化与性能提升',
    defaultPrompt: `Please review the following code for quality and potential issues:
[Paste your code here]

In your review, please consider:
1. Code style and adherence to best practices
2. Potential bugs or edge cases not handled
3. Performance optimizations
4. Security vulnerabilities
5. Readability and maintainability

For each issue found, please:
1. Explain the problem
2. Suggest a fix
3. Provide a brief rationale for the suggested change

Additionally, are there any overall improvements or refactoring suggestions you would make for this code?`
  },
  {
    id: 'version-control',
    stage: 'maintenance',
    category: 'version-control',
    title: '版本控制',
    description: '代码版本管理相关任务',
    defaultPrompt: `I've made the following changes to my code:
[Paste your git diff or describe the changes]

Please help me create a commit message that:
1. Summarizes the changes concisely (50 characters or less for the subject line)
2. Provides more details in the body (wrap at 72 characters)
3. Follows best practices for git commit messages
4. Includes any relevant issue numbers or references

The commit message should be informative enough that team members can understand the changes without having to look at the code.`
  }
];

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
  },
  // 测试相关模板
  {
    id: 'integration-test',
    nodeId: 'test',
    title: '集成测试',
    description: '生成集成测试用例',
    content: `I need to create integration tests for the following components:
[List components and their interactions]

Please suggest a set of integration tests that:
1. Cover the main interaction scenarios between these components
2. Test for proper error handling and edge cases
3. Include any necessary setup and teardown procedures

Provide the test scenarios in a clear, step-by-step format, and include any necessary mock objects or test data.`
  },
  {
    id: 'performance-test',
    nodeId: 'test',
    title: '性能测试',
    description: '性能测试计划',
    content: `I need to create a performance test plan for my application. The key areas of concern are:
[List main functionalities or components to be tested]

Please help me create a performance test plan that includes:
1. Key performance indicators to measure
2. Test scenarios to simulate various load conditions
3. Suggestions for tools or frameworks to use
4. Strategies for identifying performance bottlenecks
5. Best practices for interpreting and acting on the results`
  },
  {
    id: 'security-test',
    nodeId: 'test',
    title: '安全测试',
    description: '安全测试用例',
    content: `Please review the following code for potential security vulnerabilities:
[Paste your code]

Consider common security issues such as:
1. Injection flaws
2. Broken authentication
3. Sensitive data exposure
4. XML external entities (XXE)
5. Broken access control
6. Security misconfigurations
7. Cross-site scripting (XSS)

For each vulnerability found, explain the risk and suggest secure coding practices to mitigate it.`
  },
  {
    id: 'test-data',
    nodeId: 'test',
    title: '测试数据',
    description: '生成测试数据',
    content: `I need to generate test data for the following database schema:
[Paste your schema here]

Please help me create a test data generation plan:
1. Suggest appropriate ranges or types of values for each field
2. Provide SQL or script to generate a diverse set of test data, including:
   - Normal cases
   - Edge cases
   - Invalid data to test error handling
3. Ensure referential integrity is maintained for related tables
4. Include any specific scenarios or data patterns crucial for thorough testing`
  },
  {
    id: 'debug',
    nodeId: 'test',
    title: 'Debug',
    description: '调试问题',
    content: `I'm encountering the following bug:
[Describe the bug, including any error messages and the steps to reproduce]

Here's the relevant code:
[Paste the code related to the bug]

Please help me debug this issue:
1. Analyze the code and suggest potential causes of the bug
2. Provide step-by-step debugging strategies I can follow
3. Suggest any tools or techniques that might be helpful in diagnosing the issue
4. If possible, propose potential fixes and explain their reasoning`
  },
  // 安全相关模板
  {
    id: 'sql-injection',
    nodeId: 'security',
    title: 'SQL注入检测',
    description: '检测SQL注入漏洞',
    content: `Please review the following database interaction code for potential SQL injection vulnerabilities:
[Paste your database interaction code]

For each vulnerability found:
1. Explain how it could be exploited
2. Provide a secure alternative implementation
3. Suggest any relevant security libraries or techniques specific to our database system`
  },
  {
    id: 'frontend-security',
    nodeId: 'security',
    title: '前端安全',
    description: '前端代码安全检查',
    content: `Please review the following front-end code for security best practices:
[Paste your front-end code]

Consider aspects such as:
1. Cross-Site Scripting (XSS) prevention
2. Secure handling of sensitive data
3. Protection against Cross-Site Request Forgery (CSRF)
4. Secure communication with back-end APIs

Provide specific recommendations for improving the security of this code, including any relevant libraries or techniques for our front-end framework.`
  },
  // 优化相关模板
  {
    id: 'performance-optimization',
    nodeId: 'optimization',
    title: '性能优化',
    description: '代码性能优化',
    content: `Please analyze the following code for performance optimization opportunities:
[Paste your code here]

In your analysis, please:
1. Identify any performance bottlenecks or inefficient operations
2. Suggest optimizations, considering:
   - Time complexity improvements
   - Memory usage optimization
   - Reduction of unnecessary operations or function calls
   - Potential for parallelization or asynchronous operations
   - Caching strategies
3. For each suggestion:
   - Explain the expected performance impact
   - Provide a code snippet demonstrating the optimization
   - Discuss any potential trade-offs`
  },
  {
    id: 'best-practices',
    nodeId: 'optimization',
    title: '最佳实践',
    description: '最新最佳实践更新',
    content: `Please provide an update on the latest best practices for [your language/framework] as of [current date], focusing on:
1. Security enhancements and newly discovered vulnerabilities
2. Performance optimization techniques
3. New language features or libraries that could improve security or performance
4. Any deprecated practices that should be avoided

For each point, please explain:
- What the practice or vulnerability is
- Why it's important
- How to implement or mitigate it in practical terms`
  },
  // 版本控制相关模板
  {
    id: 'merge-conflict',
    nodeId: 'version-control',
    title: '解决冲突',
    description: '解决合并冲突',
    content: `I'm facing the following merge conflict:
[Paste the conflicting code sections]

The feature I'm trying to merge aims to: [Briefly describe the feature's purpose]

Please help me resolve this conflict by:
1. Analyzing both versions of the code
2. Suggesting the best way to combine the changes
3. Providing a resolved version of the code
4. Explaining the reasoning behind the suggested resolution`
  },
  {
    id: 'code-review',
    nodeId: 'version-control',
    title: '代码评审',
    description: '代码评审建议',
    content: `Please review the following pull request:
[Paste the PR diff or provide a summary of changes]

In your review, please:
1. Identify any potential issues or improvements in the code
2. Check for adherence to our project's coding standards and best practices
3. Suggest any tests that might be needed
4. Point out any parts of the code that might need more documentation
5. Highlight any security or performance concerns`
  },
  {
    id: 'gitignore',
    nodeId: 'version-control',
    title: 'Gitignore',
    description: '生成.gitignore文件',
    content: `I'm starting a new [language/framework] project. Please help me create a comprehensive .gitignore file that:
1. Excludes common system and IDE files
2. Ignores language-specific build artifacts and dependencies
3. Ensures no sensitive information (like API keys) is accidentally committed

Please provide explanations for any non-obvious entries.`
  },
  {
    id: 'release-notes',
    nodeId: 'version-control',
    title: '发布日志',
    description: '生成发布日志',
    content: `We're preparing to release version [X.Y.Z] of our software. Based on the following commit history since our last release:
[Paste relevant commit history]

Please help me draft release notes that:
1. Summarize key new features
2. List any breaking changes and migration steps
3. Mention bug fixes and performance improvements
4. Thank contributors (if applicable)`
  },
  {
    id: 'branch-naming',
    nodeId: 'version-control',
    title: '分支命名',
    description: '分支命名规范',
    content: `Our team needs a consistent branch naming convention. Please suggest a branch naming strategy that:
1. Clearly indicates the type of work (e.g., feature, bugfix, hotfix)
2. Includes relevant ticket or issue numbers
3. Is concise but descriptive

Provide examples for different scenarios and explain the rationale behind the suggested convention.`
  },
  // 添加新的 Golang 技术方案模板
  {
    id: 'intro-golang-tech',
    nodeId: 'intro',
    title: '技术方案模板2',
    description: 'Golang开发技术方案模板',
    content: `作为一位经验丰富的Golang编程专家，您面临的具体开发任务为：[任务描述]。

请运用您的专业知识，详细阐述一种利用Golang实现该任务需求的高效算法或方法论。

在您的描述中，请务必涵盖以下几点：

具体实现步骤，包括必要的函数、类及数据结构的选择与设计。

边界条件分析，识别并解释潜在的边缘案例及如何妥善处理这些情况。

错误处理机制，描述如何在代码中实施健壮的错误检测与异常处理逻辑，以确保程序稳定性。

安全性考量，讨论可能的安全威胁及推荐的防范措施，确保代码执行过程中的数据安全与隐私保护。

性能优化建议，提出提高代码执行效率的方法，包括但不限于算法优化、资源管理和缓存策略。

请确保您的解答不仅技术准确，而且条理清晰、易于理解，以便其他开发者能够快速掌握并应用于实际项目中。`
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