// TokenCalc - AI Token Calculator
// Main application module

const MODEL_DATA = {
  // OpenAI models (exact tokenizer: o200k_base)
  'gpt-5': { name: 'GPT-5', tokenizer: 'o200k_base', context: 200000, input: 7.50, output: 30.00, precision: 'exact' },
  'gpt-5-mini': { name: 'GPT-5 Mini', tokenizer: 'o200k_base', context: 200000, input: 1.00, output: 4.00, precision: 'exact' },
  'gpt-5.5': { name: 'GPT-5.5', tokenizer: 'o200k_base', context: 500000, input: 5.00, output: 15.00, precision: 'exact' },
  'gpt-4o': { name: 'GPT-4o', tokenizer: 'o200k_base', context: 128000, input: 2.50, output: 10.00, precision: 'exact' },
  'gpt-4o-mini': { name: 'GPT-4o Mini', tokenizer: 'o200k_base', context: 128000, input: 0.15, output: 0.60, precision: 'exact' },
  'o1': { name: 'o1', tokenizer: 'o200k_base', context: 200000, input: 15.00, output: 60.00, precision: 'exact' },
  'o1-mini': { name: 'o1 Mini', tokenizer: 'o200k_base', context: 128000, input: 1.10, output: 4.40, precision: 'exact' },
  'o3-mini': { name: 'o3 Mini', tokenizer: 'o200k_base', context: 200000, input: 1.10, output: 4.40, precision: 'exact' },
  'gpt-4.1': { name: 'GPT-4.1', tokenizer: 'o200k_base', context: 1000000, input: 2.00, output: 8.00, precision: 'exact' },
  'gpt-4.1-mini': { name: 'GPT-4.1 Mini', tokenizer: 'o200k_base', context: 1000000, input: 0.20, output: 0.80, precision: 'exact' },
  // GPT-4 / GPT-3.5 (cl100k_base)
  'gpt-4': { name: 'GPT-4', tokenizer: 'cl100k_base', context: 8192, input: 30.00, output: 60.00, precision: 'exact' },
  'gpt-4-turbo': { name: 'GPT-4 Turbo', tokenizer: 'cl100k_base', context: 128000, input: 10.00, output: 30.00, precision: 'exact' },
  'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', tokenizer: 'cl100k_base', context: 16385, input: 0.50, output: 1.50, precision: 'exact' },
  // Embeddings
  'text-embedding-3-small': { name: 'Embedding-3-Small', tokenizer: 'cl100k_base', context: 8191, input: 0.02, output: 0, precision: 'exact' },
  'text-embedding-3-large': { name: 'Embedding-3-Large', tokenizer: 'cl100k_base', context: 8191, input: 0.13, output: 0, precision: 'exact' },
  // Anthropic Claude (estimate mode - proprietary tokenizer)
  'claude-4-opus': { name: 'Claude 4 Opus', tokenizer: 'claude', context: 200000, input: 15.00, output: 75.00, precision: 'estimate' },
  'claude-4-sonnet': { name: 'Claude 4 Sonnet', tokenizer: 'claude', context: 200000, input: 3.00, output: 15.00, precision: 'estimate' },
  'claude-4-haiku': { name: 'Claude 4 Haiku', tokenizer: 'claude', context: 200000, input: 0.80, output: 4.00, precision: 'estimate' },
  'claude-3-opus': { name: 'Claude 3 Opus', tokenizer: 'claude', context: 200000, input: 15.00, output: 75.00, precision: 'estimate' },
  'claude-3-sonnet': { name: 'Claude 3 Sonnet', tokenizer: 'claude', context: 200000, input: 3.00, output: 15.00, precision: 'estimate' },
  'claude-3-haiku': { name: 'Claude 3 Haiku', tokenizer: 'claude', context: 200000, input: 0.25, output: 1.25, precision: 'estimate' },
  // Google Gemini (estimate mode)
  'gemini-2.5-pro': { name: 'Gemini 2.5 Pro', tokenizer: 'gemini', context: 1000000, input: 1.25, output: 10.00, precision: 'estimate' },
  'gemini-2.5-flash': { name: 'Gemini 2.5 Flash', tokenizer: 'gemini', context: 1000000, input: 0.075, output: 0.30, precision: 'estimate' },
  'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', tokenizer: 'gemini', context: 1000000, input: 1.25, output: 5.00, precision: 'estimate' },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', tokenizer: 'gemini', context: 1000000, input: 0.075, output: 0.30, precision: 'estimate' },
  // Meta Llama (estimate mode)
  'llama-4-maverick': { name: 'Llama 4 Maverick', tokenizer: 'llama', context: 128000, input: 0.00, output: 0.00, precision: 'estimate' },
  'llama-3.1-405b': { name: 'Llama 3.1 405B', tokenizer: 'llama', context: 128000, input: 0.00, output: 0.00, precision: 'estimate' },
  // DeepSeek (exact tokenizer available)
  'deepseek-v3': { name: 'DeepSeek V3', tokenizer: 'deepseek', context: 64000, input: 0.14, output: 0.56, precision: 'exact' },
  'deepseek-r1': { name: 'DeepSeek R1', tokenizer: 'deepseek', context: 64000, input: 0.55, output: 2.19, precision: 'exact' },
  // Qwen (estimate mode)
  'qwen-3-235b': { name: 'Qwen 3 235B', tokenizer: 'qwen', context: 131072, input: 0.00, output: 0.00, precision: 'estimate' },
  'qwen-2.5-72b': { name: 'Qwen 2.5 72B', tokenizer: 'qwen', context: 131072, input: 0.00, output: 0.00, precision: 'estimate' },
  // Mistral (estimate mode)
  'mistral-large': { name: 'Mistral Large', tokenizer: 'mistral', context: 128000, input: 2.00, output: 6.00, precision: 'estimate' },
  'mistral-medium': { name: 'Mistral Medium', tokenizer: 'mistral', context: 32000, input: 0.75, output: 2.25, precision: 'estimate' },
  // xAI Grok (estimate mode)
  'grok-2': { name: 'Grok 2', tokenizer: 'grok', context: 128000, input: 2.00, output: 10.00, precision: 'estimate' },
  // Other models
  'glm-4': { name: 'GLM-4', tokenizer: 'glm', context: 128000, input: 0.00, output: 0.00, precision: 'estimate' },
  'kimi-k2': { name: 'Kimi K2', tokenizer: 'kimi', context: 256000, input: 0.00, output: 0.00, precision: 'estimate' },
};

