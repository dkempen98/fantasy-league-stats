# Fantasy Football Node API

This is a Node.js Express API server that handles ESPN Fantasy Football API requests for the Laravel application.

## Setup

### 1. Install Dependencies

```bash
cd node-api
npm install
```

### 2. Environment Variables

Make sure your root `.env` file contains these variables:

```env
# ESPN Fantasy Football Credentials
LEAGUE_ID=your_league_id
S2=your_espn_s2_cookie
SWID=your_swid_cookie

# Node API Configuration
NODE_API_PORT=3001
APP_URL=http://localhost:8000
```

### 3. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in NODE_API_PORT).

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Test Endpoint
```
GET /api/espn/test
```
Verifies ESPN API routes are working.

### Get Boxscore for Week
```
GET /api/espn/boxscore/:season/:week/:matchupId
```
Get raw boxscore data from ESPN for a specific week.

**Example:**
```bash
curl http://localhost:3001/api/espn/boxscore/2024/13/13
```

### Get All Matchup Data
```
POST /api/espn/matchup-data
Content-Type: application/json

{
  "season": 2024,
  "maxWeek": 13
}
```
Fetches and processes all matchup data for a season up to the specified week.

**Example:**
```bash
curl -X POST http://localhost:3001/api/espn/matchup-data \
  -H "Content-Type: application/json" \
  -d '{"season": 2024, "maxWeek": 13}'
```

### Get Week Data (Processed)
```
POST /api/espn/week-data
Content-Type: application/json

{
  "season": 2024,
  "week": 13,
  "matchupId": 13
}
```
Get processed player and team data for a specific week.

### Get League Info
```
GET /api/espn/league-info/:season
```
Get league information for a specific season.

## Laravel Integration

### Example: Calling from Laravel

In your Laravel controller or job:

```php
use Illuminate\Support\Facades\Http;

// Get boxscore for a specific week
$response = Http::get('http://localhost:3001/api/espn/boxscore/2024/13/13');

if ($response->successful()) {
    $data = $response->json();
    // Process the data...
}

// Get all matchup data
$response = Http::timeout(300)->post('http://localhost:3001/api/espn/matchup-data', [
    'season' => 2024,
    'maxWeek' => 13
]);

if ($response->successful()) {
    $data = $response->json();
    $players = $data['data']['players'];
    $teams = $data['data']['teams'];

    // Update database...
}
```

### Example: Laravel Scheduled Job

Create a scheduled job to update your database:

```bash
php artisan make:job UpdateFantasyData
```

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class UpdateFantasyData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $season,
        public int $maxWeek
    ) {}

    public function handle(): void
    {
        $response = Http::timeout(300)->post('http://localhost:3001/api/espn/matchup-data', [
            'season' => $this->season,
            'maxWeek' => $this->maxWeek
        ]);

        if ($response->successful()) {
            $data = $response->json();

            // Store players data
            foreach ($data['data']['players'] as $week => $weekPlayers) {
                foreach ($weekPlayers as $player) {
                    // Update your PlayerStat model...
                }
            }

            // Store teams data
            foreach ($data['data']['teams'] as $week => $weekTeams) {
                foreach ($weekTeams as $team) {
                    // Update your Matchup model...
                }
            }
        }
    }
}
```

## API Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "season": 2024,
    "week": 13,
    ...
  }
}
```

Error responses:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

## Architecture

- **server.js** - Main Express server setup
- **routes/espn.js** - API route definitions
- **services/espnService.js** - ESPN API business logic

## Notes

- The API automatically handles playoff week matchup ID adjustments (weeks 14-17)
- Team information is mapped in `espnService.js` - update the `getTeamInfo()` method for your league
- CORS is configured to accept requests from your Laravel app (APP_URL)
- All player and team data is processed and formatted for easy database insertion
