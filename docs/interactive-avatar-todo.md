# Interactive Avatar Character Integration - TODO

This document outlines the steps to integrate an interactive avatar character into the multi-step session creation flow (Room page).

## 1. UI Placement
- [x] Add the avatar character component to the Room page so it is always visible during the multi-step form. *(Already floating in RoomLayout)*
- [x] Decide on placement: sidebar, top of the form, or floating overlay. *(Floating overlay chosen)*

## 2. State Management Setup
- [ ] **Centralize avatar state** using React Context or a global store (e.g., Zustand):
  - [ ] Create an `AvatarContext` or store to hold avatar properties (head, hair, emotion, etc.).
  - [ ] Wrap `RoomLayout` (or the app) with the provider so all children can access/update avatar state.
- [ ] **Update avatar state from each step** of the multi-step form:
  - [ ] In each step, call context/store methods to update avatar appearance and emotion.
- [ ] **Ensure `<AvatarCharacter />` reads from this state** and updates in real-time as the user progresses.

## 3. Stage-Specific Interactivity
- [ ] **Stage 1 (Child Data):**
  - [ ] Show avatar in a default/neutral state.
- [ ] **Stage 2 (Avatar Data):**
  - [ ] Update avatar in real-time as user selects head/hair.
- [ ] **Stage 3 & 4 (Video/Mini-games):**
  - [ ] Add simple avatar animation or reaction to "Next" clicks (e.g., wave, blink).
- [ ] **Stage 5 (Emotional Expressions):**
  - [ ] Change avatar's facial expression or body language based on selected feelings.
- [ ] **Stage 6 (Session Notes & Tags):**
  - [ ] Show avatar in a "thinking" or "writing" pose.

## 4. Avatar Component Enhancements
- [ ] Ensure the avatar component accepts props or reads from context/store for head, hair, and emotion.
- [ ] Add animation/transition support for smooth updates.
- [ ] (Optional) Add sound or visual effects for extra engagement.

## 5. Testing & UX
- [ ] Test avatar updates in each stage for responsiveness and correctness.
- [ ] Gather feedback and iterate on interactivity and placement.

---

**Goal:**
Create a seamless, engaging, and interactive avatar experience that visually reflects the user's progress and choices throughout the session creation process. 