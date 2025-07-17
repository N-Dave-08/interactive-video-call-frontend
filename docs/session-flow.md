# Session Flow Documentation

This document describes the comprehensive 7-stage interactive session flow system designed for child therapy or educational sessions.

## Overview

The session flow is implemented in `src/pages/Client/room/index.tsx` and consists of7stinct stages that guide users through a structured therapeutic or educational experience. Each stage collects specific data, provides interactive elements, and maintains state persistence throughout the session.

## Stage Architecture

### Stage Flow Overview

```
Stage 1: Child Data → Stage 2: Avatar Data → Stage 3: Video & Minigames → 
Stage 4: Other Activities → Stage 5: Emotional Expressions → 
Stage 6ssion Notes & Tags → Stage 7: Completion
```

### Stage Definitions

| Stage | Name | Purpose | Key Features |
|-------|------|---------|--------------|
| 1 | Child Data | Collect basic child information | Progressive form, validation |
|2atar Data | Create personalized avatar | Visual customization, real-time preview |
|3 Video & Minigames | Interactive activities | Game navigation, URL state management |
| 4 | Other Activities | Additional content | Extensible activity system |
| 5 | Emotional Expressions | Assess emotional state | Multi-step, body mapping, drawing |
|6 | Session Notes & Tags | Document session | Notes input, tag system |
| 7 | Completion | Celebrate and navigate | Animations, achievements |

## Detailed Stage Flow

### Stage1ld Data

**Purpose**: Collect basic child information through an interactive form

**Flow**:
1. **Initial Welcome**: Avatar appears with Hello! Let's have some fun together."
2. **"Got it!" Interaction**: Child clicks Got it!" to start the form
3. **Progressive Form**:4ep sequential form:
   - **Step 1**: First name input
   - **Step 2**: Last name input  
   - **Step 3**: Age input (number)
   - **Step 4**: Birthday selection (calendar picker)
4*Validation**: All fields must be completed before proceeding
5. **Save & Proceed**: Data saved to backend, moves to Stage2

**Key Features**:
- Local storage for form step persistence
- Dynamic question updates via question store
- Calendar with past date restrictions
- Animated transitions between form steps

**Data Structure**:
```typescript
interface ChildData {
  first_name: string;
  last_name: string;
  age: number;
  birthday: string;
}
```

### Stage 2ar Data

**Purpose**: Create personalized avatar character

**Flow**:
1. **Avatar Creator Interface**: Full customization panel opens
2tomization Options**:
   - Head selection (8 different heads)
   - Hair selection (11fferent hairstyles)
   - Expression selection (8 different expressions)
   - Clothes selection (12 different outfits)
   - Background selection (3 different backgrounds)
3. **Real-time Preview**: Avatar updates immediately with selections
4. **Save & Proceed**: Avatar data saved, moves to Stage3

**Key Features**:
- Visual avatar preview
- Categorized selection panels
- Default selections provided
- Back button to return to Stage 1

**Data Structure**:
```typescript
interface AvatarData [object Object]
  head: string;
  hair: string;
  expression: string;
  clothes: string;
  background: string;
}
```

### Stage 3: Video & Minigames

**Purpose**: Interactive activities and games

**Flow**:
1. **Activities Panel** (default view):
   - **Fun Videos**: Educational video content
   - **Mini Games**: Click to expand games panel
2 **Games Panel** (when "Mini Games" selected):
   - **Flappy Bird**: Navigate to `/mini-games/flappy-bird`
   - **Snake**: Navigate to `/mini-games/snake`
   - **Gentle Puzzle**: Navigate to `/mini-games/gentle-puzzle`
   - **Bubble Pop**: Navigate to `/mini-games/bubble-pop`
3. **Return Navigation**: Back button to return to activities
4. **Proceed**: Moves to Stage 4 (regardless of activity completion)

**Key Features**:
- URL-based panel state management
- Direct navigation to external game routes
- No requirement to complete activities
- Back button to Stage 2

### Stage 4: Other Activities

**Purpose**: Additional interactive content

**Flow**:
1. **Activity Interface**: Presents additional activities
2. **Content**: Specific activities not detailed in the code
3. **Proceed**: Moves to Stage5

**Key Features**:
- Back button to Stage 3Loading states and error handling

### Stage 5: Emotional Expressions

**Purpose**: Assess and express emotional state

**Flow**:
1. **Multi-step Progress Bar**: 3 internal steps with visual indicators
2. **Step 1 - Emotion Selection**:
   -8otion options with emojis (Happy, Excited, Calm, Curious, Proud, Nervous, Sad, Angry)
   - Visual selection with color-coded buttons
3*Step 2- Body Map**:
   - Interactive body mapping component
   - Allows annotation of body parts
4. **Step3 - Drawing Pad**:
   - Drawing interface for creative expression
   - Captures drawing data
5. **Proceed**: All emotional data saved, moves to Stage6

**Key Features**:
- Internal step progression within the stage
- Multiple expression methods (selection, mapping, drawing)
- Progress indicators for sub-steps
- Back button to Stage 4

