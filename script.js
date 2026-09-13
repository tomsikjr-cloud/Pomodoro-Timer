/**
 * Pomodoro Timer Application
 * Manages timer states, countdown logic, and user interactions
 */

class PomodoroTimer {
    constructor() {
        // Configuration
        this.workDuration = 25 * 60; // 25 minutes in seconds
        this.breakDuration = 5 * 60; // 5 minutes in seconds
        this.totalDuration = this.workDuration; // Track total for progress

        // State
        this.timeLeft = this.workDuration;
        this.isRunning = false;
        this.isWorkSession = true; // true for work, false for break
        this.sessionsCompleted = 0;
        this.intervalId = null;
        this.chimeSound = 'gong'; // Default to warm gong

        // DOM Elements
        this.elements = {
            timerDisplay: document.getElementById('timerDisplay'),
            sessionLabel: document.getElementById('sessionLabel'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            progressFill: document.getElementById('progressFill'),
            sessionsCompleted: document.getElementById('sessionsCompleted'),
            todoItems: Array.from(document.querySelectorAll('.todo-item')),
            todoInputs: Array.from(document.querySelectorAll('.todo-input')),
            todoCheckboxes: Array.from(document.querySelectorAll('.todo-checkbox')),
            todoDeleteButtons: Array.from(document.querySelectorAll('.todo-delete-btn')),
            workDurationInput: document.getElementById('workDuration'),
            breakDurationInput: document.getElementById('breakDuration'),
            updateSettingsBtn: document.getElementById('updateSettingsBtn'),
            chimeSoundSelect: document.getElementById('chimeSound'),
            themeToggle: null,
            themeLabel: null,
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize the timer and attach event listeners
     */
    init() {
        this.loadFromLocalStorage();
        this.loadTheme();
        this.updateDisplay();
        this.attachEventListeners();
    }

    /**
     * Attach click handlers to buttons
     */
    attachEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.start());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        this.elements.updateSettingsBtn.addEventListener('click', () => this.updateSettings());

        this.attachTodoEventListeners();
        
        // Chime sound selector with preview
        if (this.elements.chimeSoundSelect) {
            this.elements.chimeSoundSelect.addEventListener('change', (e) => {
                this.chimeSound = e.target.value;
                this.playChime(); // Play preview
            });
        }
        
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('change', () => this.toggleTheme());
        }
    }