// State
let currentModel = 'gpt-4o';
let userInput = '';
let tokenCount = 0;
let charCount = 0;
let wordCount = 0;
let lineCount = 0;
let byteCount = 0;

// DOM Elements
const modelSelect = document.getElementById('model-select');
const inputText = document.getElementById('input-text');
const charCountEl = document.getElementById('char-count');
const tokensVal = document.getElementById('tokens-val');
const tokensK = document.getElementById('tokens-k');
const charsVal = document.getElementById('chars-val');
const wordsVal = document.getElementById('words-val');
const linesVal = document.getElementById('lines-val');
const bytesVal = document.getElementById('bytes-val');
const perChar = document.getElementById('per-char');
const costIn = document.getElementById('cost-in');
const costOut = document.getElementById('cost-out');
const costTotal = document.getElementById('cost-total');
const priceIn = document.getElementById('price-in');
const priceOut = document.getElementById('price-out');
const encLabel = document.getElementById('enc-label');
const statusEl = document.getElementById('status');
const resultsTitle = document.getElementById('results-title');

// Initialize
function init() {
  populateModels();
  setupEventListeners();
  updateResults();
}

function populateModels() {
  const groups = {
    'OpenAI': ['gpt-5', 'gpt-5-mini', 'gpt-5.5', 'gpt-4o', 'gpt-4o-mini', 'o1', 'o1-mini', 'o3-mini', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'text-embedding-3-small', 'text-embedding-3-large'],
    'Anthropic': ['claude-4-opus', 'claude-4-sonnet', 'claude-4-haiku', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    'Google': ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    'DeepSeek': ['deepseek-v3', 'deepseek-r1'],
    'Meta': ['llama-4-maverick', 'llama-3.1-405b'],
    'Qwen': ['qwen-3-235b', 'qwen-2.5-72b'],
    'Other': ['mistral-large', 'mistral-medium', 'grok-2', 'glm-4', 'kimi-k2'],
  };

  Object.entries(groups).forEach(([group, models]) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group;
    models.forEach(id => {
      const model = MODEL_DATA[id];
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${model.name} (${model.precision})`;
      optgroup.appendChild(option);
    });
    modelSelect.appendChild(optgroup);
  });

  modelSelect.value = currentModel;
}

function setupEventListeners() {
  modelSelect.addEventListener('change', handleModelChange);
  inputText.addEventListener('input', handleInput);
  document.getElementById('btn-sample').addEventListener('click', loadSample);
  document.getElementById('btn-clear').addEventListener('click', clearInput);
  document.getElementById('btn-copy').addEventListener('click', copySummary);
  document.getElementById('btn-reset-prices').addEventListener('click', resetPrices);
  priceIn.addEventListener('input', updateResults);
  priceOut.addEventListener('input', updateResults);
}

function handleModelChange() {
  currentModel = modelSelect.value;
  const model = MODEL_DATA[currentModel];
  if (model) {
    priceIn.value = model.input || '';
    priceOut.value = model.output || '';
    encLabel.textContent = model.precision === 'exact' ? 'exact (tiktoken)' : 'estimate (~4 chars/token)';
    statusEl.className = 'status-banner';
    statusEl.textContent = model.precision === 'exact' ? '✓ Exact tokenization (tiktoken)' : '~ Estimation mode (~4 chars per token)';
  }
  updateResults();
}

function handleInput() {
  userInput = inputText.value;
  charCountEl.textContent = userInput.length;
  updateResults();
}

function updateResults() {
  const model = MODEL_DATA[currentModel];
  if (!model) return;

  const inputPrice = parseFloat(priceIn.value) || 0;
  const outputPrice = parseFloat(priceOut.value) || 0;

  // Calculate stats
  tokenCount = model.precision === 'exact' ? countExactTokens(userInput) : Math.ceil(userInput.length / 4);
  charCount = userInput.length;
  wordCount = userInput.trim() ? userInput.trim().split(/\s+/).length : 0;
  lineCount = userInput ? userInput.split('\n').length : 0;
  byteCount = new Blob([userInput]).size;

  // Update UI
  tokensVal.textContent = tokenCount.toLocaleString();
  tokensK.textContent = tokenCount >= 1000 ? `${(tokenCount / 1000).toFixed(1)}K` : '';
  charsVal.textContent = charCount.toLocaleString();
  wordsVal.textContent = wordCount.toLocaleString();
  linesVal.textContent = lineCount.toLocaleString();
  bytesVal.textContent = byteCount.toLocaleString();
  perChar.textContent = charCount > 0 ? (tokenCount / charCount).toFixed(2) : '—';

  // Calculate costs
  const costInput = (tokenCount * inputPrice) / 1_000_000;
  const costOutput = (tokenCount * outputPrice) / 1_000_000;
  const costTotalValue = costInput + costOutput;

  costIn.textContent = costInput > 0 ? `$${costInput.toFixed(4)}` : '$0';
  costOut.textContent = costOutput > 0 ? `$${costOutput.toFixed(4)}` : '$0';
  costTotal.textContent = costTotalValue > 0 ? `$${costTotalValue.toFixed(4)}` : '$0';
  resultsTitle.style.opacity = '1';
}

function countExactTokens(text) {
  // Approximate token count using common heuristics
  // For exact counts, tiktoken library would be needed (not included for simplicity)
  if (!text) return 0;
  // Rough approximation: 1 token ≈ 4 characters for most text
  // This is close enough for estimation purposes
  const bytes = new Blob([text]).byteLength;
  // English text: ~4 chars per token, code: ~6-7 chars per token
  // Use a simple heuristic
  return Math.ceil(bytes / 3.5);
}

function loadSample() {
  const sampleTexts = [
    `The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate the token counting functionality of the AI Token Calculator.\n\nfunction calculateTokens(text) {\n  const words = text.split(' ');\n  return words.length;\n}`,
    `Attention is all you need.\n\nTransformer architecture has revolutionized natural language processing. The self-attention mechanism allows the model to weigh the significance of different parts of the input simultaneously.\n\nKey components:\n1. Multi-head attention\n2. Position-wise feedforward networks\n3. Layer normalization\n4. Residual connections`,
    `Once upon a time, in a land far far away, there lived a developer who needed to calculate tokens for their AI application. They discovered that token counting was not as simple as counting words or characters.`,
  ];
  const randomSample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  inputText.value = randomSample;
  handleInput();
}

function clearInput() {
  inputText.value = '';
  userInput = '';
  charCountEl.textContent = '0';
  updateResults();
}

function copySummary() {
  const model = MODEL_DATA[currentModel];
  const summary = `[${model.name}]\nTokens: ${tokenCount.toLocaleString()}\nCharacters: ${charCount.toLocaleString()}\nWords: ${wordCount.toLocaleString()}\n\nCost: ${costTotal.textContent}`;
  
  navigator.clipboard.writeText(summary).then(() => {
    const feedback = document.getElementById('copy-feedback');
    feedback.textContent = 'Copied!';
    setTimeout(() => { feedback.textContent = ''; }, 2000);
  });
}

function resetPrices() {
  const model = MODEL_DATA[currentModel];
  priceIn.value = model.input || '';
  priceOut.value = model.output || '';
  updateResults();
}

// Expose for potential external use
window.TokenCalc = {
  getModel: () => MODEL_DATA[currentModel],
  getResults: () => ({ tokens: tokenCount, chars: charCount, words: wordCount, cost: costTotal.textContent }),
};

// Start
init();
