import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import L from 'leaflet';
import {
  Flame,
  Layers,
  Filter,
  MapPin,
  ChevronRight,
  Eye,
  Sparkles,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function CivicHeatmapPage({ setRoute }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const heatmapLayerRef = useRef(null);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Category Color Map
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Road Infrastructure': return '#f59e0b'; // Amber
      case 'Municipal Sanitation': return '#10b981'; // Emerald
      case 'Water Supply & Drainage': return '#06b6d4'; // Cyan
      case 'Electrical & Lighting': return '#eab308'; // Yellow
      case 'Traffic & Transport': return '#f43f5e'; // Rose
      case 'Public Safety & Infrastructure': return '#8b5cf6'; // Purple
      default: return '#3b82f6';
    }
  };

  // Fetch all complaints
  useEffect(() => {
    api.getComplaints({ limit: 100 })
      .then((data) => {
        setComplaints(data.complaints || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center coordinates for metro area
    const map = L.map(mapContainerRef.current, {
      center: [12.9720, 77.5950],
      zoom: 14,
      zoomControl: true,
    });

    // Dark-themed tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    heatmapLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers whenever complaints, filter, or heatmap mode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !heatmapLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    heatmapLayerRef.current.clearLayers();

    // Filter complaints
    const filtered = complaints.filter((c) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'High Priority') return c.priorityScore >= 70;
      if (activeFilter === 'Roads') return c.category === 'Road Infrastructure';
      if (activeFilter === 'Garbage') return c.category === 'Municipal Sanitation';
      if (activeFilter === 'Water') return c.category === 'Water Supply & Drainage';
      if (activeFilter === 'Lighting') return c.category === 'Electrical & Lighting';
      if (activeFilter === 'Traffic') return c.category === 'Traffic & Transport';
      return true;
    });

    filtered.forEach((issue) => {
      const lat = issue.coordinates?.lat || 12.9716;
      const lng = issue.coordinates?.lng || 77.5946;
      const color = getCategoryColor(issue.category);

      if (heatmapMode) {
        // Render Heatmap Hotspot circles with intensity based on priorityScore & cluster count
        const radius = Math.min(350, Math.max(100, (issue.priorityScore || 50) * 3.5));
        const circle = L.circle([lat, lng], {
          color: issue.priorityScore >= 85 ? '#f43f5e' : issue.priorityScore >= 70 ? '#f59e0b' : '#06b6d4',
          fillColor: issue.priorityScore >= 85 ? '#f43f5e' : issue.priorityScore >= 70 ? '#f59e0b' : '#06b6d4',
          fillOpacity: 0.35,
          radius: radius,
          weight: 1
        });
        circle.on('click', () => setSelectedIssue(issue));
        circle.addTo(heatmapLayerRef.current);
      } else {
        // Render rich SVG pin markers
        const customIcon = L.divIcon({
          className: 'custom-civic-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: ${color};
              border: 2px solid white;
              box-shadow: 0 0 15px ${color}88;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 900;
              font-size: 11px;
              cursor: pointer;
            ">
              ${issue.priorityScore || 50}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });
        marker.on('click', () => setSelectedIssue(issue));
        marker.addTo(markersLayerRef.current);
      }
    });

  }, [complaints, activeFilter, heatmapMode]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col relative overflow-hidden">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Filter Bar */}
        <div className="glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-wrap items-center gap-1.5 pointer-events-auto">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">
            Heatmap Layer:
          </span>
          {['All', 'High Priority', 'Roads', 'Garbage', 'Water', 'Lighting', 'Traffic'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-cyan-500 text-navy-900 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Right Toggle Button: Heatmap Mode */}
        <div className="glass-panel p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setHeatmapMode(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              !heatmapMode ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Pin Markers</span>
          </button>
          <button
            onClick={() => setHeatmapMode(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              heatmapMode ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hotspot Heatmap</span>
          </button>
        </div>

      </div>

      {/* Main Map Canvas */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full z-10"></div>

      {/* Bottom Floating Issue Preview Drawer */}
      {selectedIssue && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-20 glass-panel-glow p-5 rounded-3xl border border-cyan-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                {selectedIssue.category}
              </span>
              <h4 className="text-sm font-extrabold text-white mt-0.5 line-clamp-1">
                {selectedIssue.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedIssue(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2 line-clamp-2">
            {selectedIssue.summary || selectedIssue.description}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 block">Civic Impact</span>
              <span className="font-black text-amber-400 text-sm">
                {selectedIssue.priorityScore} / 100
              </span>
            </div>

            <button
              onClick={() => setRoute(`/issues/${selectedIssue._id}`)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-900 font-bold text-xs shadow-md transition-all flex items-center space-x-1"
            >
              <span>Inspect Intelligence</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute bottom-4 left-4 z-20 glass-panel p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-300 hidden md:block">
        <span className="font-bold text-white block mb-1.5">Color Indicators</span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Roads</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Garbage</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span><span>Water & Drain</span></div>
          <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span><span>Lighting</span></div>
        </div>
      </div>

    </div>
  );
}
