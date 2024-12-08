# Call State Management Roadmap

## Current Issues
1. **Decentralized Call State**
   - Each CallButton maintains independent state
   - No global awareness of call status
   - Multiple buttons can try to initiate calls simultaneously

2. **Race Conditions**
   - Multiple "connecting" states can occur at once
   - isCallActive check happens after button state changes
   - No atomic state transitions

3. **Inconsistent State Recovery**
   - Error states are isolated to individual buttons
   - Other buttons remain unaware of failed calls
   - No global error recovery mechanism

## Proposed Solution

### 1. Create Global Call State Manager
```typescript
type CallState = 'idle' | 'connecting' | 'active' | 'error';

interface CallStateManager {
  state: CallState;
  currentCallId: string | null;
  error: Error | null;
  activeButtonId: string | null;
}
```

### 2. Implement State Management Functions
```typescript
interface CallStateActions {
  initiateCall: (buttonId: string) => Promise<boolean>;
  endCall: (buttonId: string) => Promise<void>;
  handleError: (error: Error) => void;
  resetState: () => void;
}
```

### 3. Create React Context Provider
- Wrap app with CallStateProvider
- Expose state and actions via hooks
- Ensure atomic state updates
- Implement state persistence if needed

### 4. Modify CallButton Component
- Remove local state management
- Connect to global call state
- Use buttonId for tracking active button
- Handle state transitions through manager

### 5. Update Vapi Client Integration
- Move client initialization to state manager
- Ensure proper cleanup on state changes
- Add connection timeout handling
- Implement retry mechanism

## Implementation Steps

1. **Phase 1: Core State Management**
   - [ ] Create CallStateManager class
   - [ ] Implement state transitions
   - [ ] Add error handling
   - [ ] Create React context

2. **Phase 2: Button Integration**
   - [ ] Update CallButton component
   - [ ] Add unique button IDs
   - [ ] Connect to global state
   - [ ] Update UI based on global state

3. **Phase 3: Vapi Integration**
   - [ ] Move Vapi client to state manager
   - [ ] Add connection timeouts
   - [ ] Implement retry logic
   - [ ] Handle cleanup

4. **Phase 4: Error Recovery**
   - [ ] Add global error handling
   - [ ] Implement recovery mechanisms
   - [ ] Add user feedback
   - [ ] Test edge cases

## Success Criteria
1. Only one call can be active at any time
2. All buttons reflect current global state
3. Failed calls are properly cleaned up
4. Users receive clear feedback
5. No stuck states or race conditions

## Testing Scenarios
1. Rapid button clicks
2. Network failures
3. API key changes
4. Browser refresh
5. Concurrent history item calls
