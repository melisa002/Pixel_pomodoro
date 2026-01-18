# Music Files

This folder contains the music tracks for the Pixel Pomodoro music player.

## Current Placeholder Files

The current files are silent audio placeholders created for testing:
- `cherry-blossom.mp3` (3:24)
- `strawberry-dream.mp3` (4:12)
- `cotton-candy.mp3` (3:45)
- `peach-paradise.mp3` (5:01)
- `bubblegum-pop.mp3` (3:33)

## How to Add Your Own Music

To replace these with your own music:

1. **Replace the files** - Simply replace the existing `.mp3` files with your own music files. Make sure to keep the same filenames!

2. **Or add new tracks**:
   - Add your `.mp3` files to this folder
   - Update the track list in `/src/app/components/MusicPlayer.tsx`
   - Find the `mockTracks` array and add your new tracks:

```typescript
const mockTracks: Track[] = [
  {
    id: 6,
    title: 'Your Song',
    artist: 'Your Artist',
    duration: '3:45',
    color: 'from-blue-300 to-purple-400',
    file: '/music/your-song.mp3'
  },
  // ... more tracks
];
```

## File Format

- Format: MP3 (recommended)
- Other formats like `.ogg`, `.wav`, `.m4a` should also work with most browsers

## Tips

- Keep file sizes reasonable for faster loading
- Lofi, chill beats, or study music work great for a Pomodoro timer!
- You can find royalty-free music on sites like:
  - YouTube Audio Library
  - Free Music Archive
  - Incompetech
  - Bensound
