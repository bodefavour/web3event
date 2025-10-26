# web3event

Mobile-first Expo + React Native + TypeScript foundation aligned to the "event verse" onboarding concept.
Mobile-first Expo + React Native + TypeScript foundation aligned to the "event verse" onboarding concept.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo bundler:
2. Start the Expo bundler:
   ```bash
   npm run start
   ```
3. Choose a target from the Expo CLI prompt:
3. Choose a target from the Expo CLI prompt:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)
   - Press `w` for web preview

## What's in the box

- **Inter typography stack** via `@expo-google-fonts/inter`, preloaded before rendering UI.
- **Design tokens** in `src/theme` for palette, typography, spacing, and radii that reflect the onboarding mock.
- **Reusable primitives** like `ThemedText` and `AppButton` to keep styling consistent with the brand system.
- **Hero onboarding screen** at `src/screens/OnboardingScreen.tsx` reproducing the gradient orb, glass wallet CTA, and dual buttons from Figma.
- **Connect wallet screen** at `src/screens/ConnectWalletScreen.tsx` mirroring the wallet picker with placeholder initials ready for real icons.
- **Profile setup screen** at `src/screens/ProfileSetupScreen.tsx` with styled inputs, social link stubs, and wallet summary following the design.

## Project Structure

- `App.tsx` — boots fonts and renders the onboarding flow once ready.
- `src/theme` — color palette, typography scale, and spacing tokens.
- `src/components` — shared UI primitives.
- `src/hooks` — theming helpers.
- `src/screens` — onboarding, wallet connection, and profile setup flows.
- `assets/` — placeholder directory for future imagery (keep gradients/illustrations here).

## Next Steps

- Hook up navigation (e.g., Expo Router) when additional screens are ready.
- Replace the static hero gradient or shadow with exported artwork if the Figma asset requires higher fidelity.
- Connect the top-right wallet CTA to the actual auth/onboarding flow when available.
- Wire the profile setup form to real data models and wallet metadata.
- Add unit or component tests as interactive behaviours grow.
