# Daily Screen Quote

A minimalist cinematic daily quote app built with Expo, React Native, and TypeScript.

## Features

- **Daily Rotation**: Get a new cinematic quote every 24 hours (fetched once per day).
- **Elegant UI**: Minimalist typography-first design with automatic Dark/Light mode support.
- **Fade-in Animations**: Smooth transitions using `moti` and `react-native-reanimated`.
- **Favorites**: Save your favorite quotes to a personal collection.
- **Native Sharing**: Share quotes directly from the app using the native share sheet.
- **Daily Notifications**: Schedule a reminder to check your daily quote at 9:00 AM.
- **Offline Fallback**: Built-in cinematic database of 30 quotes used if the API is unavailable or manually toggled.

## Tech Stack

- **Framework**: Expo (SDK 51+)
- **Navigation**: expo-router
- **Styling**: React Native StyleSheet (Premium minimalist theme)
- **State/Storage**: React Hooks + AsyncStorage
- **Icons**: lucide-react-native
- **Animations**: moti / react-native-reanimated

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- [Expo Go](https://expo.dev/expo-go) app installed on your phone.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Scan the QR code with your phone (using Expo Go for Android or the Camera app for iOS) to run the app.

## Building for Production

### Build an APK (Android)

To build a standalone Android APK:

1. Install `eas-cli` globally if you haven't:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure the build:
   ```bash
   eas build:configure
   ```

4. Build the APK (Android):
   ```bash
   eas build --platform android --profile preview
   ```
   *Note: Using the `preview` profile with `buildType: "apk"` in `eas.json` allows you to install the APK directly.*

### iOS Build

Building for iOS requires an Apple Developer Account.
```bash
eas build --platform ios
```

## Project Structure

- `app/`: Routing and Screens (expo-router)
- `src/components/`: Reusable UI components
- `src/services/`: Business logic (quotes fetching, notifications)
- `src/storage/`: Data persistence helpers
- `src/constants/`: Design system (Theme, Typography)

## Environment Variables

This app uses public movie quote APIs. If you swap to an API requiring a key, add a `.env` file:
```text
EXPO_PUBLIC_QUOTE_API_KEY=your_key_here
```
And access it via `process.env.EXPO_PUBLIC_QUOTE_API_KEY`.
# quotes
