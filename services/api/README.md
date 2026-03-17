# API Service

Backend API for lottery certification using Node.js and Express following MVC architecture.

## Scripts

- `npm install`
- `npm run dev`
- `npm test`

## Endpoints

- `POST /certify-draw` (multipart/form-data, field `file` with TXT)
- `POST /verify-draw` (JSON body with `drawHash`)
- `GET /draws`
