# Chronometer
Online chronometer with configurable settings (loop, sound, ...)

# Purpose
Create a simple configurable chronometer which can be started with keyboard.
It should be usable for many games which needs special timer.

# Test online
Visit https://restimel.github.io/Chronometer/dist/index.html

# Features
* Timer up and down
* Keyboard control, and possibility to rebind keys
    * start timer on keyUp
    * end timer on keyDown
* Display is configurable (_work in progress (50%)_)
* Configures timer to do several actions (_Work in progress (90%)_)
    * Change timer color
    * Play sounds
    * Restart timer (this allows to do infinite loop)
    * Add time (for a Fisher system equivalent)
* Save preset timers (_Work in progress (80%)_)
* Record time (_Work in progress (5%)_)

## Project development
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
#### Classic way
```
npm run build
```

#### For Github
```
npm run gh-pages
```

### Lints and fixes files
```
npm run lint
```
