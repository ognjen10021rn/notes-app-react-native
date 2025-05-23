# 📝 LivePad – React Native Frontend

**LivePad** is a real-time note-taking mobile app built with **React Native**. It allows users to create, edit, and delete notes with live sync support via WebSockets. This is the mobile frontend for the [LivePad Spring Boot backend](https://github.com/ognjen10021rn/notes-app-spring-boot).

## 📱 Features

- 📄 Create, edit, and delete notes
- 🔄 Real-time sync with backend via WebSocket
- 🔐 Secure login and registration using JWT
- 🌙 Light and dark theme support (optional)
- 📶 Offline-friendly architecture (optional)

## 🛠 Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation
- Axios (REST API communication)
- WebSocket (real-time sync)
- AsyncStorage (JWT token storage)

## 📂Project Structure
```graphql
.
├── components/       # Reusable UI components
├── screens/          # App screens (Login, Register, Notes)
├── services/         # API and WebSocket logic
├── context/          # Auth and global state management
├── assets/           # Images, icons, etc.
└── App.tsx           # Entry point
```


## 🚀 Getting Started

### Prerequisites

- Node.js & npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Backend running (see [LivePad Spring Boot backend](https://github.com/ognjen10021rn/notes-app-spring-boot))

### Clone the Repository

```bash
git clone https://github.com/ognjen10021rn/notes-app-react-native.git
cd notes-app-react-native
```

### Configure project

Update the API base URL in a ``paths.js`` file (in ``notes-app-react-native/paths.js``) to point to your backend:
```bash
# Make sure you match the port and ip address on the backend side
export const API_URL = "<your-ip-address>:8080"
export const WEB_SOCKET_URL = "<your-ip-address>:8080"
```

```bash
npm install
# or
yarn
```

### Start project

Navigate to ``notes-app-react-native``:

```bash
npx expo start --clear --port 8081
```


You have 2 options:

1. Run with emulator:

Read this:
``https://docs.expo.dev/workflow/android-studio-emulator/``

2. Run on phone:

- Go to the app store or play store on your phone and download ``Expo Go``
- Create an account
- Type the ``exp://`` link from the console or scan the QR Code

## 📄 License

This project is licensed under the MIT License.


