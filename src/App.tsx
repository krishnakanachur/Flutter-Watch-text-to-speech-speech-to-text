/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Clock, 
  MessageSquare, 
  Play, 
  RotateCcw,
  Wifi,
  Battery
} from 'lucide-react';

// Types for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textToSpeak, setTextToSpeak] = useState('Welcome to Vocalis. How may I assist you today?');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'stt' | 'tts'>('home');
  const [currentTime, setCurrentTime] = useState(new Date());

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]">
      {/* Decorative Radial Glow */}
      <div className="absolute w-[800px] h-[800px] glow-bg opacity-30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Watch Simulator */}
      <div className="relative z-10 flex items-center justify-center">
        
        {/* Contextual Labels Left */}
        <div className="absolute left-[-260px] top-[100px] w-56 text-right hidden xl:block">
          <h2 className="font-serif text-[#D4AF37] text-xl mb-1 italic">Vocalis OS</h2>
          <p className="text-[10px] text-[#8e8271] leading-relaxed uppercase tracking-[0.2em] font-medium">
            Optimized for luxury wearable hardware
          </p>
        </div>

        {/* Watch Chassis */}
        <div className="relative w-[380px] h-[380px] rounded-[110px] bg-[#0c0c0c] border-[12px] border-[#1a1a1a] shadow-[0_0_100px_rgba(0,0,0,1)] flex items-center justify-center p-8 overflow-hidden group">
          
          {/* Hardware Crown Details */}
          <div className="absolute -right-1 top-1/2 -translate-y-8 w-4 h-16 bg-[#1a1a1a] rounded-r-lg border-y border-r border-[#2a2a2a]" />

          {/* Watch Face / Display */}
          <div className="w-full h-full bg-black rounded-[80px] relative flex flex-col items-center p-6 border border-[#1a1a1a]">
            
            {/* Top Bar */}
            <div className="w-full flex justify-between items-center text-[10px] font-medium tracking-[0.15em] text-[#8e8271] uppercase mb-6 px-2">
              <span>{formatTime(currentTime)}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-2 border border-[#8e8271] rounded-[1px] relative">
                  <div className="absolute left-0 top-0 h-full w-3/4 bg-[#8e8271]"></div>
                </div>
              </div>
            </div>

            {/* Central Content */}
            <div className="flex-1 w-full flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                  <motion.div 
                    key="home"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <h1 className="font-serif text-3xl italic text-[#D4AF37]">Vocalis</h1>
                    <div className="space-y-1">
                      <p className="text-[10px] text-[#8e8271] uppercase tracking-widest font-semibold">Voice Assistant</p>
                      <div className="flex justify-center gap-1 opacity-20">
                        {[1, 2, 3, 2, 1].map((h, i) => (
                          <div key={i} className="w-0.5 bg-[#D4AF37]" style={{ height: h * 4 }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'stt' && (
                  <motion.div 
                    key="stt"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full h-full flex flex-col items-center"
                  >
                    <p className={`font-serif text-[18px] leading-snug line-clamp-4 ${transcript ? 'text-white' : 'text-[#8e8271] italic text-sm'}`}>
                      {transcript || '“Listening for your command...”'}
                    </p>
                    
                    {isListening && (
                      <div className="mt-4 flex justify-center items-end gap-1.5 h-10">
                        <div className="w-1 bg-[#D4AF37] animate-voice-1 rounded-full"></div>
                        <div className="w-1 bg-[#D4AF37] animate-voice-2 rounded-full"></div>
                        <div className="w-1 bg-[#D4AF37] animate-voice-3 rounded-full"></div>
                        <div className="w-1 bg-[#D4AF37] animate-voice-2 rounded-full"></div>
                        <div className="w-1 bg-[#D4AF37] animate-voice-1 rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'tts' && (
                  <motion.div 
                    key="tts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full h-full flex flex-col items-center"
                  >
                    <div className="flex-1 w-full bg-[#1a1712]/50 rounded-2xl p-3 border border-[#D4AF37]/10 mb-4">
                      <textarea 
                        value={textToSpeak}
                        onChange={(e) => setTextToSpeak(e.target.value)}
                        className="w-full h-full bg-transparent text-sm text-[#e0d8d0] font-serif italic focus:outline-none resize-none scroll-hide"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="w-full flex justify-around items-center pt-4">
              <button 
                onClick={() => activeTab === 'stt' ? toggleListening() : setActiveTab('stt')}
                className="flex flex-col items-center gap-1 group/btn"
              >
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  activeTab === 'stt' 
                    ? 'border-[#D4AF37] bg-[#1a1712] text-[#D4AF37]' 
                    : 'border-[#333] text-[#444] hover:border-[#8e8271] hover:text-[#8e8271]'
                }`}>
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </div>
                <span className={`text-[8px] uppercase font-bold tracking-tighter ${activeTab === 'stt' ? 'text-[#8e8271]' : 'text-[#333]'}`}>
                  {isListening ? 'Stop' : 'Listen'}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('home')}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-10 h-10 rounded-full border border-dashed flex items-center justify-center transition-all ${
                  activeTab === 'home' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#333] text-[#333]'
                }`}>
                  <RotateCcw className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={() => activeTab === 'tts' ? (isSpeaking ? window.speechSynthesis.cancel() : handleSpeak()) : setActiveTab('tts')}
                className="flex flex-col items-center gap-1 group/btn"
              >
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  activeTab === 'tts' 
                    ? 'border-[#D4AF37] bg-[#1a1712] text-[#D4AF37]' 
                    : 'border-[#333] text-[#444] hover:border-[#8e8271] hover:text-[#8e8271]'
                }`}>
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </div>
                <span className={`text-[8px] uppercase font-bold tracking-tighter ${activeTab === 'tts' ? 'text-[#8e8271]' : 'text-[#333]'}`}>
                  {isSpeaking ? 'Cancel' : 'Speak'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Contextual Labels Right */}
        <div className="absolute right-[-260px] bottom-[100px] w-56 text-left hidden xl:block">
          <h2 className="font-serif text-[#D4AF37] text-xl mb-1 italic">Neural Engine</h2>
          <p className="text-[10px] text-[#8e8271] leading-relaxed uppercase tracking-[0.2em] font-medium">
            Natural prosody & multi-lingual synthesis
          </p>
        </div>
      </div>

      {/* Floating Branding Branding */}
      <div className="fixed bottom-8 right-12 flex flex-col items-end opacity-20 pointer-events-none select-none">
        <span className="text-5xl font-serif italic text-white tracking-tight">Vocalis</span>
        <span className="text-[9px] tracking-[0.5em] uppercase text-[#D4AF37] font-bold">Luxury Tech Interface</span>
      </div>
    </div>
  );
}
