const http = require('http');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/') {
        serveCalculatorPage(res);
    } else if (req.url === '/calculate' && req.method === 'POST') {
        handleCalculation(req, res);
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

function serveCalculatorPage(res) {
    res.setHeader('Content-Type', 'text/html');
    res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simple Calculator</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: Arial, sans-serif;
                    background: #f0f0f0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                .calculator {
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    width: 300px;
                }
                .display {
                    background: #f8f9fa;
                    border: 2px solid #ddd;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 15px;
                    text-align: right;
                    font-size: 24px;
                    font-weight: bold;
                    min-height: 60px;
                }
                .buttons {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                }
                button {
                    padding: 15px;
                    border: none;
                    border-radius: 5px;
                    font-size: 18px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                button:hover {
                    background: #e9ecef;
                }
                .number {
                    background: #f8f9fa;
                }
                .operator {
                    background: #007bff;
                    color: white;
                }
                .operator:hover {
                    background: #0056b3;
                }
                .equals {
                    background: #28a745;
                    color: white;
                }
                .equals:hover {
                    background: #1e7e34;
                }
                .clear {
                    background: #dc3545;
                    color: white;
                }
                .clear:hover {
                    background: #bd2130;
                }
            </style>
        </head>
        <body>
         
            <div class="calculator">
            <h1 style="
    text-align: center;
">Calculator</h1>
                <div class="display" id="display">0</div>
                <div class="buttons">
                    <button class="clear" onclick="clearDisplay()">C</button>
                    <button class="operator" onclick="appendToDisplay('/')">/</button>
                    <button class="operator" onclick="appendToDisplay('*')">×</button>
                    <button class="operator" onclick="appendToDisplay('-')">-</button>
                    
                    <button class="number" onclick="appendToDisplay('7')">7</button>
                    <button class="number" onclick="appendToDisplay('8')">8</button>
                    <button class="number" onclick="appendToDisplay('9')">9</button>
                    <button class="operator" onclick="appendToDisplay('+')">+</button>
                    
                    <button class="number" onclick="appendToDisplay('4')">4</button>
                    <button class="number" onclick="appendToDisplay('5')">5</button>
                    <button class="number" onclick="appendToDisplay('6')">6</button>
                    <button class="equals" onclick="calculate()">=</button>
                    
                    <button class="number" onclick="appendToDisplay('1')">1</button>
                    <button class="number" onclick="appendToDisplay('2')">2</button>
                    <button class="number" onclick="appendToDisplay('3')">3</button>
                    <button class="number" onclick="appendToDisplay('0')">0</button>
                    
                    <button class="number" onclick="appendToDisplay('.')">.</button>
                    <button class="number" onclick="appendToDisplay('00')">00</button>
                </div>
            </div>

            <script>
                let currentInput = '0';
                let shouldResetDisplay = false;

                function updateDisplay() {
                    document.getElementById('display').textContent = currentInput;
                }

                function appendToDisplay(value) {
                    if (currentInput === '0' || shouldResetDisplay) {
                        currentInput = value;
                        shouldResetDisplay = false;
                    } else {
                        currentInput += value;
                    }
                    updateDisplay();
                }

                function clearDisplay() {
                    currentInput = '0';
                    updateDisplay();
                }

                async function calculate() {
                    try {
                        console.log('Calculating:', currentInput);
                        
                        const response = await fetch('/calculate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ expression: currentInput })
                        });

                        if (!response.ok) {
                            throw new Error('Server error: ' + response.status);
                        }

                        const result = await response.json();
                        console.log('Result:', result);

                        if (result.success) {
                            currentInput = result.result.toString();
                            shouldResetDisplay = true;
                            updateDisplay();
                        } else {
                            alert('Error: ' + result.error);
                            clearDisplay();
                        }
                    } catch (error) {
                        console.error('Calculation error:', error);
                        alert('Calculation failed: ' + error.message);
                        clearDisplay();
                    }
                }

                // Keyboard support
                document.addEventListener('keydown', (e) => {
                    if (e.key >= '0' && e.key <= '9') appendToDisplay(e.key);
                    else if (['+', '-', '*', '/', '.'].includes(e.key)) appendToDisplay(e.key);
                    else if (e.key === 'Enter') calculate();
                    else if (e.key === 'Escape') clearDisplay();
                });

                // Initialize display
                updateDisplay();
            </script>
        </body>
        </html>
    `);
}

function handleCalculation(req, res) {
    console.log('Received calculation request');
    
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            console.log('Raw body:', body);
            
            if (!body) {
                return sendError(res, 'No data received');
            }
            
            const data = JSON.parse(body);
            const expression = data.expression;
            
            console.log('Expression to evaluate:', expression);
            
            if (!expression || typeof expression !== 'string') {
                return sendError(res, 'Invalid expression');
            }
            
            // Simple safe evaluation
            try {
                const result = evaluateSimple(expression);
                console.log('Calculation result:', result);
                
                res.end(JSON.stringify({
                    success: true,
                    result: result
                }));
            } catch (error) {
                console.error('Evaluation error:', error);
                sendError(res, 'Calculation error: ' + error.message);
            }
            
        } catch (error) {
            console.error('JSON parse error:', error);
            sendError(res, 'Invalid data format');
        }
    });
}

function evaluateSimple(expr) {
    // Very basic evaluation - in production use a proper math parser
    console.log('Evaluating:', expr);
    
    // Remove any non-math characters for safety
    const cleanExpr = expr.replace(/[^0-9+\-*/.()]/g, '');
    
    try {
        // Use a simple eval alternative
        const tokens = cleanExpr.split(/([+\-*/])/).filter(token => token.trim() !== '');
        
        if (tokens.length < 3) {
            throw new Error('Invalid expression format');
        }
        
        let result = parseFloat(tokens[0]);
        
        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const nextNumber = parseFloat(tokens[i + 1]);
            
            switch (operator) {
                case '+':
                    result += nextNumber;
                    break;
                case '-':
                    result -= nextNumber;
                    break;
                case '*':
                    result *= nextNumber;
                    break;
                case '/':
                    if (nextNumber === 0) throw new Error('Division by zero');
                    result /= nextNumber;
                    break;
                default:
                    throw new Error('Unknown operator: ' + operator);
            }
        }
        
        return Math.round(result * 1000) / 1000; // Round to 3 decimal places
        
    } catch (error) {
        throw new Error('Could not evaluate expression: ' + error.message);
    }
}

function sendError(res, message) {
    console.error('Error:', message);
    res.end(JSON.stringify({
        success: false,
        error: message
    }));
}

server.listen(PORT, () => {
    console.log(`🚀 Calculator server running at http://localhost:${PORT}`);
    console.log(`📝 Open your browser and start calculating!`);
});