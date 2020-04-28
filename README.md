# Chronometer
Online chronometer with configurable settings (loop, sound, ...)

## Purpose
Create a simple configurable chronometer which can be started with keyboard.
It should be usable for many games which needs special timer.

## Test online
Visit https://restimel.github.io/Chronometer/dist/index.html

## Features

* Timer up and down
* Keyboard control, and possibility to rebind keys
    * start timer on keyUp
    * end timer on keyDown
* Display is configurable
* Configures timer to do several actions
    * Change timer color
    * Play sounds
        * Propose a small set of sounds
        * Play sounds from an url
    * Restart timer (this allows to do infinite loop)
    * Add time (for a Fisher system equivalent)
* Save preset timers
* Record time

### Roadmap features

* Upload sounds from computer
* Save configuration as a JSON
* Load configuration from a JSON
* Load JSON configuration from an URL
* Provide online configuration

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

You can change your base url (mainly to load local sounds) in the `.env.production` file.

#### For Github
```
npm run gh-pages
```

### Lints and fixes files
```
npm run lint
```
