# Dark AI - Project Documentation

## Project Overview

**Dark AI** is a React Native mobile application that provides AI-powered chat assistance to help users achieve their goals. The app uses Expo framework and features a modern dark theme UI with premium subscription capabilities.

- **App Name**: Dark AI
- **Bundle ID**: com.sedoyjan.darkai
- **Version**: 2.3.0
- **Platform**: React Native with Expo (iOS/Android)
- **Backend**: Node.js/Elysia API (Heroku deployment)

## Architecture Overview

### Tech Stack

**Frontend:**
- React Native 0.76.7
- Expo SDK 52
- TypeScript
- Expo Router (file-based routing)
- Redux Toolkit (state management)
- Redux Persist (data persistence)

**Backend Integration:**
- Axios HTTP client
- Auto-generated TypeScript API client from OpenAPI spec
- RESTful API architecture

**Authentication:**
- Firebase Authentication
- Apple Sign-In
- Anonymous authentication support

**Monetization:**
- RevenueCat for subscription management
- React Native Purchases UI

**Additional Services:**
- Firebase Analytics & Crashlytics
- Push notifications (Firebase Messaging)
- Internationalization (i18next)

## Project Structure

```
darkai/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── (chats)/       # Chat-related screens
│   │   └── (profile)/     # Profile screens
│   ├── _layout.tsx        # Root layout
│   ├── signin.tsx         # Authentication screen
│   ├── subscriptionModal.tsx
│   └── onboardingModal.tsx
├── components/            # Reusable UI components
│   ├── Chat/             # Chat-specific components
│   └── navigation/       # Navigation components
├── blocks/               # Basic UI building blocks
├── rdx/                  # Redux store structure
│   ├── app/             # App-level state
│   ├── chat/            # Chat state management
│   └── settings/        # User settings
├── services/            # External service integrations
├── apiClient/           # Auto-generated API client
├── constants/           # App constants
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── assets/              # Static assets
```

## Key Features

### 1. Chat System
- Real-time AI conversations
- Message history with pagination
- Chat creation and management
- Message typing indicators
- Markdown message rendering
- Chat renaming and deletion

### 2. Authentication
- Firebase Authentication integration
- Apple Sign-In (iOS/macOS)
- Anonymous authentication fallback
- Automatic token refresh
- Account deletion support

### 3. Subscription System
- RevenueCat integration
- Premium monthly subscription (`com.sedoyjan.darkai.premium.monthly`)
- Paywall with purchase UI
- Subscription status monitoring
- Free message limits for non-subscribers

### 4. User Experience
- Onboarding flow with 4 steps
- Dark theme with gradient backgrounds
- Internationalization support (English)
- Push notifications
- Offline data persistence

## Implementation Details

### State Management (Redux)

#### App Slice (`rdx/app/slice.ts`)
Manages global application state:
- User authentication data
- FCM tokens for push notifications
- Locale and language settings
- Subscription status
- Onboarding state
- Free request limits

#### Chat Slice (`rdx/chat/slice.ts`)
Handles chat-related state:
- Chat list and individual chat data
- Message arrays by chat ID
- Loading states and pagination
- Typing indicators
- Error handling

#### Settings Slice (`rdx/settings/slice.ts`)
User preferences and settings:
- Terms and privacy acceptance
- User configuration

### API Integration

The app communicates with a backend API hosted on Heroku (`https://darkai-a966676ae085.herokuapp.com`):

**Key Endpoints:**
- `POST /chat/send-message` - Send messages to AI
- `GET /chat/chats` - Retrieve user's chat list
- `GET /chat/messages/:chatId` - Get chat message history
- `POST /user/login` - User authentication
- `POST /user/login/apple` - Apple Sign-In
- `POST /user/check-subscription` - Verify subscription status
- `DELETE /chat/delete-all` - Clear all chats
- `PUT /chat/rename` - Rename chat
- `POST /analytics/launch` - App launch analytics

### Authentication Flow

1. **App Initialization** (`rdx/app/thunks.ts`):
   - Check existing Firebase authentication state
   - If no user exists, sign in anonymously
   - Retrieve Firebase ID token for API authentication
   - Configure RevenueCat for subscription management

2. **Apple Sign-In** (iOS only):
   - Request Apple credentials with email/name scopes
   - Convert to Firebase credential
   - Update user state and sync with backend

3. **Token Management**:
   - Automatic Firebase token refresh
   - Token included in API request headers
   - Token stored in Redux state

### Chat Implementation

#### Message Flow
1. User types message in `ChatInput` component
2. Message dispatched via `sendMessage` hook
3. API call to `/chat/send-message` endpoint
4. Real-time message updates in Redux store
5. UI updates with typing indicators and new messages

