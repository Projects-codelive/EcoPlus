import React, { useEffect, useRef } from 'react';

// Using a placeholder URL since no audio file was found in assets.
// Replace this with: import bgMusic from '../assets/your-music-file.mp3';
const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112721.mp3";

export const BackgroundMusic: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Attempt to play on mount
        const playMusic = async () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.3; // Low volume
                try {
                    await audioRef.current.play();
                } catch (err) {
                    console.log("Autoplay blocked, waiting for user interaction");
                }
            }
        };
        playMusic();

        // Add listener for first interaction to unblock audio context
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(e => console.log('Playback failed:', e));
                // Remove listener once played
                // document.removeEventListener('click', handleInteraction); // Optional: keep it if we want to ensure it resumes
            }
        };

        document.addEventListener('click', handleInteraction);
        return () => document.removeEventListener('click', handleInteraction);
    }, []);

    return (
        <audio
            ref={audioRef}
            src={MUSIC_URL}
            loop
            crossOrigin="anonymous"
        />
    );
};
