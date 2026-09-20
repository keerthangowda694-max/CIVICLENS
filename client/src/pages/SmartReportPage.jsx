import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  MicOff,
  Upload,
  Image as ImageIcon,
  MapPin,
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';

export default function SmartReportPage({ setRoute }) {
  const { user, refreshUser } = useAuth();

  const [reportText, setReportText] = useState('');
  const [locationText, setLocationText] = useState('College Gate, North Blvd');
  const [coords, setCoords] = useState({ lat: 12.9734, lng: 77.5962 });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Voice Input (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Real-time AI preview
  const [aiPreview, setAiPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check speech recognition support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Live AI extraction as user enters text or location
  useEffect(() => {
    const timer = setTimeout(() => {
      if (reportText.trim().length >= 6) {
        performAiPreview(reportText, locationText);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [reportText, locationText]);

  const performAiPreview = async (text, loc) => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('location', loc);
      if (images[0]) {
        formData.append('image', images[0]);
      }
      const preview = await api.previewAI(formData);
      setAiPreview(preview);
    } catch (err) {
      console.warn('AI preview error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleSpeech = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please type your observation.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setReportText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(files);
      const urls = files.map((f) => URL.createObjectURL(f));
      setImagePreviews(urls);
      // Trigger AI vision preview
      if (reportText) {
        performAiPreview(reportText, locationText);
      }
    }
  };

  const handleSampleFill = () => {
    setReportText('There is a huge pothole outside the college gate and vehicles are suddenly braking.');
    setLocationText('College Gate, North Blvd');
    setCoords({ lat: 12.9734, lng: 77.5962 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) {
      setError('Please tell Civic Lens what you see.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', aiPreview?.detectedIssue || 'Civic Infrastructure Concern');
      formData.append('description', reportText);
      formData.append('location', locationText);
      formData.append('lat', coords.lat);
      formData.append('lng', coords.lng);

      images.forEach((img) => {
        formData.append('images', img);
      });

      const result = await api.createComplaint(formData);
      await refreshUser();
      
      // Redirect straight to newly created issue intelligence page
      setRoute(`/issues/${result.complaint._id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit civic report');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ZERO-EFFORT CITIZEN REPORTING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Tell Civic Lens What You See
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Type or dictate naturally. Our AI extracts category, department routing, severity, and estimates public impact automatically.
        </p>

        {/* Quick Demo Pre-fill Button */}
        <button
          onClick={handleSampleFill}
          className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors inline-flex items-center space-x-1.5"
        >
          <span>Load Live Demo Scenario (College Gate Pothole)</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Natural Input Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-5">
            
            {/* Natural Observation Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <span>Describe the Observation</span>
                  <span className="text-rose-400">*</span>
                </label>
                
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-slate-800 text-cyan-400 border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                required
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Example: There is a huge pothole outside the college gate and vehicles are suddenly braking..."
                className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Photo Upload & Vision */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Photo Evidence (Enables AI Computer Vision)
              </label>

              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-4 text-center transition-colors bg-slate-900/40">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="photo-upload" className="cursor-pointer block">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-300">
                      Click to upload photos or drag & drop
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Supports JPG, PNG, WEBP (AI auto-inspects road cracks, garbage, light outages)
                    </p>
                  </div>
                </label>
              </div>

              {/* Uploaded Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imagePreviews.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-cyan-500/40">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImages(images.filter((_, i) => i !== idx));
                          setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-navy-900/80 text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location & Coordinates */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Incident Location / Landmark
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. College Gate, 5th Main Avenue..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                        () => alert('Location permission denied. Using default metropolitan coordinates.')
                      );
                    }
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  Use My Current GPS
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-black text-base shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Processing AI Intelligence Pipeline...</span>
                </>
              ) : (
                <>
                  <span>Submit to Civic Intelligence Core</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center">
              Submission automatically checks for duplicate clusters & awards +10 Contributor Points.
            </p>

          </form>
        </div>

        {/* Right Column: Real-Time AI Understanding Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel-glow p-6 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-4 sticky top-24">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Live AI Understanding</h3>
                  <p className="text-[10px] text-cyan-400">
                    {aiPreview?.isFallback ? 'Civic Lens Fallback Intelligence' : 'Gemini Vision & NLP Model'}
                  </p>
                </div>
              </div>

              {analyzing ? (
                <span className="text-xs text-cyan-400 flex items-center gap-1 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing...
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  REAL-TIME
                </span>
              )}
            </div>

            {aiPreview ? (
              <div className="space-y-4 text-xs animate-in fade-in duration-300">
                
                {/* Detected Issue */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Detected Issue</span>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {aiPreview.detectedIssue}
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-cyan-400 font-semibold">AI Confidence: {aiPreview.confidence}%</span>
                  </div>
                </div>

                {/* Classification Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                    <p className="font-bold text-white mt-0.5 truncate">{aiPreview.category}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Department</span>
                    <p className="font-bold text-cyan-300 mt-0.5 truncate">{aiPreview.department}</p>
                  </div>
                </div>

                {/* Severity & Impact Score Preview */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Severity Level</span>
                    <p className="font-black text-amber-400 mt-0.5 text-sm">{aiPreview.severity}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Impact</span>
                    <p className="font-black text-white mt-0.5 text-sm">
                      {aiPreview.priorityScore} / 100
                    </p>
                  </div>
                </div>

                {/* Risk Hazard */}
                {aiPreview.possibleRisk && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-400">
                      Identified Urban Risk:
                    </span>
                    <p className="mt-1 leading-relaxed">{aiPreview.possibleRisk}</p>
                  </div>
                )}

                {/* AI Executive Summary */}
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    AI Synthetic Summary:
                  </span>
                  <p className="mt-1 italic leading-relaxed">"{aiPreview.summary}"</p>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Bot className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
                <p className="text-xs font-medium">
                  Start typing or speaking your observation. AI extraction details will automatically appear here!
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
