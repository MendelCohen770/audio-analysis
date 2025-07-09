import React, { useRef, useState } from 'react'
import './App.css'
import axios from 'axios';
import InsightBox from './components/InsightBox';
import { SpeechRecognitionEvent} from './utils/types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function App() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showInsight, setShowInsight] = useState(false);
  const [listening, setListening] = useState(false);
  const shouldStopRef = useRef(false);
  const recognitionRef = useRef<typeof SpeechRecognition | null>(null);

  const startListening = () => {
    shouldStopRef.current = false;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "he-IL";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1][0].transcript;
      setTranscript(lastResult);
      const isFinal = event.results[event.results.length - 1].isFinal;
      if (isFinal) {
        analyzeText(lastResult);
      }
    }
    recognition.onend = () => {
      if (!shouldStopRef.current) {
        recognition.start();
      }
    }
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    shouldStopRef.current = true;
    recognitionRef.current && recognitionRef.current.stop();
    setListening(false);
  }

  const analyzeText = async (text: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/chat', { text });
      setAnalysis(response.data.response);
      setShowInsight(true);
      setTimeout(() => {
        setShowInsight(false);
      }, 10000);
    } catch (error) {
      setAnalysis('שגיאה בניתוח');
      setShowInsight(true);
      setTimeout(() => {
        setShowInsight(false);
      }, 10000);
    }
  }

  return (
    <>
      <div style={{ padding: 50, textAlign: "center" }}>
        <h1>ניתוח בזמן אמת</h1>
        {!listening ? (
          <button onClick={startListening}>הפעל מיקרופון</button>
        ) : (
          <button onClick={stopListening}>עצור מיקרופון</button>
        )}
        <div style={{ marginTop: 30 }}>
          <strong>מה ששמעתי:</strong> {transcript}
        </div>
        <InsightBox text={analysis} visible={showInsight} />
      </div>
    </>
  )
}

export default App
