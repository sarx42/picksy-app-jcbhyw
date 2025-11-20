
# Picksy Setup Instructions

Welcome to **Picksy** - your tiny movie night assistant! 🎬

## Getting Your TMDB API Key

To use Picksy, you need a free API key from The Movie Database (TMDB):

1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Create a free account (or log in if you already have one)
3. Go to your account settings
4. Navigate to the "API" section
5. Request an API key (choose "Developer" option)
6. Fill out the form (you can use "Personal/Educational" as the type)
7. Copy your API key

## Setting Up Your API Key

### Option 1: Using app.json (Recommended for Expo Go)

1. Open `app.json`
2. Find the `extra` section
3. Replace the empty `TMDB_API_KEY` value with your actual API key:

```json
"extra": {
  "TMDB_API_KEY": "your_actual_api_key_here"
}
```

### Option 2: Using Environment Variables (For Production)

1. Create a `.env` file in the root directory
2. Add your API key:

```
TMDB_API_KEY=your_actual_api_key_here
```

3. Install expo-constants if not already installed
4. The app will automatically read from the environment variable

## Running the App

After setting up your API key:

```bash
npm run dev
```

Then scan the QR code with Expo Go on your phone, or press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

## Features

- **Discover Tab**: Find movies based on your mood, group type, and preferences
- **My Picks Tab**: Save and manage your favorite movie picks
- **Settings Tab**: Customize your default preferences

## Tips

- Swipe left to skip a movie
- Swipe right to save a movie to your picks
- Tap "Play this one" to get a fun snack suggestion! 🍿

Enjoy your movie nights! 🎉
