/**
 * Shortcuts
 */

const storage = localStorage.chronoShortcut;
const shortcuts = Object.assign({
    START: 'Space',
    STOP: 'Space',
    RESET: 'Escape',
    STOP_RESET: 'Escape',
    RECORD: 'Enter',
    Special1: 'F1',
    Special2: 'F2',
    Special3: 'F3',
    Special4: 'F4',
    Special5: 'F5',
}, storage && JSON.parse(storage) || {});

/* list of binding to use when chronometer is running */
export const running = [
    'STOP',
    'RECORD',
    'STOP_RESET',
];

/* list of binding to use when chronometer is sleeping */
export const sleeping = [
    'START',
    'RESET',
];

/* list of binding to use when chronometer is sleeping */
export const always = [
    'Special1',
    'Special2',
    'Special3',
    'Special4',
    'Special5',
];


export function set(key, value) {
    if (shortcuts[key] && value) {
        shortcuts[key] = value;
        localStorage.chronoShortcut = JSON.stringify(shortcuts);
    }
}

export default shortcuts;
