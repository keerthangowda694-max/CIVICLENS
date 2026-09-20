import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImpactScoreGauge from '../components/common/ImpactScoreGauge';
import BeforeAfterSlider from '../components/common/BeforeAfterSlider';
import WhyExplanationModal from '../components/common/WhyExplanationModal';
import IssueClusterCard from '../components/common/IssueClusterCard';
import EmergencyBanner from '../components/common/EmergencyBanner';
import {
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Zap,
  Network,
  Wrench,
  ShieldCheck,
  Award,
  Upload,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  FileCheck,
  Send,
  Camera
} from 'lucide-react';

export default function IssueDetailPage({ issueId, setRoute }) {
  const { user, refreshUser } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [relatedReports, setRelatedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals & form state
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  
  // Citizen verification form state
  const [verifyChoice, setVerifyChoice] = useState('RESOLVED');
  const [verifyComment, setVerifyComment] = useState('');
  const [verifyImage, setVerifyImage] = useState(null);
  const [submittingVerify, setSubmittingVerify] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState('');

  // Authority Admin controls
  const [adminStatus, setAdminStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminResolutionImage, setAdminResolutionImage] = useState(null);
  const [adminDept, setAdminDept] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getComplaintById(issueId);
      setComplaint(data.complaint);
      setTimeline(data.timeline || []);
      setVerifications(data.verifications || []);
      setRelatedReports(data.relatedReports || []);
      setAdminStatus(data.complaint.status);
      setAdminDept(data.complaint.assignedDepartment);
    } catch (err) {
      setError(err.message || 'Error loading issue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (issueId) {
      fetchDetails();
    }
  }, [issueId]);

  // Citizen verification submission
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setSubmittingVerify(true);
    setVerifySuccess('');
    try {
      const formData = new FormData();
      formData.append('result', verifyChoice);
      formData.append('comment', verifyComment);
      if (verifyImage) {
        formData.append('image', verifyImage);
      }

      const res = await api.submitVerification(complaint._id, formData);
      setVerifySuccess('Verification submitted! +5 Contributor Points awarded.');
      setVerifyComment('');
      setVerifyImage(null);
      await refreshUser();
      await fetchDetails();
    } catch (err) {
      alert(err.message || 'Failed to submit verification');
    } finally {
      setSubmittingVerify(false);
    }
  };

  // Authority status transition
  const handleAdminStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);
    try {
      const formData = new FormData();
      formData.append('status', adminStatus);
      formData.append('resolutionNotes', adminNotes);
      if (adminResolutionImage) {
        formData.append('resolutionImage', adminResolutionImage);
      }

      await api.updateStatus(complaint._id, formData);
      if (adminDept !== complaint.assignedDepartment) {
        await api.updateDepartment(complaint._id, { assignedDepartment: adminDept });
      }

      alert(`Issue updated to ${adminStatus}!`);
      setAdminNotes('');
      setAdminResolutionImage(null);
      await fetchDetails();
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 space-y-2 max-w-7xl mx-auto">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-medium">Assembling Civic Intelligence Core...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Issue Not Found</h3>
        <p className="text-xs text-slate-400">{error || 'Could not retrieve incident details'}</p>
        <button
          onClick={() => setRoute('/issues')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 font-semibold text-xs"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const isAuthority = user?.role === 'authority' || user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back button & Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setRoute('/issues')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-cyan-400 uppercase tracking-wider">
                CIVIC ISSUE #{complaint._id.slice(-4).toUpperCase()}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{complaint.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              {complaint.title}
            </h1>
          </div>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-800 border border-slate-700 text-white">
            {complaint.status.replace(/_/g, ' ')}
          </span>
          <button
            onClick={() => setWhyModalOpen(true)}
            className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why this score?</span>
          </button>
        </div>
      </div>

      {/* Emergency Escalation Banner if Score >= 88 */}
      <EmergencyBanner
        score={complaint.priorityScore}
        issueTitle={complaint.title}
      />

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Visual Proof, Details, Before/After, Timeline, Citizen Verification */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Before/After Slider Proof (If resolution proof exists) */}
          {(complaint.resolutionProof?.image || complaint.status === 'RESOLVED' || complaint.status === 'AWAITING_VERIFICATION') && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Ground-Truth Resolution Verification
              </h3>
              <BeforeAfterSlider
                beforeImage={complaint.images?.[0]}
                afterImage={complaint.resolutionProof?.image}
                isVerified={complaint.status === 'RESOLVED'}
                verifiedVotes={complaint.verificationSummary?.resolvedVotes || 0}
                resolvedAt={complaint.resolutionProof?.resolvedAt}
                notes={complaint.resolutionProof?.notes}
              />
            </div>
          )}

          {/* Original Citizen Photo & Description Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Citizen Observation Record
            </h3>
            
            <p className="text-sm text-slate-200 leading-relaxed">
              {complaint.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{complaint.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Reported on {new Date(complaint.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* AI Auto Summary & Risks */}
            {complaint.summary && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 text-xs space-y-1.5">
                <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> AI Synthetic Summary
                </span>
                <p className="text-slate-300 italic leading-relaxed">
                  "{complaint.summary}"
                </p>
                {complaint.aiAnalysis?.possibleRisk && (
                  <p className="text-amber-300 pt-1">
                    <strong>Hazard Risk:</strong> {complaint.aiAnalysis.possibleRisk}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Feature 4: Issue Cluster View (If linked) */}
          {complaint.duplicateGroupId && (
            <IssueClusterCard
              clusterTitle={complaint.duplicateGroupId.title || 'Main Road Pothole Cluster'}
              reportCount={complaint.relatedReportsCount || 8}
              similarityScore={complaint.duplicateGroupId.similarityScore || 89}
              category={complaint.category}
              location={complaint.location}
              relatedReports={relatedReports}
            />
          )}

          {/* Feature 8: Visual Civic Issue Timeline */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-white">Civic Issue Audit Timeline</h3>
              </div>
              <span className="text-[11px] text-slate-400">Step-by-step progress tracking</span>
            </div>

            {/* Vertical Timeline Stepper */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
              {timeline.map((item, idx) => (
                <div key={item._id || idx} className="relative group">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center text-xs shadow-lg group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>

                  <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-white">{item.stageTitle || item.status}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {item.comment}
                    </p>

                    <div className="pt-2 text-[10px] text-cyan-400 font-medium">
                      Source: {item.updaterName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 9: Citizen Verification Voting Card */}
          <div className="glass-panel-glow p-6 rounded-3xl border border-cyan-500/40 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Citizen Verification Loop</h3>
                  <p className="text-xs text-slate-400">Is this issue actually resolved on the ground?</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                +5 Civic Points
              </span>
            </div>

            {verifySuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                ✓ {verifySuccess}
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <label className="block text-xs font-bold text-slate-300">
                Cast Ground-Truth Confirmation:
              </label>

              {/* 3 Verification Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setVerifyChoice('RESOLVED')}
                  className={`p-3 rounded-2xl border text-left font-bold text-xs transition-all ${
                    verifyChoice === 'RESOLVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm mb-1">✓ Yes, Resolved</div>
                  <div className="text-[10px] font-normal opacity-80">Work fully completed as inspected.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setVerifyChoice('PARTIALLY_RESOLVED')}
                  className={`p-3 rounded-2xl border text-left font-bold text-xs transition-all ${
                    verifyChoice === 'PARTIALLY_RESOLVED'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm mb-1">⚠ Partially Resolved</div>
                  <div className="text-[10px] font-normal opacity-80">Some progress, but debris/hazard remains.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setVerifyChoice('STILL_EXISTS')}
                  className={`p-3 rounded-2xl border text-left font-bold text-xs transition-all ${
                    verifyChoice === 'STILL_EXISTS'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-md shadow-rose-500/10'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm mb-1">✕ Still Exists</div>
                  <div className="text-[10px] font-normal opacity-80">No work done or hazard reoccurred.</div>
                </button>
              </div>

              {/* Optional Comment & Photo */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={verifyComment}
                  onChange={(e) => setVerifyComment(e.target.value)}
                  placeholder="Optional: Add your ground inspection notes..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Attach Photo Proof</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setVerifyImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {verifyImage && <span className="text-cyan-400 font-semibold">{verifyImage.name}</span>}
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingVerify}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-95 text-navy-900 font-extrabold text-sm shadow-lg transition-all"
              >
                {submittingVerify ? 'Submitting Verification...' : 'Submit Citizen Verification (+5 Points)'}
              </button>
            </form>

            {/* List of recent citizen verifications */}
            {verifications.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Community Confirmations ({verifications.length})
                </span>
                <div className="space-y-2">
                  {verifications.map((v) => (
                    <div key={v._id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{v.userName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.result === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {v.result.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {v.comment && <p className="text-slate-300 mt-1 italic">"{v.comment}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column (4 cols): Civic Lens Scorecard, Routing, Admin Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Feature 17: Civic Lens Scorecard */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl text-center space-y-4">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              CIVIC LENS SCORECARD
            </span>
            <div className="text-xs font-semibold text-slate-400">
              CIVIC ISSUE #{complaint._id.slice(-4).toUpperCase()}
            </div>

            <div className="py-2">
              <div className="text-5xl font-black text-white">{complaint.priorityScore}</div>
              <div className="text-xs font-bold text-slate-400">/ 100 IMPACT</div>
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {complaint.priorityLevel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left pt-3 border-t border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60">
                <span className="text-[10px] text-slate-500 block">Related Reports</span>
                <span className="font-bold text-white">{complaint.relatedReportsCount} Corroborated</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60">
                <span className="text-[10px] text-slate-500 block">Status</span>
                <span className="font-bold text-cyan-300">{complaint.status.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Civic Impact 0-100 Breakdown Gauge */}
          <ImpactScoreGauge
            score={complaint.priorityScore}
            level={complaint.priorityLevel}
            factors={complaint.impactFactors}
            onExplainClick={() => setWhyModalOpen(true)}
          />

          {/* Feature 13: Smart Department Routing */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              SMART DEPARTMENT ROUTING
            </span>
            
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-cyan-400 font-bold block">AI Recommended Department</span>
                <span className="font-bold text-white text-sm">{complaint.department}</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <span className="text-[10px] text-blue-300 font-bold block">Assigned Authority</span>
                <span className="font-bold text-white text-sm">{complaint.assignedDepartment}</span>
              </div>
            </div>
          </div>

          {/* Authority / Admin Actions Panel */}
          {isAuthority && (
            <div className="glass-panel-glow p-5 rounded-2xl border border-blue-500/40 space-y-4">
              <div className="flex items-center space-x-2 text-blue-400 pb-2 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-sm font-extrabold text-white">Authority Dispatch Controls</h4>
              </div>

              <form onSubmit={handleAdminStatusUpdate} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Update Status Stage</label>
                  <select
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none"
                  >
                    <option value="REPORTED">REPORTED</option>
                    <option value="AI_CLASSIFIED">AI_CLASSIFIED</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="AWAITING_VERIFICATION">AWAITING_VERIFICATION (Proof Attached)</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Override Assigned Department</label>
                  <select
                    value={adminDept}
                    onChange={(e) => setAdminDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none"
                  >
                    <option value="Public Works">Public Works</option>
                    <option value="Municipal Sanitation">Municipal Sanitation</option>
                    <option value="Water Supply & Sewerage Board">Water Supply & Sewerage Board</option>
                    <option value="Electrical & Lighting Authority">Electrical & Lighting Authority</option>
                    <option value="Traffic Police & Transport Dept">Traffic Police & Transport Dept</option>
                    <option value="City Infrastructure & Public Safety">City Infrastructure & Public Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Resolution Proof Photo (After)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAdminResolutionImage(e.target.files[0])}
                    className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Field Crew Notes</label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Work completed: asphalt compacted, hot-mix sealed..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md"
                >
                  {updatingStatus ? 'Dispatching...' : 'Dispatch / Update Status'}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Feature 16: "Why?" Explanation Modal */}
      <WhyExplanationModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        issueTitle={complaint.title}
        priorityLevel={complaint.priorityLevel}
        priorityScore={complaint.priorityScore}
        reasons={complaint.aiAnalysis?.whyReasons}
        factors={complaint.impactFactors}
        isFallback={complaint.aiAnalysis?.isFallback}
      />

    </div>
  );
}
