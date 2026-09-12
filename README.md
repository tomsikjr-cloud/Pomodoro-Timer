# 🍅 Pomodoro Timer

A simple, beautiful web-based Pomodoro Timer to boost productivity and manage your work sessions with the Pomodoro Technique.

## Features

✅ **25-Minute Work Sessions & 5-Minute Breaks** - Classic Pomodoro timing  
✅ **Start/Pause/Reset Controls** - Full control over your timer  
✅ **Visual Feedback** - Color transitions and progress bar (red for work, green for break)  
✅ **Customizable Chime Sounds** - Choose between No Sound, Warm Gong, or Ta Da notification  
✅ **Theme Toggle** - Switch between Normal (purple) and Industrial (dark cyberpunk) themes  
✅ **Session Counter** - Track how many Pomodoros you've completed  
✅ **Progress Bar** - Visual indicator of time remaining  
✅ **Custom Durations** - Adjust work and break times in settings  
✅ **Persistent State** - Timer state saved to browser (survives page reload)  
✅ **Fully Responsive** - Works on desktop, tablet, and mobile  
✅ **Cross-Platform** - Runs on Windows, Mac, and Linux  
✅ **No Installation Required** - Just open in a browser!  

## How to Use

### Quick Start

1. **Download or clone this project**
2. **Open `index.html` in your web browser** (double-click the file, or right-click → Open with Browser)
3. **Click "Start"** to begin a 25-minute work session
4. **Work until the timer beeps** and automatically switches to a 5-minute break
5. **Repeat!** Your session count increases with each completed work period

### Controls

- **Start Button** - Begin the timer countdown
- **Pause Button** - Pause without losing progress (enabled when timer is running)
- **Reset Button** - Return to the initial state (25:00 for work session)
- **Theme Toggle** - Switch between Normal (clean purple) and Industrial (dark cyberpunk) themes in the header

### Settings

Click the **Settings** dropdown to:
- Change work session duration (default: 25 minutes)
- Change break duration (default: 5 minutes)
- **Select Chime Sound** - Choose your notification sound:
  - **No Sound** - Silent operation (timer still shows visual feedback)
  - **Warm Gong** (default) - Deep, resonant three-part harmonic tone
  - **Ta Da** - Celebratory two-note fanfare
  - *Hear a preview immediately when you change the selection!*
- Click **Apply Settings** to save changes

Your settings and timer progress are automatically saved to your browser's local storage.

## Technical Details

### Project Structure

```
Pomodoro Timer/
├── index.html        # Main timer application
├── styles.css        # Styling for both Normal and Industrial themes
├── script.js         # Timer logic and event handlers
├── test-ding.html    # Sound testing utility (separate from main app)
└── README.md         # This file
```

### Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Responsive design with animations
- **Vanilla JavaScript** - Timer logic, no frameworks required
- **Web Audio API** - Cross-platform audio notifications
- **LocalStorage API** - Persist state between sessions

### Browser Compatibility

✅ Chrome/Chromium (Windows, Mac, Linux)  
✅ Firefox (Windows, Mac, Linux)  
✅ Safari (Mac, iOS)  
✅ Edge (Windows, Mac)  
✅ Any modern browser with HTML5 support

## How the Pomodoro Technique Works

The Pomodoro Technique is a time-management method that breaks work into focused 25-minute intervals (called "pomodoros") separated by short breaks:

1. **Choose a task** to work on
2. **Set a timer for 25 minutes** - this is one "Pomodoro"
3. **Work with full focus** until the timer rings
4. **Take a 5-minute break** to recharge
5. **Repeat** - after 4 Pomodoros, take a longer 15-30 minute break

This timer automates steps 2-4, helping you stay productive!

## Features Explained

### Visual Feedback
- **Session Indicator** - Shows whether you're in a work or break session
- **Color Transitions** - Red background during work, green during breaks
- **Progress Bar** - Visual representation of time remaining
- **Pulse Animation** - Timer pulses when session ends for emphasis

### Audio Feedback (Customizable Chimes)
- **No Sound** - Silent mode for when you need to stay unnoticed
- **Warm Gong Notification** - Deep, resonant three-part harmonic tone (G4 + D4 + G3) - creates a warm, bell-like sound
- **Ta Da Celebration** - Uplifting two-note fanfare (C5 → E5 → C5+E5) for a celebratory feel
- **Sound Preview** - Hear your selection immediately when changing the setting in the dropdown
- **Graceful Fallback** - Uses browser notifications if audio unavailable
- **Sound Testing** - Use `test-ding.html` to preview all notification sounds (no 25-minute wait needed!)

### Theme Customization
- **Normal Theme** - Clean, modern purple gradient design for a fresh look
- **Industrial Theme** - Dark Blade Runner cyberpunk aesthetic with muted teals, subtle glows, and semi-transparent containers
- **Theme Persistence** - Your theme choice is saved to localStorage
- **Dynamic Colors** - Work sessions show red, breaks show green (works in both themes)

### Session Persistence
- **LocalStorage** - Timer state automatically saved every second
- **Resume on Reload** - Page refresh resumes your timer at correct time
- **Elapsed Time Calculation** - Accounts for time passed if tab was closed
- **Time-Out Protection** - Only restores state if less than 1 hour has passed

### Responsive Design
- Works on phones, tablets, and desktops
- Auto-adjusts font sizes and button layout on smaller screens
- Touch-friendly button sizes for mobile users

## Version History

### v0.3 - Customizable Chime Sounds ✨ (Current)
- **New Feature**: Customizable chime sounds dropdown in settings
  - No Sound - Silent operation option
  - Warm Gong - Original resonant gong (default)
  - Ta Da - Celebratory two-note fanfare
- **New Feature**: Sound preview plays immediately when selection changes
- **Improved**: Better organized settings panel
- **Improved**: Enhanced documentation

### v0.2 - Theme System
- Implemented Normal and Industrial theme toggle
- Industrial theme with cyberpunk aesthetic
- Theme persistence via localStorage
- Dynamic color coding for work/break sessions

### v0.1 - Core Functionality
- Basic Pomodoro timer (25 min work, 5 min break)
- Start/Pause/Reset controls
- Session counter
- Progress bar with visual feedback
- Warm gong notification sound
- Custom duration settings
- State persistence with localStorage

## Customization Ideas (Future Enhancements)

- 📊 Statistics dashboard (weekly sessions, hours focused)
- 🎯 Task list integration
- ⏱️ Keyboard shortcuts (Space to start/pause, R to reset)
- 🔔 Browser notifications with permission request
- 📱 Progressive Web App (PWA) - installable on home screen
- 🌐 Cloud sync across devices

## Troubleshooting

### Sound isn't playing
- Check browser volume settings
- Ensure website has audio permissions
- Different browsers may have different audio policies

### Timer doesn't persist after closing browser
- Check if LocalStorage is enabled
- Clear browser cache and reload
- Try opening in incognito/private mode

### Timer display looks too small/large
- This is responsive design - resize your browser window
- On mobile, try rotating your device to landscape

## License

Free to use, modify, and share! No attribution required.

## About the Pomodoro Technique

Learn more about the Pomodoro Technique at https://en.wikipedia.org/wiki/Pomodoro_Technique

---

**Happy Pomodoros! 🍅⏱️**
