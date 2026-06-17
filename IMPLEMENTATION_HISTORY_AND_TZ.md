# VEST Mobile App — Implementation History & Technical Specification

## 1. Project Overview

**Project Name:** VEST (rebranded from KazInvest)
**Platform:** iOS & Android (React Native with Expo)
**Expo SDK:** 54 (upgraded from 52)
**Architecture:** Expo Router (file-based routing), NativeWind v4, Zustand, TanStack Query
**Backend:** FastAPI (Python) with MongoDB

---

## 2. Implemented Features

### 2.1 Core Features (MVP)
- [x] **Rebranding** — App renamed from KazInvest to VEST
- [x] **Onboarding flow** — Multi-screen onboarding with navigation
- [x] **Internationalization (i18n)** — Support for multiple languages (RU, KZ, EN)
- [x] **Theming** — Dark/Light/OLED themes with glassmorphism design
- [x] **Tab Navigation** — 5 tabs: Home, Portfolio, Market, Academy, Profile
- [x] **Backend Integration** — Axios client with auth interceptors

### 2.2 Advanced Features (Phase 2)
- [x] **Biometric Authentication** — Face ID / Touch ID integration via `expo-local-authentication`
- [x] **Paper Trading** — Virtual portfolio with buy/sell, PnL tracking
- [x] **AI Assistant** — Chat interface with mock AI responses
- [x] **Subscription System** — Modular subscription tiers with Telegram Stars
- [x] **Market Data** — Real-time charts and asset prices
- [x] **News Feed** — Financial news widget

---

## 3. File Structure & Key Components

### 3.1 Entry Points
```
/src/app/index.tsx          — Root redirect to (tabs)
/src/app/_layout.tsx        — Root layout with providers (i18n, theme, query)
/src/app/(tabs)/_layout.tsx — Tab bar configuration
/src/app/(tabs)/index.tsx   — Dashboard/Home screen
```

### 3.2 Screens Created
```
/src/app/onboarding/index.tsx  — Onboarding flow
/src/app/biometrics.tsx       — Biometric settings screen
/src/app/ai-assistant.tsx     — AI chat interface
/src/app/subscribe.tsx        — Subscription/payment screen
```

### 3.3 Core Components
```
/src/components/ui/ThemedText.tsx  — Themed text component (variants: h1-h4, body, caption)
/src/components/ui/Card.tsx      — Glassmorphism card component
```

### 3.4 Stores (Zustand)
```
/src/stores/theme.ts         — Theme management (dark/light/oled)
/src/stores/language.ts      — Language persistence (AsyncStorage)
/src/stores/paperTrading.ts — Virtual trading state & logic
```

### 3.5 Utilities
```
/src/lib/api.ts              — Axios client with auth & error handling
/src/lib/biometrics.ts      — Biometric auth wrapper
/src/lib/ai.ts              — AI service interfaces & mock functions
/src/lib/i18n.ts            — i18next configuration
```

### 3.6 Configuration Files
```
app.json              — Expo config (bundle ID: com.vest.app)
package.json          — Dependencies (Expo SDK 54, RN 0.79)
babel.config.js       — Babel with expo preset
tailwind.config.js    — NativeWind theme tokens
tsconfig.json         — Path aliases (@/* → src/*)
```

---

## 4. Technical Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native 0.79 + Expo SDK 54 |
| Navigation | Expo Router (v4) |
| Styling | NativeWind v4 (Tailwind CSS for RN) |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) |
| HTTP Client | Axios |
| Icons | lucide-react-native |
| Animations | react-native-reanimated |
| Storage | AsyncStorage |
| Biometrics | expo-local-authentication |
| Backend | FastAPI + MongoDB |

---

## 5. Build & Development Issues (Resolved)

### 5.1 Metro Bundler Connection Issues
**Problem:** "Could not connect to development server"
**Root Cause:** iOS simulator expected `localhost:8081` but Metro was binding to LAN IP
**Solution:**
```bash
# Force Metro to use localhost
npx expo start --host localhost

# OR rebuild with LAN IP
REACT_NATIVE_PACKAGER_HOSTNAME=10.10.18.46 npx expo run:ios
```

### 5.2 CocoaPods Installation Failures
**Problem:** Permission denied on `~/.netrc`, incompatible reanimated podspec
**Solutions:**
```bash
chmod 600 ~/.netrc
rm -rf ios/Pods ios/Podfile.lock && npx pod install
```

### 5.3 Xcode Build Database Locked
**Problem:** "Build database locked" error
**Solution:**
```bash
# Kill Xcode & Simulator
pkill -f Xcode; pkill -f Simulator

# Clean DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/VEST*
```

### 5.4 Missing Babel Plugins
**Problem:** Build errors for `react-native-worklets/plugin`
**Temporary Fix:** Removed from `babel.config.js` during debugging, later re-enabled

### 5.5 Missing Entry File
**Problem:** White screen — missing `/src/app/index.tsx`
**Solution:** Created redirect file:
```tsx
import { Redirect } from 'expo-router';
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
```

