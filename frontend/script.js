class CodeLearningAssistant {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadLearningPaths();
        this.loadSampleCode();
    }

    initializeElements() {
        this.codeInput = document.getElementById('codeInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.languageSelect = document.getElementById('languageSelect');
        this.resultsSection = document.getElementById('resultsSection');
        this.loading = document.getElementById('loading');
        
        // Result containers
        this.analysisContent = document.getElementById('analysisContent');
        this.explanationContent = document.getElementById('explanationContent');
        this.learningContent = document.getElementById('learningContent');
        this.suggestionsContent = document.getElementById('suggestionsContent');
        this.learningPaths = document.getElementById('learningPaths');
    }

    bindEvents() {
        this.analyzeBtn.addEventListener('click', () => this.analyzeCode());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        // Auto-resize textarea
        this.codeInput.addEventListener('input', () => {
            this.codeInput.style.height = 'auto';
            this.codeInput.style.height = this.codeInput.scrollHeight + 'px';
        });

        // Keyboard shortcuts
        this.codeInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.analyzeCode();
            }
        });
    }

    loadSampleCode() {
        const sampleCode = `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate and display results
const numbers = [5, 8, 10];
numbers.forEach(num => {
    console.log(\`Fibonacci(\${num}) = \${fibonacci(num)}\`);
});`;
        
        this.codeInput.value = sampleCode;
        this.codeInput.style.height = this.codeInput.scrollHeight + 'px';
    }

    async analyzeCode() {
        const code = this.codeInput.value.trim();
        if (!code) {
            this.showError('Please enter some code to analyze');
            return;
        }

        this.showLoading(true);
        
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    language: this.languageSelect.value
                })
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const analysis = await response.json();
            this.displayResults(analysis);
            
        } catch (error) {
            console.error('Error analyzing code:', error);
            this.showError('Failed to analyze code. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(analysis) {
        // Analysis metrics
        this.analysisContent.innerHTML = `
            <div class="metric">
                <span class="metric-label">Complexity Score:</span>
                <span class="metric-value complexity-${this.getComplexityClass(analysis.complexity)}">${analysis.complexity}/10</span>
            </div>
            <div class="metric">
                <span class="metric-label">Lines of Code:</span>
                <span class="metric-value">${this.codeInput.value.split('\\n').length}</span>
            </div>
            <div class="patterns">
                <strong>Detected Patterns:</strong>
                ${analysis.patterns.map(pattern => `<span class="pattern-tag">${pattern}</span>`).join('')}
            </div>
        `;

        // AI Explanation
        this.explanationContent.innerHTML = `
            <p>${analysis.explanation}</p>
        `;

        // Learning Points
        this.learningContent.innerHTML = `
            <ul class="learning-list">
                ${analysis.learningPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
        `;

        // Suggestions
        this.suggestionsContent.innerHTML = `
            <ul class="suggestions-list">
                ${analysis.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        `;

        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    async loadLearningPaths() {
        try {
            const response = await fetch('/api/learning-paths');
            const paths = await response.json();
            
            this.learningPaths.innerHTML = paths.map(path => `
                <div class="learning-path-card">
                    <h3>${path.title}</h3>
                    <p>${path.description}</p>
                    <div class="topics">
                        ${path.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                    </div>
                    <button class="start-learning-btn" onclick="alert('Learning path: ${path.title}')">
                        Start Learning 🚀
                    </button>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading learning paths:', error);
        }
    }

    getComplexityClass(complexity) {
        if (complexity <= 3) return 'low';
        if (complexity <= 6) return 'medium';
        return 'high';
    }

    clearAll() {
        this.codeInput.value = '';
        this.codeInput.style.height = 'auto';
        this.resultsSection.style.display = 'none';
    }

    showLoading(show) {
        this.loading.style.display = show ? 'flex' : 'none';
        this.analyzeBtn.disabled = show;
    }

    showError(message) {
        alert(message); // In production, use a proper toast/notification system
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CodeLearningAssistant();
});