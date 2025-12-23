import { useState } from 'react';
import VerseCard from './VerseCard';
import Toast from './Toast';

/**
 * Results Component
 * Displays comprehensive analysis results with summary and verse-by-verse breakdown
 */
export default function Results({ data, inputLineCount, debugMode, onToggleDebug }) {
  const [showRawJSON, setShowRawJSON] = useState(false);
  const [toast, setToast] = useState(null);

  if (!data) return null;

  const inputLines = typeof inputLineCount === 'number' ? inputLineCount : null;

  const verses = data.verses_analysis || data.verses || [];

  const meterEn = data.bahr || data.meter || '';
  const meterAr = data.meter_ar || '';
  const hasArabic = (text) => typeof text === 'string' && /[\u0600-\u06FF]/.test(text);
  const primaryMeter = hasArabic(meterAr) ? meterAr : (meterEn || meterAr || 'غير معروف');
  const secondaryMeter = hasArabic(meterAr)
    ? (meterEn && meterEn !== meterAr ? meterEn : '')
    : (hasArabic(meterAr) ? '' : (hasArabic(meterEn) ? '' : (meterAr && meterAr !== meterEn ? meterAr : '')));
  
  // Calculate stats - check score from details for more accurate validation
  // A verse is considered correct if score >= 0.7 (70%)
  const correctCount = verses.filter(v => {
    const score = v.details?.score;
    if (score !== undefined && score !== null) {
      return score >= 0.7;
    }
    // Fallback to is_valid and status if no score
    return v.is_valid === true || v.status === 'صحيح';
  }).length;
  const brokenCount = verses.length - correctCount;
  
  // Calculate confidence as average score of all verses (more accurate than binary count)
  let confidence = 0;
  if (verses.length > 0) {
    const totalScore = verses.reduce((sum, v) => {
      const score = v.details?.score;
      if (score !== undefined && score !== null) {
        return sum + score;
      }
      // Fallback: if no score, use binary validation
      return sum + (v.is_valid === true || v.status === 'صحيح' ? 1 : 0);
    }, 0);
    confidence = totalScore / verses.length;
  }

  const correctnessRate = verses.length > 0 ? correctCount / verses.length : 0;

  // Confidence level
  const getConfidenceLevel = (conf) => {
    if (conf >= 0.75) return { label: 'High', color: 'text-green-600', bg: 'bg-green-100' };
    if (conf >= 0.45) return { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Low', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const confLevel = getConfidenceLevel(confidence);

  // Copy functions
  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setToast({ message: 'JSON copied to clipboard!', type: 'success' });
  };

  const copyReport = () => {
    let report = `PyArud Analysis Report\n`;
    report += `========================\n\n`;
    report += `Baḥr: ${primaryMeter}${secondaryMeter ? ` (${secondaryMeter})` : ''}\n`;
    report += `Confidence: ${(confidence * 100).toFixed(1)}% (${confLevel.label})\n`;
    if (typeof inputLines === 'number') {
      report += `Input lines: ${inputLines}\n`;
    }
    report += `Total verses: ${verses.length}\n`;
    report += `✅ Correct: ${correctCount}\n`;
    report += `❌ Broken: ${brokenCount}\n\n`;
    
    verses.forEach((v, idx) => {
      report += `Verse ${idx + 1}: ${v.input}\n`;
      report += `Status: ${v.status}\n\n`;
    });

    navigator.clipboard.writeText(report);
    setToast({ message: 'Report copied to clipboard!', type: 'success' });
  };

  return (
    <div className="space-y-12">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-10 border-2 border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-4xl">🎭</span>
            Analysis Summary
          </h2>
          <button
            onClick={onToggleDebug}
            className="text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-white transition-all"
          >
            {debugMode ? '🔒 Hide Debug' : '🔧 Debug Mode'}
          </button>
        </div>

        {/* Detected Meter */}
        <div className="bg-white rounded-xl p-8 mb-10 border-l-4 border-blue-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <p className="text-base text-gray-600">Detected Baḥr (البحر)</p>
            {secondaryMeter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                {secondaryMeter}
              </span>
            )}
          </div>
          <p
            className="text-4xl sm:text-5xl font-bold text-blue-800"
            dir={hasArabic(primaryMeter) ? 'rtl' : 'ltr'}
            style={hasArabic(primaryMeter) ? { fontFamily: 'Amiri, serif' } : undefined}
          >
            {primaryMeter}
          </p>
        </div>

        {/* Confidence & Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {/* Confidence */}
          <div className="bg-white rounded-xl p-7">
            <p className="text-sm text-gray-600 mb-3">Confidence</p>
            <div className="flex items-center gap-2">
              <span className={`text-3xl font-bold ${confLevel.color}`}>
                {(confidence * 100).toFixed(0)}%
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${confLevel.bg} ${confLevel.color} font-medium`}>
                {confLevel.label}
              </span>
            </div>
            <div className="mt-4">
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, confidence * 100))}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Average analysis score across verses
              </p>
            </div>
          </div>

          {/* Total Verses */}
          <div className="bg-white rounded-xl p-7">
            <p className="text-sm text-gray-600 mb-3">Total Verses</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800">{verses.length}</span>
              <span className="text-sm text-gray-500">verse{verses.length === 1 ? '' : 's'}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Based on paired sadr + ajuz
            </p>
            {typeof inputLines === 'number' && (
              <p className="mt-2 text-xs text-gray-500">
                Input lines: <span className="font-semibold text-gray-700">{inputLines}</span>
              </p>
            )}
          </div>

          {/* Correct Verses */}
          <div className="bg-white rounded-xl p-7">
            <p className="text-sm text-gray-600 mb-3">Correct Verses</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-green-600">✅ {correctCount}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {(correctnessRate * 100).toFixed(0)}% correct
            </p>
          </div>

          {/* Broken Verses */}
          <div className="bg-white rounded-xl p-7">
            <p className="text-sm text-gray-600 mb-3">Broken Verses</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-red-600">❌ {brokenCount}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {((1 - correctnessRate) * 100).toFixed(0)}% broken
            </p>
          </div>
        </div>

        {/* Low Confidence Warning */}
        {confidence < 0.45 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-base text-yellow-800">
              ⚠️ <strong>Low confidence detected.</strong> Try adding diacritics (tashkīl) or use | to split صدر | عجز for better accuracy.
            </p>
          </div>
        )}

        {/* Export Buttons */}
        <div className="mt-10 pt-7 border-t border-blue-200/60 flex flex-wrap gap-4">
          <button
            onClick={copyJSON}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold">Copy JSON</span>
          </button>
          <button
            onClick={copyReport}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-semibold">Copy Report</span>
          </button>
        </div>
      </div>

      {/* Raw JSON (Debug Mode) */}
      {debugMode && (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">Raw JSON Response</h3>
            <button
              onClick={() => setShowRawJSON(!showRawJSON)}
              className="text-xs px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              {showRawJSON ? 'Hide' : 'Show'}
            </button>
          </div>
          {showRawJSON && (
            <pre className="text-xs text-green-400 overflow-x-auto p-4 bg-black rounded-lg">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Verse-by-Verse Analysis */}
      {verses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📖</span>
              Verse-by-Verse Analysis
            </h2>
            <span className="text-sm text-gray-500">
              {verses.length} verse{verses.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="space-y-6">
            {verses.map((verse, idx) => (
              <VerseCard key={idx} verse={verse} index={idx} debugMode={debugMode} />
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
