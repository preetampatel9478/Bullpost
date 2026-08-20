# Bullpost

The Trader Network & Stock Hub.

## Structure

- [frontend/](frontend/) — React + Vite web app (the trader social feed, currently the only implemented piece)
- [mobile/](mobile/) — Expo (React Native) app, fresh scaffold, not yet built out
- [backend/](backend/) — API service (not yet implemented)
- [admin-panel/](admin-panel/) — internal admin dashboard (not yet implemented)

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

## Running the mobile app (Expo Go)

```bash
cd mobile
npm install
npx expo start
```

Scan the printed QR code with the Expo Go app (same Wi-Fi network as this machine), or open Expo Go and enter the URL manually.
