# SvgPlayer Component Architecture

This project implements a modular and maintainable SVG animation player inspired by a solo mode in Arena of Valor. The design separates concerns into reusable hooks and components.

---

## Project Structure Overview

SvgPlayer (Container)
│
├─ useAnimationController (hook) <-- Manages time, activeSkill, and isPlaying state
│
├─ useSkillKeyboardControls (hook) <-- Handles keyboard input to switch active skills
│
├─ SvgDisplay (component) <-- Renders the Hero SVG with animation time and movement state
│
├─ DebugSkillPanel (component) <-- Displays skill buttons, playback controls, and debug info
│
└─ PlaybackControls (component) (optional) <-- Can be extracted from DebugSkillPanel for play/pause and seek UI


---

## Components and Hooks Details

### SvgPlayer (Container)

The main component that orchestrates the animation player, combining all hooks and components.

### useAnimationController

A custom React hook that controls the animation timer, active skill state, and playback status with configurable FPS and animation speed.

### useSkillKeyboardControls

A custom hook to handle keyboard events and switch the active skill based on key presses (`Enter` for attack, `Q`, `W`, `R` for skills).

### SvgDisplay

A presentational component responsible solely for rendering the SVG `HeroComponent` with the current animation time and whether the hero is moving.

### DebugSkillPanel

User interface component for debugging, featuring skill buttons, a playback toggle, and a timeline slider.

### PlaybackControls (optional)

A potential component to encapsulate playback toggling and timeline scrubbing separate from debug UI for reuse or cleaner code.

---

## Benefits of This Architecture

- Clear separation of concerns improves code readability and maintenance.
- Reusable hooks allow for isolated testing and easier extension.
- Components focus on specific responsibilities, simplifying development.
- Allows easy customization of FPS and animation speed.
- Keyboard controls and animation logic are cleanly decoupled from UI.

---

## How to Use

1. Use `useAnimationController` in the container to manage animation state.
2. Use `useSkillKeyboardControls` to handle keypresses and switch skills.
3. Render the SVG using `SvgDisplay` passing the animation time and movement props.
4. Display `DebugSkillPanel` for debugging and control.
5. Optionally, separate playback controls into its own component if desired.

---

