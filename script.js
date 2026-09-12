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

        // DOM Elements
        this.elements = {
            timerDisplay: document.getElementById('timerDisplay'),
            sessionLabel: document.getElementById('sessionLabel'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            progressFill: document.getElementById('progressFill'),
            sessionsCompleted: document.getElementById('sessionsCompleted'),
            workDurationInput: document.getElementById('workDuration'),
            breakDurationInput: document.getElementById('breakDuration'),
            updateSettingsBtn: document.getElementById('updateSettingsBtn'),
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize the timer and attach event listeners
     */
    init() {
        this.loadFromLocalStorage();
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
     * Play notification sound using Web Audio API
     */
    playNotification() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Connect oscillator to gain node, then to speakers
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Play a pleasant beep: 800Hz frequency, 0.2 second duration
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            // Fade in and out for smooth sound
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);

            // Play a second beep for emphasis
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);

                osc2.frequency.value = 800;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(0, audioContext.currentTime);
                gain2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

                osc2.start(audioContext.currentTime);
                osc2.stop(audioContext.currentTime + 0.2);
            }, 250);
        } catch (e) {
            console.log('Audio notification not available:', e);
            // Fallback: try browser's beep if available
            if (window.Notification && Notification.permission === 'granted') {
                new Notification('Pomodoro Timer', {
                    body: this.isWorkSession ? 'Break time is over! Ready to work?' : 'Work session complete! Time for a break.',
                    icon: '⏱️',
                });
            }
        }
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

        // Update session label and background color
        if (this.isWorkSession) {
            this.elements.sessionLabel.textContent = '💼 Work Session';
            this.elements.sessionLabel.className = 'session-label work';
            document.body.className = 'work-mode';
        } else {
            this.elements.sessionLabel.textContent = '☕ Break Time';
            this.elements.sessionLabel.className = 'session-label break';
            document.body.className = 'break-mode';
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
            savedAt: Date.now(),
        };
        localStorage.setItem('pomodoroState', JSON.stringify(state));
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
                    this.isWorkSession = state.isWorkSession;
                    this.sessionsCompleted = state.sessionsCompleted;
                    this.totalDuration = this.isWorkSession ? this.workDuration : this.breakDuration;

                    // Adjust time based on elapsed time
                    if (state.isRunning) {
                        this.timeLeft = Math.max(0, state.timeLeft - elapsedSeconds);
                    } else {
                        this.timeLeft = state.timeLeft;
                    }

                    // Update UI
                    this.elements.workDurationInput.value = this.workDuration / 60;
                    this.elements.breakDurationInput.value = this.breakDuration / 60;
                    this.elements.sessionsCompleted.textContent = this.sessionsCompleted;
                }
            } catch (e) {
                console.log('Error loading from localStorage:', e);
            }
        }
    }
}

/**
 * Initialize the timer when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroTimer = new PomodoroTimer();
});
