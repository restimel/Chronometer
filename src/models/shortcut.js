/**
 * Shortcuts
 */

const storage = localStorage.chronoShortcut;
const shortcuts = Object.assign({
    MAIN: 'Space',
    RESET: 'Escape',
    RECORD: 'Enter',
    Special1: 'F1',
    Special2: 'F2',
    Special3: 'F3',
}, storage && JSON.parse(storage) || {});

export function set(key, value) {
    if (shortcuts[key] && value) {
        shortcuts[key] = value;
        localStorage.chronoShortcut = JSON.stringify(shortcuts);
    }
}

export default shortcuts;
