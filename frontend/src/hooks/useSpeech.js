import { useState } from 'react';

export function useSpeech(onResult) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice not supported in this browser. Try Chrome!');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => window.speechSynthesis.cancel();

  return { listening, startListening, speak, stopSpeaking };
}
