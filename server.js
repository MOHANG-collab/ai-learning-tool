const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Mock AI analysis function (replace with actual AI service)
function analyzeCode(code, language) {
  // This would integrate with OpenAI or similar service
  const analysis = {
    complexity: Math.floor(Math.random() * 10) + 1,
    patterns: ['Function Declaration', 'Variable Assignment', 'Conditional Logic'],
    suggestions: [
      'Consider breaking down large functions into smaller, more focused ones',
      'Add error handling for better robustness',
      'Consider using more descriptive variable names'
    ],
    explanation: `This ${language} code demonstrates several programming concepts. The structure shows ${code.split('\n').length} lines with various programming patterns.`,
    learningPoints: [
      'Understanding function scope and closure',
      'Best practices for variable naming',
      'Error handling patterns'
    ]
  };
  return analysis;
}

// API Routes
app.post('/api/analyze', (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const analysis = analyzeCode(code, language);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze code' });
  }
});

app.get('/api/learning-paths', (req, res) => {
  const learningPaths = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Master the basics of JavaScript programming',
      topics: ['Variables', 'Functions', 'Objects', 'Arrays', 'Async/Await']
    },
    {
      id: 2,
      title: 'React Development',
      description: 'Build modern web applications with React',
      topics: ['Components', 'State Management', 'Hooks', 'Routing']
    },
    {
      id: 3,
      title: 'Node.js Backend',
      description: 'Create robust server-side applications',
      topics: ['Express.js', 'APIs', 'Database Integration', 'Authentication']
    }
  ];
  
  res.json(learningPaths);
});

// Chatbot API endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { message, pathId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Learning path content database
    const learningContent = {
      1: { // JavaScript Fundamentals
        keywords: {
          'variable': 'Variables in JavaScript are containers for storing data. You can declare them using var, let, or const. Use let for values that change and const for constants.',
          'function': 'Functions are reusable blocks of code. You can create them using function declarations, expressions, or arrow functions. Example: const greet = (name) => `Hello ${name}!`',
          'object': 'Objects are collections of key-value pairs. Example: const person = { name: "John", age: 30 }. Access properties with dot notation or brackets.',
          'array': 'Arrays are ordered lists of values. Example: const numbers = [1, 2, 3]. Use methods like map(), filter(), and reduce() for manipulation.',
          'async': 'Async/await makes asynchronous code look synchronous. Use async before a function and await before promises. Example: const data = await fetch(url);'
        }
      },
      2: { // React Development
        keywords: {
          'component': 'React components are reusable UI pieces. Functional components are JavaScript functions that return JSX. Example: const Button = () => <button>Click me</button>',
          'state': 'State is data that changes over time. Use useState hook: const [count, setCount] = useState(0). Update state with the setter function.',
          'hook': 'Hooks let you use state and lifecycle in functional components. Common hooks: useState, useEffect, useContext, useCallback, useMemo.',
          'props': 'Props pass data from parent to child components. Example: <Button text="Click me" onClick={handleClick} />. Props are read-only.',
          'jsx': 'JSX is JavaScript XML syntax. It looks like HTML but is JavaScript. Use {} for expressions: <div>{userName}</div>'
        }
      },
      3: { // Node.js Backend
        keywords: {
          'express': 'Express is a minimal Node.js web framework. Create routes: app.get("/api/users", (req, res) => res.json(users)). Use middleware for common tasks.',
          'api': 'APIs are interfaces for communication. RESTful APIs use HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove).',
          'database': 'Databases store application data. Use MongoDB with Mongoose or PostgreSQL with Sequelize. Always validate and sanitize user input.',
          'authentication': 'Authentication verifies user identity. Use JWT tokens, bcrypt for passwords, and sessions. Never store passwords in plain text!',
          'middleware': 'Middleware functions process requests before routes. Example: app.use(express.json()) parses JSON bodies. Chain multiple middleware.'
        }
      }
    };

    // Generate response based on message content
    let response = '';
    const content = learningContent[pathId];
    
    if (content) {
      // Check for keywords in the message
      const messageLower = message.toLowerCase();
      let foundKeyword = false;
      
      for (const [keyword, explanation] of Object.entries(content.keywords)) {
        if (messageLower.includes(keyword)) {
          response = explanation;
          foundKeyword = true;
          break;
        }
      }
      
      if (!foundKeyword) {
        // Default responses
        const defaultResponses = [
          `Great question! In this learning path, we cover topics like ${Object.keys(content.keywords).join(', ')}. What specific topic would you like to explore?`,
          `I can help you understand that better! Try asking about: ${Object.keys(content.keywords).slice(0, 3).join(', ')}, or any other related topic.`,
          `That's an interesting question! Let me know which specific concept you'd like to dive into, and I'll provide detailed explanations with examples.`
        ];
        response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }
    } else {
      response = 'I\'m here to help you learn! Ask me about any topic in this learning path.';
    }

    res.json({ response });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Code Learning Assistant running on http://localhost:${PORT}`);
});