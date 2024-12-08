# VAPI Integration Roadmap

## Milestone 1: API Key Management
Add VAPI API key input alongside existing OpenAI key input.

### Tasks:
1. Update `components/prompt-form.tsx` to include VAPI key input
   - Add new input field with identical styling
   - Match validation patterns
   - Add appropriate labels
2. Extend localStorage handling
   - Add new key: 'vapi-api-key'
   - Maintain same update frequency
   - Match encryption/security patterns
3. Update API key validation logic
4. Test persistence and validation

## Milestone 2: Call Control Component
Create new CallButton component for prompt actions.

### Tasks:
1. Add new call button to `components/prompt-actions.tsx`
   - Match existing button styling
   - Implement state management
   - Add tooltips
2. Add call state indicators
   - Idle state
   - Loading state
   - Active call state
   - Error state
3. Add error handling
4. Test component in isolation

## Milestone 3: History Integration
Add CallButton to prompt history rows.

### Tasks:
1. Update `components/prompt-history.tsx`
   - Add CallButton to action row
   - Position left of existing buttons
2. Handle state management
3. Test integration
4. Verify mobile layout

## Milestone 4: Generated Prompt Integration
Add CallButton to generated prompt pane.

### Tasks:
1. Update `components/generated-prompt.tsx`
   - Add CallButton to action row
   - Position left of existing buttons
2. Handle state management
3. Test integration
4. Verify mobile layout

## Milestone 5: VAPI Integration Library
Create library for managing VAPI calls.

### Requirements from VAPI:
1. API Documentation
   - Authentication methods
   - WebSocket/WebRTC setup
   - Call initialization
   - Audio stream handling
2. Example Code
   - Call initialization
   - Error handling
   - State management
3. Additional Context Needed
   - Browser compatibility requirements
   - Rate limiting details
   - Error codes and meanings
   - Call quality requirements

### Tasks:
1. Create `lib/vapi.ts`
   - Initialize VAPI client
   - Handle authentication
   - Manage call lifecycle
2. Add error handling
3. Add TypeScript types
4. Create test suite

## Testing & Quality Assurance
- Unit tests for new components
- Integration tests for API key management
- End-to-end tests for call functionality
- Mobile responsiveness verification
- Cross-browser testing
- Error scenario testing

## Future Enhancements
- Call quality monitoring
- Call history
- Analytics integration
- Advanced error recovery
- Mobile-specific optimizations
