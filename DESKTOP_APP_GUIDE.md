# Pixel Pomodoro Desktop App Guide

## What Changed? ✨

### 1. Desktop Window (No Browser!)
- Your app now opens as a **native desktop application**
- Window size: 632x632px (perfectly fits your 600x600px app)
- **Transparent background** - no more dark slate background outside the borders!
- Window is **non-resizable** to keep the perfect square shape
- Menu bar is auto-hidden for a clean look

### 2. Music Player (Real Audio!) 🎵
- **5 placeholder audio tracks** are now in `/public/music/`
- Press Play and music will actually play!
- Features:
  - ✅ Working play/pause controls
  - ✅ Skip forward/backward
  - ✅ Shuffle mode
  - ✅ Repeat mode
  - ✅ Volume control (click the bar to adjust)
  - ✅ Progress bar (click to seek)
  - ✅ Real-time duration display

## Running the App

### Development Mode (Current)
```bash
npm run electron:dev
```
This is what's running now! Opens the app window with hot-reload enabled.

### Build for Distribution
To create a standalone app you can share:

**macOS:**
```bash
npm run electron:build:mac
```
Creates a `.dmg` installer in the `release` folder

**Windows:**
```bash
npm run electron:build:win
```

**Linux:**
```bash
npm run electron:build:linux
```

## Adding Your Own Music 🎶

### Option 1: Replace Existing Files
Simply replace the files in `/public/music/` with your own:
- Keep the same filenames
- Use MP3 format (recommended)
- The app will automatically use your music!

### Option 2: Add New Tracks
1. Add your `.mp3` files to `/public/music/`
2. Edit `/src/app/components/MusicPlayer.tsx`
3. Find the `mockTracks` array (line ~22)
4. Add your track:

```typescript
{
  id: 6,
  title: 'My Chill Beat',
  artist: 'My Name',
  duration: '4:30',
  color: 'from-blue-300 to-indigo-400',  // Any Tailwind gradient!
  file: '/music/my-chill-beat.mp3'
}
```

## File Locations

- **Electron config**: `/electron/main.ts`
- **Music files**: `/public/music/`
- **Music player**: `/src/app/components/MusicPlayer.tsx`
- **Main app**: `/src/app/App.tsx`

## Current Audio Files

All are silent placeholders - perfect for replacing with your favorite study music!

1. 🌸 Cherry Blossom (3:24)
2. 🍓 Strawberry Dream (4:12)
3. 🍬 Cotton Candy (3:45)
4. 🍑 Peach Paradise (5:01)
5. 💗 Bubblegum Pop (3:33)

## Window Features

- **Transparent**: No background outside your app borders
- **Fixed size**: Matches your app dimensions perfectly
- **Frameless look**: Menu bar hidden
- **Always on top**: (can be enabled in `electron/main.ts`)

## Recommended Music Sources

Free music for your Pomodoro timer:
- [YouTube Audio Library](https://studio.youtube.com/channel/UCuPSL9vH1S11tKFhsSiGkaw/music)
- [Free Music Archive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/)
- [Bensound](https://www.bensound.com/)
- [Lofi Girl](https://lofigirl.com/) - Perfect for focus sessions!

## Tips

- 🎧 Lofi, ambient, or nature sounds work great for Pomodoro sessions
- 📁 Keep music files under 10MB for better performance
- 🔊 The app remembers your volume and track settings
- 🎨 Match track colors to the vibe of each song!

Enjoy your pixel-perfect focus companion! 🌟