### 5.6 Asset Build Errors
**Problem:** Missing icon/splash assets causing build failures
**Solution:** Temporarily removed asset references from `app.json`:
```json
// Removed: icon, splash, favicon references
// Removed: expo-splash-screen plugin
```

### 5.7 Port Conflicts
**Problem:** Multiple Metro instances on port 8081
**Solution:**
```bash
# Kill all Expo processes
pkill -9 -f "expo"
pkill -9 -f "node.*metro"

# Restart on clean port
npx expo start --host localhost --port 8081
```

---

## 6. Development Commands

### 6.1 iOS (Xcode Simulator)
```bash
# Start Metro + build & run iOS
cd /Users/aleksandr/Project/kazinvest-mobile
npx expo run:ios

# Start Metro separately
npx expo start --host localhost

# Just rebuild iOS (Metro already running)
npx expo run:ios --no-bundler

# Specific device
npx expo run:ios --device "iPhone 17 Pro"

# Clean build
rm -rf ios && npx expo run:ios
```

### 6.2 Android
```bash
# Start Metro + build & run Android
npx expo run:android

# Clean build
rm -rf android && npx expo run:android
```

### 6.3 Web
```bash
# Start web dev server
npx expo start --web
```

### 6.4 Troubleshooting Commands
```bash
# Check Metro status
curl http://localhost:8081

# Check simulator apps
xcrun simctl listapps booted | grep -A5 com.vest.app

# Launch app on simulator
xcrun simctl launch booted com.vest.app

# View app logs
xcrun simctl spawn booted log show --predicate 'process == "VEST"' --last 10s

# List available simulators
xcrun simctl list devices available

# Boot specific simulator
xcrun simctl boot "iPhone 17 Pro"
open -a Simulator
```

### 6.5 Simulator Shortcuts
| Action | Shortcut |
|--------|----------|
| Reload JS | `Cmd + R` |
| Debug Menu | `Cmd + Ctrl + Z` |
| Screenshot | `Cmd + S` |
| Home | `Cmd + Shift + H` |

---

## 7. Environment Variables

```env
EXPO_PUBLIC_API_URL=https://kazinvest.vercel.app
EXPO_PUBLIC_APP_NAME=VEST
```

---

## 8. iOS Build Configuration

### 8.1 Xcode Project Details
- **Bundle ID:** `com.vest.app`
- **Display Name:** VEST
- **Supported Orientations:** Portrait
- **Minimum iOS Version:** 15.1
- **Build Target:** Debug (development) / Release (distribution)

### 8.2 DerivedData Location
```
~/Library/Developer/Xcode/DerivedData/VEST-hekcmjvwywhccyeddiscqpvtyzkx/
```

### 8.3 Build Products
```
ios/build/Build/Products/Debug-iphonesimulator/VEST.app
```

---

## 9. Package Versions (Critical)

```json
{
  "expo": "~54.0.0",
  "react-native": "0.79.0",
  "expo-router": "~4.0.0",
  "nativewind": "^4.0.0",
  "react-native-reanimated": "~3.16.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.0.0",
  "axios": "^1.7.0",
  "i18next": "^23.0.0",
  "react-i18next": "^14.0.0"
}
```

---

## 10. Pending Tasks / Known Issues

- [ ] Re-enable `react-native-reanimated/plugin` in `babel.config.js`
- [ ] Add proper app icons and splash screen assets
- [ ] Test biometric authentication on physical device
- [ ] Complete AI backend integration (currently mock)
- [ ] Implement real-time WebSocket for market data
- [ ] Add push notifications
- [ ] E2E testing with Playwright/Maestro

---

## 11. Architecture Notes

### 11.1 Navigation Structure
```
/                          → Redirect to /(tabs)
/(tabs)                    → Tab layout (5 tabs)
  /(tabs)/index            → Dashboard (Home)
  /(tabs)/portfolio        → Portfolio
  /(tabs)/market           → Market/Assets
  /(tabs)/academy          → Academy/Learn
  /(tabs)/profile          → Profile/Settings
/onboarding                → Onboarding screens
/biometrics                → Biometric settings (modal)
/ai-assistant              → AI chat (modal)
/subscribe                 → Subscription page
```

### 11.2 State Management Flow
```
User Action → Zustand Store → AsyncStorage (persist)
                ↓
         React Query (server cache)
                ↓
            Axios → FastAPI Backend
```

### 11.3 Theme System
- 3 theme modes: `light`, `dark`, `oled`
- Color tokens defined in `tailwind.config.js`
- Glassmorphism cards with `backdrop-filter: blur(16px)`
- Dynamic color resolution via `useThemeStore`

---

## 12. Deployment Notes

### 12.1 App Store (iOS)
1. Build with Xcode: Product → Archive
2. Upload via Xcode Organizer or Transporter
3. Requires Apple Developer Account ($99/year)

### 12.2 Google Play (Android)
1. Build AAB: `npx expo run:android --variant release`
2. Or use EAS Build: `eas build --platform android`
3. Upload AAB to Google Play Console

### 12.3 EAS Build (Expo)
```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

*Document generated from implementation history*
*Last updated: June 10, 2026*
