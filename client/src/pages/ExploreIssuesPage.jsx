import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ImpactScoreGauge from '../components/common/ImpactScoreGauge';
import {
  Search,
  Filter,
  Flame,
  Clock,
  Layers,
  MapPin,
  ArrowUpDown,
  Building,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Network
} from 'lucide-react';

export default function ExploreIssuesPage({ setRoute }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priorityScore');

  const categories = [
    'All',
    'Road Infrastructure',
    'Municipal Sanitation',
    'Water Supply & Drainage',
    'Electrical & Lighting',
    'Traffic & Transport',
    'Public Safety & Infrastructure'
  ];

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priorityLevel = priorityFilter;
      if (search) params.search = search;
      params.sortBy = sortBy;

      const data = await api.getComplaints(params);
      setComplaints(data.complaints || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, statusFilter, priorityFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'AWAITING_VERIFICATION':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ASSIGNED':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'AI_CLASSIFIED':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            PUBLIC CIVIC INTELLIGENCE
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Explore Civic Issues</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, inspect, and verify reported municipal incidents across the city.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => setRoute('/report')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-cyan-500/30 transition-all flex items-center space-x-1.5 self-start md:self-auto"
        >
          <span>Report New Issue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, location, or summary..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-400 focus:outline-none"
            >
              <option value="priorityScore">Impact Score (High to Low)</option>
              <option value="newest">Most Recent</option>
              <option value="oldest">Oldest Active</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-cyan-500 text-navy-900 font-bold shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Priority & Status Secondary Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium mr-1">Status:</span>
          {['All', 'IN_PROGRESS', 'AWAITING_VERIFICATION', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-slate-200 text-navy-900'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}

          <span className="text-slate-400 font-medium ml-4 mr-1">Urgency:</span>
          {['All', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setPriorityFilter(lvl)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                priorityFilter === lvl
                  ? 'bg-amber-400 text-navy-900 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

      </div>

      {/* Issues Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs">Fetching civic intelligence data...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800 space-y-3">
          <p className="text-base font-semibold text-slate-300">No issues found matching your filters</p>
          <button
            onClick={() => {
              setCategoryFilter('All');
              setStatusFilter('All');
              setPriorityFilter('All');
              setSearch('');
            }}
            className="text-xs text-cyan-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((item) => (
            <div
              key={item._id}
              onClick={() => setRoute(`/issues/${item._id}`)}
              className="glass-panel rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between overflow-hidden group"
            >
              {/* Image Banner if exists */}
              {item.images && item.images.length > 0 && (
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
                  
                  {/* Top Status Tags */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${getStatusBadge(item.status)}`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>

                    {item.relatedReportsCount > 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-navy-900/80 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 backdrop-blur-md flex items-center space-x-1">
                        <Network className="w-3 h-3 text-cyan-400" />
                        <span>{item.relatedReportsCount} reports clustered</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div>
                  {/* Top metadata row if no image banner */}
                  {(!item.images || item.images.length === 0) && (
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      {item.relatedReportsCount > 1 && (
                        <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                          <Network className="w-3 h-3" />
                          {item.relatedReportsCount} in cluster
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.summary || item.description}
                  </p>

                  <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                {/* Bottom Scorecard Strip */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <ImpactScoreGauge
                    score={item.priorityScore}
                    level={item.priorityLevel}
                    compact={true}
                  />

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Department</span>
                    <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px] block">
                      {item.assignedDepartment}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
