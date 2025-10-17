// Workflow Workstep Log Analyzer - JavaScript Logic
// Author: Asif Peshkar @ Nexum Software

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const logInput = document.getElementById('logInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const summaryCards = document.getElementById('summaryCards');

    // State management
    let analysisResults = null;
    let parsedWorkflowData = null;
    let fileName = null;
    let filterMinOccurrences = false;

    // Initialize event listeners
    initializeEventListeners();

    function initializeEventListeners() {
        // File upload button click
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', handleFileUpload);

        // Drag and drop functionality
        setupDragAndDrop();

        // Button event listeners
        analyzeBtn.addEventListener('click', analyzeLog);
        resetBtn.addEventListener('click', resetApplication);
        downloadBtn.addEventListener('click', downloadCSV);

        // Textarea input event to update UI state
        logInput.addEventListener('input', updateUIState);
    }

    function setupDragAndDrop() {
        const uploadArea = uploadBtn;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight(e) {
            uploadArea.classList.add('border-teal-500', 'bg-teal-50');
        }

        function unhighlight(e) {
            uploadArea.classList.remove('border-teal-500', 'bg-teal-50');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        }
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    }

    function handleFileSelection(file) {
        // Validate file type
        const validTypes = ['.log', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(fileExtension)) {
            showNotification('Please select a valid log file (.log or .txt)', 'error');
            return;
        }

        // Store filename for later use
        fileName = file.name;

        // Read file content
        const reader = new FileReader();
        reader.onload = function(e) {
            logInput.value = e.target.result;
            updateUIState();
            showNotification(`File "${fileName}" loaded successfully!`, 'success');
            
            // Update upload button text
            uploadBtn.innerHTML = `
                <svg class="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-semibold">${fileName}</span>
            `;
            uploadBtn.classList.add('text-green-600', 'border-green-400', 'bg-green-50');
        };

        reader.onerror = function() {
            showNotification('Error reading file. Please try again.', 'error');
        };

        reader.readAsText(file);
    }

    function analyzeLog() {
        const logContent = logInput.value.trim();
        
        if (!logContent) {
            showNotification('Please provide log content to analyze.', 'warning');
            return;
        }

        // Show loading state
        showLoadingState();

        // Run analysis after a short delay to show loading state
        setTimeout(() => {
            try {
                // Parse the log content
                parsedWorkflowData = parseWorkflowLog(logContent);
                
                // Display results
                displayAnalysisResults(parsedWorkflowData);
                
                // Update summary
                updateSummaryCards(parsedWorkflowData);
                
                // Scramble sensitive data in the left pane after analysis
                scrambleSensitiveData();
                
                showNotification('Analysis completed successfully! Sensitive data has been scrambled for privacy.', 'success');
            } catch (error) {
                console.error('Analysis error:', error);
                showNotification('Error during analysis. Please check your log format.', 'error');
                displayErrorState();
            }
        }, 500);
    }

    function parseWorkflowLog(logContent) {
        const lines = logContent.split('\n');
        const workflowStepCounts = {};
        let totalMatches = 0;
        let totalLines = lines.length;

        // Define regex patterns for different log formats
        const patterns = [
            // Pattern 1: Your specific format - "Processing Workflow NAME Workstep STEPNAME WorkAction Default"
            /Processing\s+Workflow\s+(\w+)\s+Workstep\s+(\w+)\s+WorkAction/i,
            
            // Pattern 2: Standard format - Started workflow 'X' workstep 'Y'
            /(?:started|completed|processing|executing)\s+workflow\s+['"]([^'"]+)['"]\s+workstep\s+['"]([^'"]+)['"]/i,
            
            // Pattern 3: Processing format - Processing workflow: X | Step: Y
            /(?:processing|executing)\s+workflow:\s*([^|]+)\s*\|\s*(?:step|workstep):\s*(.+)/i,
            
            // Pattern 4: Workflow [X] - Step [Y]
            /workflow\s*\[([^\]]+)\]\s*-\s*(?:step|workstep)\s*\[([^\]]+)\]/i,
            
            // Pattern 5: "WF: X, WS: Y" or "Workflow: X, Workstep: Y"
            /(?:wf|workflow):\s*([^,]+),\s*(?:ws|workstep):\s*(.+)/i,
            
            // Pattern 6: "X.Y" (workflow.workstep format)
            /^([a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s*$/,
            
            // Pattern 7: More flexible quoted format
            /['"]([^'"]+)['"].*['"]([^'"]+)['"]/,
            
            // Pattern 8: Workflow and workstep on same line with various separators
            /(?:workflow|wf)\s*[:=]\s*([^,;\s]+)[\s,;]+(?:workstep|step|ws)\s*[:=]\s*(.+)/i
        ];

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            for (let i = 0; i < patterns.length; i++) {
                const pattern = patterns[i];
                const match = trimmedLine.match(pattern);
                if (match) {
                    let workflow, workstep;
                    
                    if (i === 5) { // Pattern 6: Special handling for X.Y format
                        const parts = match[1].split('.');
                        if (parts.length >= 2) {
                            workflow = parts[0];
                            workstep = parts.slice(1).join('.');
                        } else {
                            continue; // Skip if not enough parts
                        }
                    } else {
                        workflow = match[1];
                        workstep = match[2] || "Unknown";
                    }
                    
                    // Normalize workflow and workstep names
                    workflow = normalizeText(workflow);
                    workstep = normalizeText(workstep);
                    
                    if (workflow && workstep) {
                        const key = `${workflow}|${workstep}`;
                        workflowStepCounts[key] = (workflowStepCounts[key] || 0) + 1;
                        totalMatches++;
                        break; // Found a match, no need to try other patterns
                    }
                }
            }
        });

        // Convert to array and sort by count (descending - highest first)
        const sortedResults = Object.entries(workflowStepCounts)
            .map(([key, count]) => {
                const [workflow, workstep] = key.split('|');
                return { workflow, workstep, count };
            })
            .sort((a, b) => b.count - a.count);

        return {
            results: sortedResults,
            totalLines,
            totalMatches,
            uniqueWorkflows: new Set(sortedResults.map(r => r.workflow)).size,
            uniqueWorksteps: new Set(sortedResults.map(r => r.workstep)).size
        };
    }

    function normalizeText(text) {
        if (!text) return '';
        
        // Remove surrounding quotes, brackets, and extra whitespace
        return text
            .replace(/^['"`\[\(]+/, '')  // Remove leading quotes/brackets
            .replace(/['"`\]\)]+$/, '')  // Remove trailing quotes/brackets
            .trim()
            .replace(/\s+/g, ' ');       // Normalize whitespace
    }

    function showLoadingState() {
        resultsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center">
                <div class="relative mb-6">
                    <div class="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                    <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-teal-400 rounded-full animate-ping"></div>
                </div>
                <h3 class="text-xl font-semibold text-gray-600 mb-3 animate-pulse-subtle">Analyzing log data...</h3>
                <p class="text-gray-500 animate-pulse-subtle" style="animation-delay: 0.2s;">Parsing workflow and workstep patterns...</p>
                <div class="mt-4 flex space-x-1">
                    <div class="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                    <div class="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                </div>
            </div>
        `;
    }

    function displayAnalysisResults(data) {
        if (!data || !data.results || data.results.length === 0) {
            displayNoResultsState();
            return;
        }

        // Filter results if minimum occurrences filter is enabled
        const filteredResults = filterMinOccurrences 
            ? data.results.filter(item => item.count >= 5)
            : data.results;

        // Store results for CSV export
        analysisResults = {
            data: filteredResults,
            totalLines: data.totalLines,
            totalMatches: data.totalMatches,
            uniqueWorkflows: data.uniqueWorkflows,
            uniqueWorksteps: data.uniqueWorksteps,
            fileName: fileName || 'pasted-content',
            timestamp: new Date().toISOString(),
            filterApplied: filterMinOccurrences
        };

        // Create the results HTML with animation
        const resultsHTML = `
            <div class="bg-white rounded-xl opacity-0 transform translate-y-4 transition-all duration-700 ease-out" id="resultsTable">
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-gray-800">Workflow Analysis Results</h3>
                        <div class="flex items-center space-x-4">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="filterToggle" class="sr-only peer" ${filterMinOccurrences ? 'checked' : ''}>
                                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                <span class="ml-3 text-sm font-medium text-gray-700">Hide items with &lt; 5 occurrences</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p class="text-gray-700 font-medium">
                            Found <span class="text-blue-700 font-bold">${data.totalMatches}</span> workflow/workstep matches across 
                            <span class="text-blue-700 font-bold">${data.results.length}</span> unique combinations in 
                            <span class="text-blue-700 font-bold">${data.totalLines}</span> log lines.
                            ${filteredResults.length !== data.results.length ? `<br><span class="text-sm text-gray-600">Showing ${filteredResults.length} of ${data.results.length} results.</span>` : ''}
                        </p>
                    </div>
                </div>
                
                <div class="overflow-x-auto rounded-lg border border-gray-200">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Workflow
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Workstep
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Count 
                                    <span class="text-teal-600">▲</span>
                                </th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Percentage
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            ${filteredResults.map((item, index) => {
                                const isTopThree = index >= filteredResults.length - 3;
                                const rowClasses = isTopThree 
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400' 
                                    : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';
                                
                                return `
                                <tr class="hover:bg-blue-50 transition-all duration-200 ${rowClasses}">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-semibold text-gray-900">${escapeHtml(item.workflow)}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-700">${escapeHtml(item.workstep)}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                            isTopThree 
                                                ? 'bg-green-200 text-green-800 border border-green-300' 
                                                : 'bg-teal-100 text-teal-800 border border-teal-200'
                                        }">
                                            ${item.count}
                                            ${isTopThree ? ' 🏆' : ''}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="text-sm font-medium text-gray-700 mr-2">
                                                ${((item.count / data.totalMatches) * 100).toFixed(1)}%
                                            </div>
                                            <div class="w-20 bg-gray-200 rounded-full h-2">
                                                <div class="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-500" 
                                                     style="width: ${((item.count / data.totalMatches) * 100).toFixed(1)}%"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>

                ${filteredResults.length === 0 ? `
                    <div class="text-center py-12">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-600 mb-2">No results match the current filter</h3>
                        <p class="text-gray-500">Try unchecking the filter option to see all results.</p>
                    </div>
                ` : ''}
            </div>
        `;

        resultsContainer.innerHTML = resultsHTML;

        // Trigger animation with delay for better visual effect
        setTimeout(() => {
            const tableElement = document.getElementById('resultsTable');
            if (tableElement) {
                tableElement.classList.remove('opacity-0', 'translate-y-4');
                tableElement.classList.add('opacity-100', 'translate-y-0');
                
                // Animate progress bars after table appears
                setTimeout(() => {
                    const progressBars = tableElement.querySelectorAll('.bg-gradient-to-r.from-teal-400');
                    progressBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.transform = 'scaleX(1)';
                            bar.style.transformOrigin = 'left';
                        }, index * 50);
                    });
                }, 300);
            }
        }, 150);

        // Add event listener for filter toggle
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('change', function() {
                filterMinOccurrences = this.checked;
                displayAnalysisResults(data); // Re-render with new filter
            });
        }

        // Enable download button
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    function displayNoResultsState() {
        resultsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div class="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-600 mb-3">No workflow/workstep entries detected</h3>
                <p class="text-gray-500 mb-6 leading-relaxed">The log content doesn't contain recognizable workflow/workstep patterns.</p>
                <div class="text-left text-sm text-gray-600 bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 rounded-xl max-w-md shadow-sm">
                    <h4 class="font-semibold mb-3 text-gray-800">Supported formats:</h4>
                    <ul class="space-y-2">
                        <li class="flex items-center">
                            <span class="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                            Started workflow 'X' workstep 'Y'
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                            Processing workflow: X | Step: Y
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                            Workflow [X] - Step [Y]
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                            WF: X, WS: Y
                        </li>
                        <li class="flex items-center">
                            <span class="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                            workflow.workstep format
                        </li>
                    </ul>
                </div>
            </div>
        `;

        // Hide summary cards
        summaryCards.classList.add('hidden');

        // Disable download button
        downloadBtn.disabled = true;
        downloadBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    function displayErrorState() {
        resultsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div class="w-24 h-24 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-red-600 mb-3">Analysis Error</h3>
                <p class="text-gray-500 leading-relaxed">An error occurred while processing the log data. Please check the format and try again.</p>
            </div>
        `;
    }

    function updateSummaryCards(data) {
        if (!data || !data.results) {
            summaryCards.classList.add('hidden');
            return;
        }

        document.getElementById('totalLines').textContent = data.totalMatches;
        document.getElementById('successCount').textContent = data.uniqueWorkflows;
        document.getElementById('errorCount').textContent = data.uniqueWorksteps;

        // Update card labels to match our analysis
        const cards = summaryCards.querySelectorAll('p');
        if (cards.length >= 3) {
            cards[0].textContent = 'Total Matches';
            cards[1].textContent = 'Unique Workflows';
            cards[2].textContent = 'Unique Worksteps';
        }

        // Update card colors
        const cardDivs = summaryCards.querySelectorAll('div');
        if (cardDivs.length >= 3) {
            cardDivs[0].className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 text-center';
            cardDivs[1].className = 'bg-green-50 border border-green-200 rounded-lg p-4 text-center';
            cardDivs[2].className = 'bg-purple-50 border border-purple-200 rounded-lg p-4 text-center';
        }

        summaryCards.classList.remove('hidden');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function resetApplication() {
        // Clear all inputs and results
        logInput.value = '';
        fileInput.value = '';
        fileName = null;
        analysisResults = null;
        parsedWorkflowData = null;
        filterMinOccurrences = false;

        // Remove privacy indicator if present
        const existingIndicator = logInput.parentNode.querySelector('.privacy-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Reset results container
        resultsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center">
                <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-600 mb-2">Awaiting analysis results…</h3>
                <p class="text-gray-500">Upload a log file or paste log content and click "Analyze Log" to see the results.</p>
            </div>
        `;

        // Hide summary cards
        summaryCards.classList.add('hidden');

        // Reset summary card labels and colors
        const cards = summaryCards.querySelectorAll('p');
        if (cards.length >= 3) {
            cards[0].textContent = 'Total Lines';
            cards[1].textContent = 'Success Events';
            cards[2].textContent = 'Error Events';
        }

        // Reset upload button
        uploadBtn.innerHTML = `
            <svg class="w-6 h-6 mr-3 group-hover:animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span class="font-medium">Choose File or Drag & Drop</span>
        `;
        uploadBtn.classList.remove('text-green-600', 'border-green-400', 'bg-green-50');

        // Disable download button
        downloadBtn.disabled = true;
        downloadBtn.classList.add('opacity-50', 'cursor-not-allowed');

        showNotification('Application reset successfully!', 'success');
    }

    function downloadCSV() {
        if (!analysisResults || !analysisResults.data) {
            showNotification('No analysis results to download.', 'warning');
            return;
        }

        // Create CSV content with proper headers
        const csvRows = [
            ['Workflow', 'Workstep', 'Count', 'Percentage']
        ];

        // Add data rows
        analysisResults.data.forEach(item => {
            const percentage = ((item.count / (analysisResults.totalMatches || 1)) * 100).toFixed(1);
            csvRows.push([
                `"${item.workflow.replace(/"/g, '""')}"`, // Escape quotes in CSV
                `"${item.workstep.replace(/"/g, '""')}"`,
                item.count.toString(),
                `${percentage}%`
            ]);
        });

        // Add summary information
        csvRows.push([]);
        csvRows.push(['Analysis Summary']);
        csvRows.push(['Total Lines Processed', analysisResults.totalLines.toString()]);
        csvRows.push(['Total Matches Found', (analysisResults.totalMatches || 0).toString()]);
        csvRows.push(['Unique Workflows', (analysisResults.uniqueWorkflows || 0).toString()]);
        csvRows.push(['Unique Worksteps', (analysisResults.uniqueWorksteps || 0).toString()]);
        csvRows.push(['Filter Applied (< 5 occurrences)', analysisResults.filterApplied ? 'Yes' : 'No']);
        csvRows.push(['File Name', `"${(analysisResults.fileName || 'pasted-content').replace(/"/g, '""')}"`]);
        csvRows.push(['Analysis Date', new Date(analysisResults.timestamp).toLocaleString()]);

        // Convert to CSV string
        const csvContent = csvRows.map(row => row.join(',')).join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'workflow_analysis.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('CSV file "workflow_analysis.csv" downloaded successfully!', 'success');
    }

    function updateUIState() {
        // Enable/disable analyze button based on content
        const hasContent = logInput.value.trim().length > 0;
        analyzeBtn.disabled = !hasContent;
        
        if (!hasContent) {
            analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
        
        // Set color scheme based on type
        const colorClasses = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        notification.classList.add(...colorClasses[type].split(' '));
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="flex-1">${message}</span>
                <button class="ml-2 hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Initialize UI state
    updateUIState();
    
    // Add page load animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Export functions for potential future use
window.WorkflowAnalyzer = {
    // Core parsing function
    parseLog: function(logContent) {
        return parseWorkflowLog(logContent);
    },
    
    // Analysis function for workflow steps
    analyzeWorkflowSteps: function(parsedData) {
        if (!parsedData || !parsedData.results) {
            return null;
        }
        
        // Group by workflow
        const workflowGroups = {};
        parsedData.results.forEach(item => {
            if (!workflowGroups[item.workflow]) {
                workflowGroups[item.workflow] = [];
            }
            workflowGroups[item.workflow].push(item);
        });
        
        return {
            workflowGroups,
            totalWorkflows: Object.keys(workflowGroups).length,
            summary: parsedData
        };
    },
    
    // Utility function to normalize text
    normalizeText: function(text) {
        return normalizeText(text);
    },
    
    // Get current analysis results
    getCurrentResults: function() {
        return analysisResults;
    },
    
    // Set filter state
    setFilter: function(enabled) {
        filterMinOccurrences = enabled;
        if (parsedWorkflowData) {
            displayAnalysisResults(parsedWorkflowData);
        }
    }
};

// Privacy Protection: Scramble sensitive data in the input area
function scrambleSensitiveData() {
    const logContent = logInput.value;
    if (!logContent) return;

    // Create scrambling patterns for different types of sensitive data
    let scrambledContent = logContent;

    // 1. Scramble workflow names (after "Processing Workflow" or "workflow")
    scrambledContent = scrambledContent.replace(
        /(\bProcessing\s+Workflow\s+)(\w+)/gi,
        '$1[WORKFLOW-' + Math.random().toString(36).substr(2, 6).toUpperCase() + ']'
    );

    // 2. Scramble workstep names (after "Workstep")
    scrambledContent = scrambledContent.replace(
        /(\bWorkstep\s+)(\w+)/gi,
        '$1[STEP-' + Math.random().toString(36).substr(2, 6).toUpperCase() + ']'
    );

    // 3. Scramble WorkAction values
    scrambledContent = scrambledContent.replace(
        /(\bWorkAction\s+)(\w+)/gi,
        '$1[ACTION-' + Math.random().toString(36).substr(2, 4).toUpperCase() + ']'
    );

    // 4. Scramble case IDs (numbers after "case id")
    scrambledContent = scrambledContent.replace(
        /(\bcase\s+id\s*[-–]\s*)(\d+)/gi,
        '$1[CASE-' + Math.random().toString(36).substr(2, 8).toUpperCase() + ']'
    );

    // 5. Scramble old/new workflow codes in "Processed workflow task" lines
    scrambledContent = scrambledContent.replace(
        /(\bold\s+workflow\s+code\s+is\s+)(\w+)(\s+new\s+workflow\s+code\s+is\s+)(\w+)/gi,
        '$1[WF-' + Math.random().toString(36).substr(2, 4).toUpperCase() + ']$3[WF-' + Math.random().toString(36).substr(2, 4).toUpperCase() + ']'
    );

    // 6. Scramble old/new workstep codes in "Processed workstep task" lines
    scrambledContent = scrambledContent.replace(
        /(\bold\s+workstep\s+code\s+is\s+)(\w+)(\s+new\s+workstep\s+code\s+is\s+)(\w+)/gi,
        '$1[STEP-' + Math.random().toString(36).substr(2, 4).toUpperCase() + ']$3[STEP-' + Math.random().toString(36).substr(2, 4).toUpperCase() + ']'
    );

    // 7. General workflow/workstep pattern scrambling (quoted formats)
    scrambledContent = scrambledContent.replace(
        /(['"])[A-Z][A-Z0-9_]+\1/g,
        () => '"[DATA-' + Math.random().toString(36).substr(2, 6).toUpperCase() + ']"'
    );

    // Update the textarea with scrambled content
    logInput.value = scrambledContent;

    // Add a visual indicator that data has been scrambled
    const indicator = document.createElement('div');
    indicator.innerHTML = `
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span class="text-sm font-medium text-yellow-800">
                    🔒 Privacy Protected: Sensitive data has been scrambled for security
                </span>
            </div>
        </div>
    `;

    // Insert the indicator after the textarea
    const existingIndicator = logInput.parentNode.querySelector('.privacy-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    indicator.classList.add('privacy-indicator');
    logInput.parentNode.appendChild(indicator);
}