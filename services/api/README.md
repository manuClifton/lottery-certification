# API Service

Backend API for lottery certification using Node.js and Express following MVC architecture.

## Scripts

- `npm install`
- `npm run dev`
- `npm test`

## Endpoints

- `POST /auth/login` (JSON body with `username` and `password`) - public
- `POST /verify-draw` (JSON body with `drawHash`) - public
- `POST /certify-draw` (multipart/form-data, field `file` with TXT) - private (Bearer token)
- `GET /draws` - private (Bearer token)

## Environment

Create `services/api/.env` using `services/api/.env.example`.