    /**
     * Attach event listeners for the session to do list
     */
    attachTodoEventListeners() {
        this.elements.todoInputs.forEach((input) => {
            input.addEventListener('input', () => this.saveToLocalStorage());
        });

        this.elements.todoCheckboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                this.updateTodoItemVisual(index);
                this.saveToLocalStorage();
            });
        });

        this.elements.todoDeleteButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.deleteTodoItem(index));
        });
    }

    /**
     * Update the visual state of a single todo item
     */
    updateTodoItemVisual(index) {
        const item = this.elements.todoItems[index];
        const input = this.elements.todoInputs[index];
        const checkbox = this.elements.todoCheckboxes[index];

        if (!item || !input || !checkbox) {
            return;
        }

        item.classList.toggle('completed', checkbox.checked);
        input.classList.toggle('completed', checkbox.checked);
    }

    /**
     * Delete a todo item and shift remaining items up
     */
    deleteTodoItem(index) {
        const lastIndex = this.elements.todoInputs.length - 1;

        for (let currentIndex = index; currentIndex < lastIndex; currentIndex++) {
            this.elements.todoInputs[currentIndex].value = this.elements.todoInputs[currentIndex + 1].value;
            this.elements.todoCheckboxes[currentIndex].checked = this.elements.todoCheckboxes[currentIndex + 1].checked;
            this.updateTodoItemVisual(currentIndex);
        }

        this.elements.todoInputs[lastIndex].value = '';
        this.elements.todoCheckboxes[lastIndex].checked = false;
        this.updateTodoItemVisual(lastIndex);

        const focusIndex = Math.min(index, lastIndex);
        this.elements.todoInputs[focusIndex].focus();
        this.elements.todoInputs[focusIndex].setSelectionRange(
            this.elements.todoInputs[focusIndex].value.length,
            this.elements.todoInputs[focusIndex].value.length
        );

        this.saveToLocalStorage();
    }

    /**
     * Get the current todo list state from the UI
     */
    getTodoListState() {
        return this.elements.todoInputs.map((input, index) => ({
            text: input.value,
            completed: this.elements.todoCheckboxes[index]?.checked || false,
        }));
    }

    /**
     * Load the todo list state into the UI
     */
    loadTodoListState(todoList = []) {
        this.elements.todoInputs.forEach((input, index) => {
            const todo = todoList[index] || { text: '', completed: false };
            const checkbox = this.elements.todoCheckboxes[index];

            input.value = todo.text || '';
            if (checkbox) {
                checkbox.checked = !!todo.completed;
            }
            this.updateTodoItemVisual(index);
        });
    }

    /**
     * Start the timer
     */
    start() {
        if (this.isRunning) return; // Prevent multiple intervals

        this.isRunning = true;
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;

        // Run timer every 1000ms (1 second)
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    /**
     * Pause the timer
     */
    pause() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.saveToLocalStorage();
    }

    /**
     * Reset the timer to initial state
     */
    reset() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this.isWorkSession = true;
        this.timeLeft = this.workDuration;
        this.totalDuration = this.workDuration;
        this.updateDisplay();
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.saveToLocalStorage();
    }

    /**
     * Decrement timer by 1 second and check for completion
     */
    tick() {
        this.timeLeft--;
        this.updateDisplay();
        this.saveToLocalStorage();

        if (this.timeLeft <= 0) {
            this.timerComplete();
        }
    }

    /**
     * Handle timer completion
     */
    timerComplete() {
        this.isRunning = false;
        clearInterval(this.intervalId);

        // Play sound and visual feedback
        this.playNotification();
        this.triggerPulseAnimation();

        // Switch session mode
        if (this.isWorkSession) {
            this.sessionsCompleted++;
            this.elements.sessionsCompleted.textContent = this.sessionsCompleted;
            this.isWorkSession = false;
            this.timeLeft = this.breakDuration;
            this.totalDuration = this.breakDuration;
        } else {
            this.isWorkSession = true;
            this.timeLeft = this.workDuration;
            this.totalDuration = this.workDuration;
        }

        this.updateDisplay();
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.saveToLocalStorage();

        // Auto-start next session (can disable this if preferred)
        // this.start();
    }

    /**
     * Play the selected chime sound
     */
    playChime() {
        if (this.chimeSound === 'none') {
            return; // No sound selected
        } else if (this.chimeSound === 'gong') {
            this.playGongChime();
        } else if (this.chimeSound === 'tada') {
            this.playTadaChime();
        }
    }

    /**
     * Play warm gong notification using Web Audio API
     */
    playGongChime() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;

            // Create a pleasant ding with harmonics
            const playTone = (freq, startTime, duration, gainAmount) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.frequency.value = freq;
                osc.type = 'sine';
                
                // Smooth attack and decay
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(gainAmount, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            // Warm Gong - Deep, resonant tone
            playTone(392, now, 1.3, 0.4); // G4: deep, warm base
            
            // Mid-range harmony for richness
            playTone(294, now + 0.05, 1.1, 0.2); // D4: middle tone
            
            // Lower harmony for depth and resonance
            playTone(196, now + 0.1, 1.2, 0.15); // G3: adds warmth and body
        } catch (e) {
            console.log('Audio notification not available:', e);
            this.showBrowserNotification();
        }
    }

    /**
     * Play celebratory "Ta Da" chime sound
     */
    playTadaChime() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;

            const playTone = (freq, startTime, duration, gainAmount) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.frequency.value = freq;
                osc.type = 'sine';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(gainAmount, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            // "Ta Da" - celebratory two-note fanfare
            // First note: high, bright
            playTone(523.25, now, 0.3, 0.5); // C5: bright high note
            
            // Second note: even higher
            playTone(659.25, now + 0.25, 0.4, 0.6); // E5: even brighter
            
            // Third note: resolution back down with harmony
            playTone(523.25, now + 0.5, 0.5, 0.5); // C5: resolution
            playTone(659.25, now + 0.5, 0.5, 0.3); // E5: harmony
        } catch (e) {
            console.log('Audio notification not available:', e);
            this.showBrowserNotification();
        }
    }

    /**
     * Show browser notification as fallback
     */
    showBrowserNotification() {
        if (window.Notification && Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: this.isWorkSession ? 'Break time is over! Ready to work?' : 'Work session complete! Time for a break.',
                icon: '⏱️',
            });
        }
    }

    /**
     * Play notification sound on timer completion
     */
    playNotification() {
        this.playChime();
    }

    /**
     * Trigger pulse animation on timer display
     */
    triggerPulseAnimation() {
        this.elements.timerDisplay.classList.remove('pulse');
        // Trigger reflow to restart animation
        void this.elements.timerDisplay.offsetWidth;
        this.elements.timerDisplay.classList.add('pulse');
    }

    /**
     * Update the timer display and progress bar
     */
    updateDisplay() {
        // Format time as MM:SS
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        this.elements.timerDisplay.textContent = timeString;

        // Update session label and mode - PRESERVE THEME CLASS
        const hasIndustrialTheme = document.body.classList.contains('industrial-theme');
        
        if (this.isWorkSession) {
            this.elements.sessionLabel.textContent = '💼 Work Session';
            this.elements.sessionLabel.className = 'session-label work';
            document.body.className = hasIndustrialTheme ? 'industrial-theme work-mode' : 'work-mode';
        } else {
            this.elements.sessionLabel.textContent = '☕ Break Time';
            this.elements.sessionLabel.className = 'session-label break';
            document.body.className = hasIndustrialTheme ? 'industrial-theme break-mode' : 'break-mode';
        }

        // Update progress bar
        const progressPercent = (this.timeLeft / this.totalDuration) * 100;
        this.elements.progressFill.style.width = `${progressPercent}%`;

        // Update browser tab title
        document.title = `${timeString} - Pomodoro Timer`;
    }

    /**
     * Update settings when user changes work/break durations
     */
    updateSettings() {
        const newWorkDuration = parseInt(this.elements.workDurationInput.value) * 60;
        const newBreakDuration = parseInt(this.elements.breakDurationInput.value) * 60;

        if (newWorkDuration > 0 && newBreakDuration > 0) {
            this.workDuration = newWorkDuration;
            this.breakDuration = newBreakDuration;

            // Reset to new work duration if not running
            if (!this.isRunning) {
                this.reset();
            }

            this.saveToLocalStorage();
            alert('Settings updated! Timer has been reset.');
        } else {
            alert('Please enter valid durations.');
        }
    }

    /**
     * Save state to localStorage for persistence
     */
    saveToLocalStorage() {
        const state = {
            timeLeft: this.timeLeft,
            isRunning: this.isRunning,
            isWorkSession: this.isWorkSession,
            sessionsCompleted: this.sessionsCompleted,
            workDuration: this.workDuration,
            breakDuration: this.breakDuration,
            chimeSound: this.chimeSound,
            todoList: this.getTodoListState(),
            savedAt: Date.now(),
        };
        localStorage.setItem('pomodoroState', JSON.stringify(state));
    }

    /**
     * Load theme from localStorage and apply it
     */
    loadTheme() {
        // Get theme toggle elements
        this.elements.themeToggle = document.getElementById('themeToggle');
        this.elements.themeLabel = document.querySelector('.theme-label');
        
        const savedTheme = localStorage.getItem('pomodoroTheme') || 'basic';
        if (savedTheme === 'industrial') {
            if (this.elements.themeToggle) this.elements.themeToggle.checked = true;
            document.body.className = 'industrial-theme';
            if (this.elements.themeLabel) this.elements.themeLabel.textContent = 'Industrial';
        } else {
            if (this.elements.themeToggle) this.elements.themeToggle.checked = false;
            document.body.className = '';
            if (this.elements.themeLabel) this.elements.themeLabel.textContent = 'Normal';
        }
    }

    /**
     * Toggle between basic and industrial theme
     */
    toggleTheme() {
        const isIndustrial = this.elements.themeToggle.checked;
        const newTheme = isIndustrial ? 'industrial' : 'basic';
        
        document.body.className = isIndustrial ? 'industrial-theme' : '';
        localStorage.setItem('pomodoroTheme', newTheme);
        
        // Update label
        if (this.elements.themeLabel) {
            this.elements.themeLabel.textContent = isIndustrial ? 'Industrial' : 'Normal';
        }
    }

    /**
     * Load state from localStorage
     */
    loadFromLocalStorage() {
        const saved = localStorage.getItem('pomodoroState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                const elapsedSeconds = Math.floor((Date.now() - state.savedAt) / 1000);

                // Only restore if less than 1 hour has passed
                if (elapsedSeconds < 3600) {
                    this.workDuration = state.workDuration || this.workDuration;
                    this.breakDuration = state.breakDuration || this.breakDuration;
                    this.chimeSound = state.chimeSound || this.chimeSound;
                    this.isWorkSession = state.isWorkSession;
                    this.sessionsCompleted = state.sessionsCompleted;
                    this.totalDuration = this.isWorkSession ? this.workDuration : this.breakDuration;
                    this.loadTodoListState(state.todoList || []);

                    // Adjust time based on elapsed time
                    if (state.isRunning) {
                        this.timeLeft = Math.max(0, state.timeLeft - elapsedSeconds);
                    } else {
                        this.timeLeft = state.timeLeft;
                    }

                    // Update UI
                    this.elements.workDurationInput.value = this.workDuration / 60;
                    this.elements.breakDurationInput.value = this.breakDuration / 60;
                    if (this.elements.chimeSoundSelect) {
                        this.elements.chimeSoundSelect.value = this.chimeSound;
                    }
                    this.elements.sessionsCompleted.textContent = this.sessionsCompleted;
                } else {
                    this.loadTodoListState();
                }
            } catch (e) {
                console.log('Error loading from localStorage:', e);
            }
        } else {
            this.loadTodoListState();
        }
    }
}

/**
 * Initialize the timer when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroTimer = new PomodoroTimer();
});
