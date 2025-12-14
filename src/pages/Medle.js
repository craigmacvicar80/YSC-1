// src/pages/Medle.js - OVERWRITE COMPLETELY (Final fix: Emptying Case Title during Clue Display)

import React, { useEffect, useRef } from 'react';
import { Gamepad, Play, RefreshCw, Layers } from 'lucide-react';
import { MEDLE_CASES } from '../data/medleCases.js';


// --------------------------------------------------------------------------------------
// STEP 1: VANILLA JAVASCRIPT LOGIC 
// --------------------------------------------------------------------------------------

const MedleGameScript = () => {
    
    // The script is now wrapped in an IIFE (Immediately Invoked Function Expression)
    return (`
        (function() { // START IIFE WRAPPER

        // --- GLOBAL SETUP ---
        const appId = 'YSC-1-local';
        let userId = 'local-user-' + Math.random().toString(36).substring(2, 9);
        let isAuthReady = true; 

        // --- DATA SOURCE ---
        const ALL_CASES = window.MEDLE_CASES_DATA || [];
        
        if (ALL_CASES.length === 0) {
            console.error("Local case data failed to load. Check medleCases.js file.");
            document.getElementById('message-box').textContent = "ERROR: Local case data missing! Cannot start game.";
            return; // SAFELY EXIT MODULE EXECUTION
        }

        // --- DATA SETUP ---
        function getDailySeed() {
            const date = new Date();
            const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
            return dayOfYear * 1000 + 12345; 
        }

        function fetchDailyCase() {
            const seed = getDailySeed();
            const index = seed % ALL_CASES.length; 
            return ALL_CASES[index];
        }

        const CASE_DATA = fetchDailyCase();
        const DAILY_CASE_ID = CASE_DATA.ID;
        const TODAY_KEY = new Date().toDateString();

        // --- GAME STATE ---
        let currentClueIndex = -1; 
        let solved = false;
        let isGameActive = true;
        let cluesUsed = 0; 
         
        const MAX_CLUES = CASE_DATA["Max_Clues"]; 
        const MIN_KEYWORD_MATCHES = 2; 

        const STORAGE_KEY = \`diagnosis_state_\${appId}\`;

        // --- UI ELEMENTS (Centralized Access Object - to be filled by retrieveUIElements) ---
        let UI = {};


        // --- UTILITIES & RENDERING ---
        function openModal(modalElement) {
            if (modalElement) modalElement.style.display = 'flex';
        }
        
        function closeModal(modalElement) {
            if (modalElement) modalElement.style.display = 'none';
        }

        function renderClues() {
            
            if (!CASE_DATA || !CASE_DATA.Clue_1 || !UI.caseTitleEl) {
                 return; 
            }
            
            UI.maxCluesEl.textContent = MAX_CLUES;
            
            const clueCount = Math.max(0, currentClueIndex + 1);
            
            const showFinalAnswer = solved || (currentClueIndex >= MAX_CLUES - 1 && !isGameActive);

            if (showFinalAnswer) {
                // --- Display Final Answer Card (UNCHANGED) ---
                UI.caseTitleEl.textContent = \`Final Assessment\`;
                
                let outcomeMessage = solved 
                    ? \`🎉 Correct! Diagnosis made in \${cluesUsed} out of \${MAX_CLUES} clues.\`
                    : \`❌ Failed to diagnose. All \${MAX_CLUES} clues used.\`;

                UI.clueListEl.innerHTML = \`
                    <div class="p-4 rounded-lg border-2 \${solved ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'}">
                        <h4 class="text-xl font-extrabold \${solved ? 'text-emerald-800' : 'text-red-800'} mb-1">\${outcomeMessage}</h4>
                        <p class="text-3xl font-bold text-gray-800 mt-2">\${CASE_DATA["Correct Diagnosis"]}</p>
                        <p class="text-sm text-indigo-600 font-semibold mb-3">\${CASE_DATA.Specialty} Case</p>
                        
                        <div class="border-t border-gray-300 pt-3 mt-3">
                            <h5 class="text-sm font-bold text-gray-700 mb-1">Clues Summary: \${CASE_DATA.Summary}</h5>
                            <ul class="list-disc list-inside text-xs text-gray-600 space-y-1">
                                <li>Keywords: \${CASE_DATA.Keywords.join(', ')}</li>
                                <li>\${CASE_DATA.Clue_1}</li>
                                <li>\${CASE_DATA.Clue_2}</li>
                            </ul>
                        </div>

                        <div class="mt-4 p-2 bg-white rounded border border-gray-200">
                            <p class="text-xs text-gray-700 font-bold">🎯 Further Knowledge:</p>
                            <p class="text-xs text-gray-600 italic">Review the pathology and management steps for \${CASE_DATA["Correct Diagnosis"]}.</p>
                        </div>
                    </div>
                \`;

            } else {
                // --- Display Game in Progress ---
                // FIX: Set case title to empty string if clueCount is 0 or greater (remove summary)
                UI.caseTitleEl.textContent = '';
                UI.initialMessageEl.classList.toggle('hidden', clueCount > 0);

                UI.clueListEl.innerHTML = '';
                for (let i = 1; i <= clueCount; i++) {
                    const clueKey = 'Clue_' + i;
                    const clueText = CASE_DATA[clueKey] || \`Clue \${i} (Missing data)\`;
                    
                    const p = document.createElement('p');
                    
                    const isLatestClue = i === clueCount;
                    
                    let clueClasses;
                    if (isLatestClue) {
                        // The newest clue is large, bold, and distinct
                        clueClasses = 'clue-item text-gray-800 text-lg font-bold border-b-2 border-dashed border-blue-200 py-2';
                    } else {
                        // Older clues are small and faded
                        clueClasses = 'clue-item text-gray-500 text-xs';
                    }

                    p.className = clueClasses;
                    p.textContent = clueText;
                    UI.clueListEl.appendChild(p);
                    setTimeout(() => p.classList.add('visible'), 50);
                }
            }


            UI.clueCounterEl.textContent = clueCount;
            UI.nextClueNumberEl.textContent = clueCount + 1;
            

            // --- Handle Button States (unchanged) ---
            if (showFinalAnswer) {
                if (UI.getClueBtn) UI.getClueBtn.disabled = true;
                if (UI.guessSpecialtyBtn) UI.guessSpecialtyBtn.disabled = true;
                if (UI.guessAreaEl) UI.guessAreaEl.classList.add('hidden');
                if (UI.submitGuessBtn) UI.submitGuessBtn.disabled = true;
                if (UI.diagnosisInputEl) UI.diagnosisInputEl.disabled = true;
                
                showMessage(solved ? 'Congratulations!' : 'Game Over.', solved ? false : true);

            } else if (currentClueIndex === MAX_CLUES - 1) {
                if (UI.getClueBtn) UI.getClueBtn.disabled = true;
                if (UI.getClueBtn) UI.getClueBtn.textContent = "No More Clues";
                if (UI.guessSpecialtyBtn) UI.guessSpecialtyBtn.disabled = false; 
            } else if (currentClueIndex >= 0) {
                if (UI.getClueBtn) UI.getClueBtn.disabled = false;
                if (UI.getClueBtn) UI.getClueBtn.textContent = 'Get Clue ' + (clueCount + 1);
                if (UI.guessSpecialtyBtn) UI.guessSpecialtyBtn.disabled = false;
            } else {
                if (UI.getClueBtn) UI.getClueBtn.disabled = false;
                if (UI.guessSpecialtyBtn) UI.guessSpecialtyBtn.disabled = true;
                if (UI.guessAreaEl) UI.guessAreaEl.classList.add('hidden');
            }
        }

        function showMessage(text, isError = false) {
            if (!UI.messageBoxEl) return;
            UI.messageBoxEl.textContent = text;
            UI.messageBoxEl.classList.remove('text-red-600', 'text-green-600');
            UI.messageBoxEl.classList.add(isError ? 'text-red-600' : 'text-green-600');
        }
        
        // --- GAME LOGIC (unchanged) ---

        function loadGame() {
            if (!CASE_DATA || !CASE_DATA.Clue_1) {
                 showMessage("ERROR: Daily case data missing or corrupted.", true);
                 return;
            }
            
            const storedState = localStorage.getItem(STORAGE_KEY);

            if (storedState) {
                const state = JSON.parse(storedState);
                if (state.date === TODAY_KEY && state.word === DAILY_CASE_ID) {
                    currentClueIndex = state.currentClueIndex;
                    solved = state.solved;
                    cluesUsed = state.cluesUsed;
                    isGameActive = !solved && currentClueIndex < MAX_CLUES;
                } else {
                    resetGameData();
                }
            } else {
                resetGameData();
            }
            if (currentClueIndex === -1 && !solved && UI.messageBoxEl) {
                UI.messageBoxEl.textContent = '';
            }
            renderClues();
        }

        function saveGame() {
            if (!isGameActive && !solved) return;

            const gameState = {
                date: TODAY_KEY,
                currentClueIndex: currentClueIndex,
                solved: solved,
                cluesUsed: cluesUsed,
                word: DAILY_CASE_ID 
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        }
        
        function resetGameData() {
            currentClueIndex = -1;
            solved = false;
            cluesUsed = 0;
            isGameActive = true;
            if (UI.messageBoxEl) UI.messageBoxEl.textContent = '';
            if (UI.getClueBtn) UI.getClueBtn.textContent = 'Get Clue 1';
            if (UI.diagnosisInputEl) UI.diagnosisInputEl.value = '';
            localStorage.removeItem(STORAGE_KEY);
        }
        
        // --- LEADERBOARD & SCORING (MOCK CONSOLE LOGS ONLY - unchanged) ---

        async function saveScore() {
            console.log('[LOCAL SCORE LOG] Game finished. Clues used: ' + cluesUsed);
        }

        async function loadLeaderboard() {
            const leaderboardListEl = document.getElementById('leaderboard-list');
            
            const mockScores = [
                { userId: 'Player-1', cluesUsed: 2 },
                { userId: 'Player-2', cluesUsed: 3 },
                { userId: 'Player-3', cluesUsed: 4 },
            ];

            if (!leaderboardListEl) return;
            
            leaderboardListEl.innerHTML = \`
                <h3 class="text-xl font-bold text-gray-700 mb-2">LEADERBOARD DISABLED</h3>
                <p class="text-sm text-red-500">The leaderboard feature is disabled in local mode.</p>
                <div class="font-bold grid grid-cols-3 py-2 border-b">
                    <div>User ID</div>
                    <div class="text-right">Clues Used (Local Mock)</div>
                </div>
            \`;
            
            mockScores.forEach((score, index) => {
                leaderboardListEl.innerHTML += \`
                    <div class="grid grid-cols-3 py-2 border-b text-sm">
                        <div class="truncate text-gray-600">Local User \${index + 1}</div>
                        <div class="text-right font-mono">\${score.cluesUsed}</div>
                    </div>
                \`;
            });
        }
        
        // --- FUZZY MATCHING LOGIC (unchanged) ---
        function checkDiagnosis(input) {
            if (!CASE_DATA || !CASE_DATA.Keywords) return false;
            
            const normalizedInput = input.toLowerCase().replace(/[^a-z0-9\\s]/g, '');
            const inputWords = normalizedInput.split(/\\s+/).filter(w => w.length > 2);
            
            let matchCount = 0;

            CASE_DATA.Keywords.forEach(keyword => {
                if (inputWords.includes(keyword.toLowerCase())) {
                    matchCount++;
                }
            });
            
            return matchCount >= MIN_KEYWORD_MATCHES;
        }

        // --- EVENT HANDLERS (unchanged) ---
        
        function handleGetClue() {
            if (!isGameActive || currentClueIndex >= MAX_CLUES - 1) return;
            
            currentClueIndex++;
            
            if (UI.guessAreaEl) UI.guessAreaEl.classList.add('hidden');
            if (UI.diagnosisInputEl) UI.diagnosisInputEl.value = ''; 
            
            renderClues();
            saveGame();
        }

        function handleGuessSpecialty() {
            if (!isGameActive) return;
            
            if (UI.guessAreaEl) UI.guessAreaEl.classList.remove('hidden');
            if (UI.diagnosisInputEl) UI.diagnosisInputEl.disabled = false;
            
            if (UI.guessSpecialtyBtn) UI.guessSpecialtyBtn.disabled = true;
            if (UI.getClueBtn) UI.getClueBtn.disabled = true; 
            
            const inputValue = UI.diagnosisInputEl ? UI.diagnosisInputEl.value.trim() : '';
            if (UI.submitGuessBtn) UI.submitGuessBtn.disabled = inputValue === '';
            if (UI.diagnosisInputEl) UI.diagnosisInputEl.focus();
        }

        function handleSubmitGuess() {
            const guess = UI.diagnosisInputEl ? UI.diagnosisInputEl.value.trim() : '';

            if (!guess) {
                showMessage("Please enter a diagnosis before submitting.", true);
                return;
            }

            cluesUsed = currentClueIndex + 1;

            if (checkDiagnosis(guess)) {
                solved = true;
                isGameActive = false;
                
                showMessage('CORRECT! Diagnosis made in ' + cluesUsed + ' clues!', false);
                saveScore();
            } else {
                // Set isError = true for red text feedback
                if (currentClueIndex < MAX_CLUES - 1) {
                        showMessage('Incorrect diagnosis. Revealing the next clue.', true);
                        handleGetClue(); 
                } else {
                        isGameActive = false;
                        showMessage('Diagnosis Failed. All clues used.', true);
                        saveScore();
                }
            }
            
            if (UI.diagnosisInputEl) UI.diagnosisInputEl.value = '';
            if (UI.guessAreaEl) UI.guessAreaEl.classList.add('hidden');
            if (UI.getClueBtn) UI.getClueBtn.disabled = solved || !isGameActive; 
            if (UI.guessSpecialtyBtn) UI.guessSpecialtyBtn.disabled = solved || !isGameActive;

            renderClues();
            saveGame();
        }
        
        // --- INITIAL SETUP (LOCAL) ---
        
        // 1. Element Retrieval
        const retrieveUIElements = () => {
             // Retrieve and assign elements to the UI object
            UI.clueListEl = document.getElementById('clue-list');
            UI.caseTitleEl = document.getElementById('case-title');
            UI.clueCounterEl = document.getElementById('clue-counter');
            UI.maxCluesEl = document.getElementById('max-clues');
            UI.messageBoxEl = document.getElementById('message-box');
            UI.getClueBtn = document.getElementById('get-clue');
            UI.guessSpecialtyBtn = document.getElementById('guess-specialty');
            UI.diagnosisInputEl = document.getElementById('diagnosis-input'); 
            UI.submitGuessBtn = document.getElementById('submit-guess');
            UI.guessAreaEl = document.getElementById('guess-area');
            UI.initialMessageEl = document.getElementById('initial-message');
            UI.nextClueNumberEl = document.getElementById('next-clue-number');
            UI.leaderboardModalEl = document.getElementById('leaderboard-modal');
            
            // Button references
            UI.leaderboardBtn = document.getElementById('show-leaderboard');
            UI.resetBtn = document.getElementById('reset-game');
            UI.closeModalBtn = document.getElementById('close-leaderboard');
        }

        // 2. Event Listener Attachment
        const setupEventListeners = () => {
            if (UI.getClueBtn) UI.getClueBtn.addEventListener('click', handleGetClue);
            if (UI.guessSpecialtyBtn) UI.guessSpecialtyBtn.addEventListener('click', handleGuessSpecialty);
            if (UI.submitGuessBtn) UI.submitGuessBtn.addEventListener('click', handleSubmitGuess);
            
            if (UI.leaderboardBtn) UI.leaderboardBtn.addEventListener('click', () => {
                openModal(UI.leaderboardModalEl);
                loadLeaderboard();
            });
            
            if (UI.closeModalBtn) UI.closeModalBtn.addEventListener('click', () => {
                closeModal(UI.leaderboardModalEl);
            });
            
            if (UI.resetBtn) UI.resetBtn.addEventListener('click', () => {
                if (window.confirm("Are you sure you want to start a new game? (Your previous score for today will be kept)")) {
                    resetGameData();
                    loadGame();
                }
            });

            if (UI.diagnosisInputEl && UI.submitGuessBtn) {
                UI.diagnosisInputEl.addEventListener('input', (e) => {
                    UI.submitGuessBtn.disabled = e.target.value.trim() === '';
                });
                
                UI.diagnosisInputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !UI.submitGuessBtn.disabled) {
                        handleSubmitGuess();
                    }
                });
            }
        }
        
        // 3. Main Execution Block
        const main = () => {
            if (!ALL_CASES || ALL_CASES.length === 0) {
                 return; // Safely exit the script execution
            }
            
            // EXECUTION SEQUENCE:
            retrieveUIElements(); // 1. Get all elements
            setupEventListeners(); // 2. Attach all listeners
            loadGame(); // 3. Start game (which calls renderClues)
        }

        // --- FINAL EXECUTION ---
        // CRITICAL FIX: Use DOMContentLoaded for the most reliable trigger after HTML parsing.
        window.addEventListener('DOMContentLoaded', main); 
        
        // Fallback for subsequent navigations within the React app
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
             main();
        }
        
        })(); // END IIFE WRAPPER
    `);
}