**Data Structure**:
```typescript
interface EmotionalExpression [object Object]  method: string;
  drawing_data: string;
  selected_feelings: string[];
  body_map_annotations: string[];
}
```

### Stage 6ssion Notes & Tags

**Purpose**: Document session and add metadata

**Flow**:
1ession Notes Input**:
   - Large text area for session documentation
   - Free-form notes about the session2. **Tags Input**:
   - Comma-separated tag input
   - Automatic deduplication of tags
   - Real-time tag parsing
3alidation**: Notes and tags are optional
4inal Save**: Marks session as completed, moves to Stage7

**Key Features**:
- Tag deduplication logic
- Session status update to completed
- Back button to Stage 5

### Stage7pletion

**Purpose**: Celebrate completion and provide navigation

**Flow**:
1. **Celebration Animation**:
   - Confetti animation on load
   - Floating balloon elements
   - Trophy and sparkles animations
2. **Achievement Cards**:
   - **Emotional Growth**: Highlights feelings exploration
   - **Creative Expression**: Celebrates imagination
   - **Session Complete**: Acknowledges completion
3. **Navigation Options**:
   - **Go Home**: Navigate to dashboard
   - **New Session**: Navigate to sessions list
4. **Back Button**: Returns to Stage6

**Key Features**:
- Rich celebration animations
- Achievement highlighting
- Multiple navigation paths
- No further progression (end of session)

## Technical Implementation

### State Management

#### Session State
- **Backend Persistence**: All session data stored in database
- **Stage Tracking**: Current stage stored as string (Stage 1 Stage 2**Data Restoration**: Session state restored on component mount

#### Form State
- **Local Component State**: Form data managed in component state
- **Validation**: Required field validation before progression
- **Local Storage**: Temporary preferences stored locally

#### UI State
- **Avatar Context**: Global avatar character state
- **Question Store**: Dynamic speech bubble content
- **Loading States**: Async operation indicators

### Data Flow Architecture

```
Session Load → Stage Restoration → Data Population → User Interaction → 
Stage Validation → Backend Update → Stage Progression → UI Update
```

### Navigation Pattern

#### Forward Navigation
```typescript
const handleStageNext = async () => {
  // 1. Validate current data
  // 2. Save to backend
  await updateSession(session_id, {
    stage_data: currentData,
    stage: Next Stage Name"
  });
  // 3. Update local state
  setStep(nextStepIndex);
};
```

#### Backward Navigation
```typescript
const handleBack = () =>[object Object]// No backend save, just update local state
  setStep(previousStepIndex);
};
```

### Error Handling

#### Loading States
- Skeleton loaders during async operations
- Disabled buttons during loading
- Progress indicators for long operations

#### Error Recovery
- Error messages displayed to user
- Retry mechanisms for failed operations
- Graceful fallbacks for missing data

#### Validation
- Required field validation
- Data type validation
- Format validation (dates, numbers)

### Animation System

#### Stage Transitions
- Framer Motion animations
- Spring-based transitions
- Staggered element animations

#### Avatar Interactions
- Dynamic positioning based on stage
- Speech bubble animations
- Interactive click responses

#### Celebration Effects
- Confetti animations
- Floating elements
- Achievement highlights

## File Structure

```
src/pages/Client/room/
├── index.tsx                 # Main session component
├── RoomLayout.tsx           # Layout wrapper
├── VerticalStepper.tsx      # Progress indicator
└── stages/
    ├── Stage1hildData.tsx
    ├── Stage2AvatarData.tsx
    ├── Stage3VideoMinigames.tsx
    ├── Stage4.tsx
    ├── Stage5EmotionalExpressions.tsx
    ├── Stage6SessionNotesTags.tsx
    ├── Stage7Completion.tsx
    └── StageCardLayout.tsx
```

## Best Practices

### Data Persistence
- Always save data before stage progression
- Validate data completeness before saving
- Handle network failures gracefully

### User Experience
- Provide clear progress indicators
- Use child-friendly language and interactions
- Maintain consistent navigation patterns

### Performance
- Lazy load stage components
- Optimize animations for smooth performance
- Cache frequently used data

### Accessibility
- Provide keyboard navigation
- Use semantic HTML elements
- Include proper ARIA labels

## Configuration

### Environment Variables
```env
VITE_API_BASE_URL=https://your-api-url.com
```

### Session Configuration
```typescript
const steps = 
 Child Data",
 Avatar Data, 
  Video & Minigames",
Stage 4",
  "Emotional Expressions",
Session Notes & Tags,Completion"
];
```

## Troubleshooting

### Common Issues

1. **Stage Not Progressing**
   - Check required field validation
   - Verify backend API connectivity
   - Check console for error messages

2. **Data Not Saving**
   - Validate session_id exists
   - Check network connectivity
   - Verify API endpoint configuration

3. **Avatar Not Displaying**
   - Check avatar context provider
   - Verify asset paths
   - Check browser console for errors

### Debug Mode
Enable debug logging by setting:
```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development;
```

---

**For implementation details, see the individual stage component files and the main room component.**