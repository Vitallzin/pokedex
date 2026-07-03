# Firebase setup

Use Firebase Authentication for passwords and Google login. Do not store user passwords in Firestore.

## Authentication

Enable these providers in Firebase Console:

- Email/Password
- Google

Add your local and production domains in Authentication > Settings > Authorized domains.

## Firestore collection

Collection: `users`

Document id: the Firebase Auth user UID.

Fields:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `uid` | string | yes | Same value as the document id. |
| `email` | string | yes | Comes from Firebase Auth. |
| `displayName` | string | yes | Uses Google name or email prefix by default. |
| `photoURL` | string | no | Google photo or generated avatar. |
| `providerIds` | array<string> | yes | Example: `["password"]` or `["google.com"]`. |
| `createdAt` | timestamp | yes | Server timestamp. |
| `updatedAt` | timestamp | yes | Server timestamp. |

Firestore security rules are in `firestore.rules`.

## Favorites

Document: `users/{uid}/favorites/current`

Fields:

| Field | Type | Limit |
| --- | --- | --- |
| `items` | array<Pokemon> | up to 100 |
| `updatedAt` | timestamp | server timestamp |

## Teams

Document: `users/{uid}/teams/current`

Fields:

| Field | Type | Limit |
| --- | --- | --- |
| `items` | array<Team> | up to 10 teams |
| `updatedAt` | timestamp | server timestamp |

Each team keeps up to 6 Pokémon in the app.


## Environment variables

Copy `.env.example` to `.env.local` and fill it with the Firebase web app config from Project settings > General > Your apps.