#### Message Types
```typescript
enum ChatMessageType {
  USER = 'USER',
  BOT = 'BOT', 
  SYSTEM = 'SYSTEM'
}
```

Special message handling:
- `"out-of-free-messages"` - Subscription prompt
- `"no-messages"` - Welcome message
- `"bot-typing"` - Typing indicator

### Subscription System

#### RevenueCat Integration
- Apple App Store subscription: `appl_lkftktjGVRKPuNXucexWIbGrBxv`
- Product ID: `com.sedoyjan.darkai.premium.monthly`
- Automatic subscription status monitoring
- Purchase restoration support

#### Subscription Checks
- Validation on app launch
- Message sending restrictions for free users
- Paywall presentation when limits reached

### Navigation Structure

Using Expo Router with TypeScript:

```
(tabs)/
├── (chats)/
│   ├── index.tsx          # Chat list
│   ├── [chatId].tsx       # Individual chat
│   └── _layout.tsx        # Chat tab layout
└── (profile)/
    ├── index.tsx          # Profile main
    ├── languages.tsx      # Language settings
    ├── privacy.tsx        # Privacy policy
    └── terms.tsx          # Terms of service
```

Modals:
- `subscriptionModal.tsx` - Premium upgrade
- `onboardingModal.tsx` - First-time user experience
- `editChatModal.tsx` - Chat management
- `signin.tsx` - Authentication

### UI Design System

#### Color Palette (`constants/Colors.ts`)
- Primary gradient: `#002504` to `#020202`
- Primary text: `#FFFFFF`
- Success/CTA: `#1A9C51`
- Premium gradient: `#F3FF09` to `#C4F244`
- Semi-transparent backgrounds for overlays

#### Component Architecture
- **Blocks**: Basic UI elements (Button, Icon, Spacer)
- **Components**: Complex UI components (Chat, Headers, Modals)
- **Shared Styles**: Consistent typography and layout patterns

### Data Persistence

Using Redux Persist with AsyncStorage:
- Persisted slices: `chat`, `settings`, `app`
- Automatic rehydration on app launch
- Version management for schema changes

### Push Notifications

Firebase Cloud Messaging integration:
- FCM token management
- Deep linking to specific chats
- Notification permission handling
- Background notification processing

### Analytics & Monitoring

#### Firebase Analytics
- Screen view tracking
- User login events
- App launch analytics
- Custom event tracking

#### Crashlytics
- Automatic crash reporting
- User ID association
- Error logging and monitoring

### Internationalization

i18next integration:
- English language support
- Structured translation keys
- Date/time formatting with date-fns
- Extensible for additional languages

### Build Configuration

#### Expo Configuration (`app.config.ts`)
- iOS/Android specific settings
- Firebase service configuration
- Push notification setup
- App icons and splash screens
- Bundle identifiers and versioning

#### Development Scripts
- `yarn dev` - Development with dev client
- `yarn build` - Platform-specific builds
- `yarn gen` - API client generation from OpenAPI spec
- `yarn extract` - Translation key extraction

### Security Considerations

1. **API Security**:
   - Firebase JWT token authentication
   - Automatic token refresh
   - Secure token storage

2. **Data Protection**:
   - Local data encryption via Redux Persist
   - Secure API communication (HTTPS)
   - Privacy policy compliance

3. **Apple Requirements**:
   - App Transport Security configuration
   - Privacy manifest for data usage
   - App Tracking Transparency compliance

## Development Workflow

### Environment Setup
1. Install dependencies: `yarn install-deps`
2. iOS pod installation included
3. Configure Firebase services
4. Set up RevenueCat keys

### API Client Generation
```bash
yarn gen  # Generates TypeScript client from OpenAPI spec
```

### Testing & Quality
- ESLint configuration for code quality
- TypeScript strict mode
- Knip for unused code detection
- Development/production environment separation

## Deployment

### Backend
- Heroku deployment: `https://darkai-a966676ae085.herokuapp.com`
- Development fallback: `http://localhost:3000`

### Mobile App
- iOS App Store distribution
- Android Play Store support configured
- EAS (Expo Application Services) integration

## Future Enhancements (TODO)

Based on `TODO.md`:
- Follow-up push notifications for continued dialog
- Improved chat input with text area functionality

## Monitoring & Analytics

- Firebase Analytics for user behavior
- Crashlytics for error tracking
- RevenueCat for subscription metrics
- Custom analytics for app launches and user engagement

This comprehensive implementation provides a robust, scalable AI chat application with modern React Native architecture, premium subscription capabilities, and extensive user experience features. 