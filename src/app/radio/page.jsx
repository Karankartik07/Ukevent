'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopFooter from '@/components/DesktopFooter';
import { Radio as RadioIcon, Play, Pause, Volume2, Sparkles, Music } from 'lucide-react';

const STATIONS = [
  {
    id: 1,
    name: 'MeraIndia UK 24/7 Live',
    genre: 'Bollywood Hits & UK Bhangra',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    desc: 'Non-stop latest chartbusters, throwback classics, and London diaspora news.',
  },
  {
    id: 2,
    name: 'Sufi & Ghazal Sanctuary',
    genre: 'Sufi, Ghazals & Semi-Classical',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    desc: 'Soulful melodies from Nusrat Fateh Ali Khan, Jagjit Singh, and Rahat Fateh Ali Khan.',
  },
  {
    id: 3,
    name: 'Punjabi Beats UK',
    genre: 'Bhangra, Desi Hip Hop & Dhol',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    desc: 'High energy beats straight from Birmingham and West London sound systems.',
  },
];

export default function RadioPage() {
  const [playingStationId, setPlayingStationId] = useState(null);

  const toggleStation = (id) => {
    if (playingStationId === id) {
      setPlayingStationId(null);
    } else {
      setPlayingStationId(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 pb-16 md:pb-0">
      <Header />

      <div className="bg-[#240727] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-purple-900/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-amber-400 p-[2px] shadow-xl mb-4">
            <div className="w-full h-full bg-[#240727] rounded-[14px] flex items-center justify-center">
              <RadioIcon className="w-8 h-8 text-pink-400 animate-pulse" />
            </div>
          </div>
          <span className="text-pink-400 font-bold text-xs uppercase tracking-wider mb-1">
            Broadcast Stream
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            South Asian Radio UK
          </h1>
          <p className="text-stone-300 text-sm mt-2 max-w-lg">
            Tune in to live UK diaspora radio stations streaming 24/7 Bollywood melodies, Sufi music, British-Asian hits, and talk shows.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-4">
        {STATIONS.map((station) => {
          const isPlaying = playingStationId === station.id;

          return (
            <div
              key={station.id}
              className={`p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between shadow-sm ${
                isPlaying
                  ? 'bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border-pink-400 shadow-md ring-2 ring-pink-500/20'
                  : 'bg-white border-stone-200/80 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleStation(station.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                    isPlaying
                      ? 'bg-pink-600 text-white animate-pulse'
                      : 'bg-[#240727] text-white hover:bg-pink-600'
                  }`}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-stone-900">{station.name}</h3>
                    {isPlaying && (
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-pink-600 mt-0.5">{station.genre}</p>
                  <p className="text-xs text-stone-500 mt-1 max-w-md">{station.desc}</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center space-x-2 text-stone-400">
                <Volume2 className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </main>

      <DesktopFooter />
      <BottomNav />
    </div>
  );
}
