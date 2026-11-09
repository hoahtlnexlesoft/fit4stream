# Fit4Stream — mobile app (React Native · Expo)

Viewer app for Fit4Stream, built 1:1 from the approved prototype (https://fit4stream.vercel.app).
iOS, Android and web from one codebase. TypeScript strict, file-based routing.

## Run

```bash
cd mobile
npm install
npx expo start          # press i (iOS sim), a (Android), w (web) — or scan the QR with Expo Go
npm run typecheck       # tsc --noEmit
npm run export:web      # static web build in dist/
```

Requires Node 18+. Stack: Expo SDK 52 · React Native 0.76 · expo-router 4 · react-native-svg · expo-linear-gradient · expo-blur · Plus Jakarta Sans.

## Structure

```
app/                      ← every screen (expo-router: file = route)
  _layout.tsx             fonts, providers (SafeArea, Toast, Store), Stack
  (tabs)/                 5 tab roots: index (Home) · guide · onair · upcoming · account
  event/[id].tsx          event detail (live / upcoming / ended)
  player/[id].tsx         live player · ?state=waiting (lobby) · ?state=ended (summary)
  checkout/[id].tsx       ticket + promo + payment method → success
  success.tsx, receipt/[id].tsx, payments.tsx, my-events.tsx
  organizer/[name].tsx, channels.tsx, categories.tsx, list/[name].tsx, search.tsx
  notifications.tsx, reviews.tsx, profile.tsx, security.tsx
  login.tsx, signup.tsx, forgot.tsx
src/
  ui/                     design system (tokens + ~60 components). Import from '@ui'.
    theme/                colors, fonts, type scale, radius, shadow
    components/           core · form · feedback · navigation · event · live · payment
  components/             app-level building blocks (Screen, EventCard, HeroCarousel, Skeletons,
                          ShareSheet, StripeCta, InfoList, Gender/Birthday sheets, SideRail…)
  data/                   mock data layer (events.json, images, helpers) — the ONLY place screens get data
  lib/                    layout (breakpoints), store (auth/registrations), useLoading, nav helpers
assets/                   demo photos + avatars (replace with CDN URLs from the API)
```

Path aliases: `@/…` → `src/…`, `@ui` → `src/ui`.

## Conventions

- **Never hardcode colors / fonts** — use `colors`, `fonts`, `type` from `@ui`.
- Every tappable thing is `PressableScale` (spring + haptic) or a kit `Button` / `IconButton`.
- Screens use `<Screen title=… footer=…>` (floating back button, text-only title with shadow, fade under the header, sticky footer).
- **Responsive:** `useLayout().wide` (width ≥ 700 — tablets, unfolded foldables). Wide = side rail instead of bottom tabs, two-pane layouts on Detail, Checkout, Receipt, Security, Notifications.
- **Loading:** every list screen shows a skeleton that mirrors the real layout (`src/components/Skeletons.tsx`). `useLoading()` is a stand-in — swap for your query hook's `isLoading`.
- Don't define components inside a screen if they wrap a `TextInput` (it remounts and loses focus) — keep them at module level.
- Content rules from the client: Home hero max 10 events (live first); "For you" shows only *Broadcast Events* under categories; Security = change password only. Don't add sections that aren't in the prototype.

## Where to plug in the backend

| What | Where | Note |
|---|---|---|
| Events, categories, channels, orders | `src/data/index.ts` | Keep the types (`AppEvent`, `Order`…); replace the arrays/functions with API calls (React Query recommended). |
| Images | `src/data/images.ts` | Components take plain URI strings — pass CDN URLs. |
| Auth | `src/lib/store.tsx`, `src/components/Auth.tsx` | `requireAuth(reason, then)` opens Login and resumes the action after sign-in. Apple/Google: expo-apple-authentication / Google Sign-In. |
| Payments | `app/checkout/[id].tsx` → `pay()` | Stripe PaymentSheet / Apple Pay / Google Pay. Demo: Mastercard always declines. |
| Video | `app/player/[id].tsx` | Replace the main `<Image>` with your player (react-native-video, LiveKit, Agora, IVS). |
| Live chat | `app/player/[id].tsx` → demo feed `useEffect` | Replace with your socket. |
| Push / notifications | `app/notifications.tsx` | expo-notifications. |
| Copy link | `src/components/ShareSheet.tsx` | add expo-clipboard. |
| Profile photo | `app/profile.tsx` | expo-image-picker. |

## Demo shortcuts

- Promo code `XMAS20` = 20% off.
- `/player/seo?state=waiting` — waiting room · `/player/xmas?state=ended` — live ended.
- `/receipt/F4S-261103-0412?flag=refund` opens the refund sheet; `F4S-261030-0977` refunded; `F4S-261022-0315` failed.

`../react-native/` is the earlier standalone UI kit; it is now copied into `src/ui` and maintained here.
