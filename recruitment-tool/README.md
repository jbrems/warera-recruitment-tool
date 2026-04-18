# Warera User Growth Analytics

A mobile-first Next.js application for visualizing new user signups from the Warera API with interactive charts.

## Features

- **Daily & Hourly Views**: Toggle between aggregated daily data and detailed hourly breakdown
- **30-Day Window**: Shows the last 31 days of data by default
- **Time Navigation**: Move backwards and forwards through time periods
- **Interactive Chart**: Built with Recharts for smooth interaction and data visualization
- **Mobile-First Design**: Fully responsive UI optimized for mobile devices
- **Server-Side Caching**: 15-minute cache on the backend to minimize API calls
- **API Integration**: Fetches data from the Warera getUsersByCountry endpoint

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

## How It Works

1. **Data Fetching**: On page load, the client makes a request to `/api/users`
2. **Backend API Route**: Next.js API route fetches all users from Warera with pagination
3. **Server Caching**: Users are cached for 15 minutes to reduce API calls
4. **Data Processing**: Users are grouped by creation date (daily) or hour (hourly)
5. **Visualization**: A Recharts line chart displays the number of new users per period
6. **Navigation**: Use buttons to move through different time periods
7. **View Switching**: Toggle between daily and hourly views

## Project Structure

```
app/
├── api/
│   └── users/
│       └── route.js           # API endpoint for fetching users
├── page.js                    # Home page with Suspense
├── layout.js                  # Root layout
└── globals.css                # Global styles
components/
└── UserAnalytics.js           # Main analytics component (Client Component)
lib/
├── warera-api.js              # Warera API integration with pagination & caching
└── data-processing.js         # Data grouping and time navigation logic
```

## Technologies Used

- **Next.js 14**: React framework with built-in API routes
- **React 18**: UI library
- **Recharts**: Interactive charting library
- **Tailwind CSS**: Utility-first CSS framework
- **date-fns**: Date manipulation library
- **Axios**: HTTP client

## API Routes

### GET /api/users

Fetches all users from Belgium with 15-minute caching.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "createdAt": "2026-04-03T14:40:22.780Z"
    },
    ...
  ]
}
```

## Key Features Explained

### Daily View (Default)
Shows the count of new users per day for the last 31 days. Perfect for tracking trends over a month.

### Hourly View
Zooms into a 24-hour period to show granular, hour-by-hour user signup patterns.

### Time Navigation
- **Previous**: Go back 31 days
- **Next**: Advance 31 days (capped at today)
- **Today**: Reset to the latest period

### Server-Side Caching
The API route implements a 15-minute cache to avoid repeated calls to the Warera API. The cache is maintained in memory and automatically refreshes after expiration.

## Environment

Currently configured for Belgium (Country ID: 6813b6d446e731854c7ac7a4).

To change the country, update the `COUNTRY_ID` in [lib/warera-api.js](lib/warera-api.js).
