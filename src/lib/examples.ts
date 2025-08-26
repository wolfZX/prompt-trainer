import { PromptExample, PromptCategory } from '@/types';

export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: 'creative_story',
    category: PromptCategory.CREATIVE,
    title: 'Creative Storytelling',
    poorExample: {
      prompt: 'Write a story',
      issues: [
        'Too vague - no genre, length, or theme specified',
        'No target audience mentioned',
        'Missing context or constraints',
        'No specific requirements'
      ],
      score: 25
    },
    goodExample: {
      prompt: 'Write a 500-word science fiction short story for young adults about a teenager who discovers they can communicate with AI systems. The story should explore themes of technology and human connection, written in first person with a hopeful tone.',
      improvements: [
        'Specific word count (500 words)',
        'Clear genre (science fiction)',
        'Target audience (young adults)',
        'Detailed premise and character',
        'Theme specified',
        'Point of view and tone defined'
      ],
      score: 92
    },
    explanation: 'The improved prompt provides clear constraints, target audience, theme, and specific requirements that guide the AI toward producing exactly what you want.',
    tips: [
      'Always specify length or format requirements',
      'Include your target audience',
      'Mention specific themes or topics to explore',
      'Define the tone and style you want'
    ]
  },

  {
    id: 'technical_code',
    category: PromptCategory.CODING,
    title: 'Code Implementation',
    poorExample: {
      prompt: 'Write some JavaScript code',
      issues: [
        'No specific functionality requested',
        'Missing context about the application',
        'No coding standards or style preferences',
        'No error handling requirements mentioned'
      ],
      score: 20
    },
    goodExample: {
      prompt: 'Create a JavaScript function called validateEmail that takes a string parameter and returns true if it\'s a valid email format, false otherwise. Use modern ES6+ syntax, include JSDoc comments, and add basic error handling for null/undefined inputs. The function should work in both browser and Node.js environments.',
      improvements: [
        'Specific function name and purpose',
        'Clear input/output requirements',
        'Coding style preferences (ES6+)',
        'Documentation requirements (JSDoc)',
        'Error handling specified',
        'Environment compatibility noted'
      ],
      score: 95
    },
    explanation: 'Technical prompts need precise specifications about functionality, coding standards, documentation, and edge cases.',
    tips: [
      'Name your functions and variables specifically',
      'Specify coding standards and syntax preferences',
      'Include documentation requirements',
      'Mention error handling and edge cases'
    ]
  },

  {
    id: 'analytical_comparison',
    category: PromptCategory.ANALYTICAL,
    title: 'Analysis and Comparison',
    poorExample: {
      prompt: 'Compare these two things',
      issues: [
        'No specific subjects to compare',
        'Missing criteria for comparison',
        'No format requirements',
        'Vague and unhelpful'
      ],
      score: 15
    },
    goodExample: {
      prompt: 'Compare React and Vue.js frameworks for building modern web applications. Focus on learning curve, performance, ecosystem, and community support. Present the analysis in a structured format with pros/cons for each framework and conclude with recommendations for different use cases. Target audience: intermediate developers considering framework migration.',
      improvements: [
        'Specific subjects identified (React vs Vue.js)',
        'Clear comparison criteria listed',
        'Structured format requested',
        'Target audience specified',
        'Actionable conclusion requested'
      ],
      score: 88
    },
    explanation: 'Analytical prompts should specify exactly what to compare, the criteria for comparison, and how to present the results.',
    tips: [
      'Clearly state what you want compared',
      'List specific criteria or aspects to analyze',
      'Request structured output format',
      'Ask for actionable conclusions or recommendations'
    ]
  },

  {
    id: 'instructional_tutorial',
    category: PromptCategory.INSTRUCTIONAL,
    title: 'Tutorial Creation',
    poorExample: {
      prompt: 'Teach me something',
      issues: [
        'No subject specified',
        'Missing skill level context',
        'No format preferences',
        'Too broad and unfocused'
      ],
      score: 22
    },
    goodExample: {
      prompt: 'Create a beginner-friendly tutorial on setting up a Node.js development environment on macOS. Include step-by-step instructions with terminal commands, troubleshooting common issues, and verification steps to confirm successful installation. Format as numbered steps with code blocks and include estimated time to complete (aim for 15-20 minutes).',
      improvements: [
        'Specific topic (Node.js setup)',
        'Target platform (macOS)',
        'Skill level specified (beginner)',
        'Detailed format requirements',
        'Troubleshooting included',
        'Time estimate provided'
      ],
      score: 93
    },
    explanation: 'Instructional prompts need to specify the topic, audience skill level, format, and additional helpful elements like troubleshooting.',
    tips: [
      'Define the specific topic and scope',
      'Specify the target audience skill level',
      'Request step-by-step format with verification',
      'Ask for troubleshooting and common issues'
    ]
  },

  {
    id: 'conversational_chat',
    category: PromptCategory.CONVERSATIONAL,
    title: 'Conversational Interaction',
    poorExample: {
      prompt: 'Talk to me',
      issues: [
        'No conversation topic specified',
        'Missing context about the user',
        'No desired tone or style',
        'Completely open-ended'
      ],
      score: 18
    },
    goodExample: {
      prompt: 'I\'m a marketing professional looking to understand AI tools for content creation. I\'d like to have a friendly, informative conversation about practical applications, potential challenges, and recommendations for getting started. Please ask clarifying questions about my specific needs and experience level.',
      improvements: [
        'User background provided',
        'Specific topic area defined',
        'Desired tone specified (friendly, informative)',
        'Clear objective stated',
        'Interactive element requested'
      ],
      score: 85
    },
    explanation: 'Good conversational prompts provide context about yourself, the topic you want to discuss, and the style of interaction you prefer.',
    tips: [
      'Share relevant background about yourself',
      'Specify the topic or area of interest',
      'Define the tone and style you want',
      'Encourage questions and interaction'
    ]
  },

  {
    id: 'technical_analysis',
    category: PromptCategory.TECHNICAL,
    title: 'Technical Problem Analysis',
    poorExample: {
      prompt: 'Fix this error',
      issues: [
        'No error details provided',
        'Missing code context',
        'No environment information',
        'No attempted solutions mentioned'
      ],
      score: 12
    },
    goodExample: {
      prompt: 'I\'m getting a "Cannot read property \'length\' of undefined" error in my React component when mapping over an array from an API call. The component renders before the data loads. Here\'s the relevant code: [code snippet]. I\'m using React 18 with hooks. I\'ve tried adding a loading state but the error persists. Please explain why this happens and provide 2-3 different solutions with their trade-offs.',
      improvements: [
        'Specific error message included',
        'Code context provided',
        'Technical environment specified',
        'Attempted solutions mentioned',
        'Multiple solution options requested'
      ],
      score: 91
    },
    explanation: 'Technical problem-solving prompts need complete context: the error, code, environment, and what you\'ve already tried.',
    tips: [
      'Include the exact error message',
      'Provide relevant code snippets',
      'Specify your technical environment',
      'Mention what you\'ve already tried'
    ]
  }
];

export function getExamplesByCategory(category: PromptCategory): PromptExample[] {
  return PROMPT_EXAMPLES.filter(example => example.category === category);
}

export function getRandomExample(): PromptExample {
  return PROMPT_EXAMPLES[Math.floor(Math.random() * PROMPT_EXAMPLES.length)];
}

export function getExampleById(id: string): PromptExample | undefined {
  return PROMPT_EXAMPLES.find(example => example.id === id);
}