// --------------------------------------------------------------------------------------
// STEP 2: REACT COMPONENT (Triggers the initialization function)
// --------------------------------------------------------------------------------------

export default function Medle() {
    
    useEffect(() => {
        // Ensure data is available globally
        window.MEDLE_CASES_DATA = MEDLE_CASES;
        
        // CRITICAL: We need a delay when the component loads *after* the initial page load.
        const timeoutId = setTimeout(() => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                 // Run the logic immediately if the document is already ready (i.e., tab switch)
                 const script = document.createElement('script');
                 script.type = 'module';
                 script.innerHTML = MedleGameScript();
                 
                 const appDiv = document.getElementById('medle-app-container');
                 if (appDiv) {
                     // Clean up previous script instance if switching back and forth
                     const oldScript = appDiv.querySelector('script[type="module"]');
                     if (oldScript) appDiv.removeChild(oldScript);

                     appDiv.appendChild(script);
                 }
            }
        }, 100); 

        return () => clearTimeout(timeoutId);

    }, []);

    // The HTML structure derived from the original file
    const GameHTML = (
        <div id="medle-app-container" className="p-6">
            <style jsx="true">{`
                :root {
                    --primary-color: #004A77; 
                    --success-color: #38A169; 
                    --warning-color: #ED8936; 
                    --bg-light: #f3f4f6;
                }
                .game-container {
                    width: 100%;
                    max-width: 550px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 1.5rem;
                    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 5px 15px -5px rgba(0, 0, 0, 0.04);
                    transition: all 0.3s ease-in-out;
                }
                .case-file {
                    min-height: 150px;
                    border: 2px solid #E5E7EB;
                    border-radius: 0.75rem;
                    padding: 1rem;
                    background-color: #FAFAFA;
                }
                .clue-item {
                    padding: 0.75rem;
                    border-bottom: 1px solid #E5E7EB;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
                }
                .clue-item.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .action-button {
                    padding: 0.75rem 1.5rem;
                    font-weight: 700;
                    border-radius: 0.75rem;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .action-button:hover {
                    box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.15);
                }
                .leaderboard-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.75);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                }
                .leaderboard-content {
                    background-color: white;
                    padding: 30px;
                    border-radius: 1.5rem;
                    width: 95%;
                    max-width: 500px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
                }
                .guess-button {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                .guess-button:disabled {
                    background-color: #9CA3AF;
                    cursor: not-allowed;
                }
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(15, 23, 42, 0.75);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 100;
                    backdrop-filter: blur(2px);
                }
                .modal-content {
                    background-color: white;
                    padding: 30px;
                    border-radius: 1.5rem;
                    width: 95%;
                    max-width: 600px;
                    box-shadow: 0 25px 50px -12p rgba(0, 0, 0, 0.25);
                    border-top: 6px solid var(--primary-color);
                }
            `}</style>
            
            <div className="game-container">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">Daily Diagnosis: Medle</h1>
                <p className="text-center text-sm text-gray-500 mb-6">Type the specific clinical diagnosis with the fewest clues possible.</p>

                {/* Case File Header */}
                <div className="mb-6 p-4 case-file">
                    <h3 className="text-xl font-bold mb-3 text-gray-700 flex items-center justify-between">
                        {/* FIX: Left side is empty unless the game is over */}
                        <span id="case-title" className="truncate"></span>
                        {/* Clues Used Counter */}
                        <span>(<span id="clue-counter">0</span>/<span id="max-clues"></span> Clues Used)</span>
                    </h3>
                    <div id="clue-list">
                        {/* Clues will be dynamically inserted here */}
                    </div>
                    <p id="initial-message" className="text-gray-500 italic text-center">Start the diagnosis by pressing "Get Clue 1" below.</p>
                </div>

                {/* Message Box */}
                <div id="message-box" className="h-8 text-center font-semibold text-lg mb-4"></div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <button id="get-clue" className="action-button bg-blue-600 text-white hover:bg-blue-700 transition duration-150">
                        Get Clue <span id="next-clue-number">1</span>
                    </button>
                    <button id="guess-specialty" className="action-button bg-emerald-600 text-white hover:bg-emerald-700 transition duration-150" disabled>
                        Make Diagnosis
                    </button>
                    <button id="show-leaderboard" className="action-button bg-indigo-600 text-white hover:bg-indigo-700 transition duration-150">
                        Leaderboard
                    </button>
                    <button id="reset-game" className="action-button bg-gray-400 text-white hover:bg-gray-500 transition duration-150">
                        New Day
                    </button>
                </div>

                {/* Diagnosis Input Area */}
                <div id="guess-area" className="mt-4 p-4 border-t border-gray-200 hidden">
                    <label htmlFor="diagnosis-input" className="block text-md font-medium text-gray-700 mb-2">Enter Your Clinical Diagnosis:</label>
                    <div className="flex space-x-2">
                        <input type="text" id="diagnosis-input" placeholder="e.g., Acute Myocardial Infarction" 
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-primary-color focus:border-primary-color" disabled /> 
                        <button id="submit-guess" className="action-button guess-button px-4 py-2" disabled>Submit</button>
                    </div>
                    <p id="diagnosis-hint" className="text-xs text-gray-500 mt-2 italic">Hint: Your diagnosis must contain at least 2 key terms (e.g., 'MI' or 'infarction').</p>
                </div>
            </div>

            {/* Leaderboard Modal */}
            <div id="leaderboard-modal" className="modal hidden">
                <div className="content">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Diagnosis Leaderboard</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">Score is based on average clues used (lower is better).</p>
                    <div id="leaderboard-list" className="space-y-2">
                        <p className="text-center text-gray-500" id="loading-leaderboard">Loading scores...</p>
                    </div>
                    <button id="close-leaderboard" className="mt-6 w-full px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-150">
                        Close
                    </button>
                </div>
            </div>
            {/* The ref allows us to attach the script outside React's lifecycle */}
            <div></div> 
        </div>
    );

    return GameHTML;
}