const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

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

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Code Learning Assistant running on http://localhost:${PORT}`);
});