import { useState } from 'react';

/**
 * VerseCard Component
 * Displays analysis results for a single verse with expand/collapse
 */
export default function VerseCard({ verse, index, debugMode }) {
  const [expanded, setExpanded] = useState(false);

  const score = verse.details?.score;
  const scorePct = typeof score === 'number' ? Math.round(score * 100) : null;

  const summarizeAnalysis = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const counts = arr.reduce(
      (acc, item) => {
        const status = item?.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );
    return counts;
  };

  const sadrSummary = summarizeAnalysis(verse.details?.sadr_analysis);
  const ajuzSummary = summarizeAnalysis(verse.details?.ajuz_analysis);

  const getAnalysisChipClass = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'ok' || s === 'valid' || s === 'correct') return 'bg-green-50 text-green-800 border-green-200';
    if (s === 'broken' || s === 'missing' || s === 'invalid') return 'bg-red-50 text-red-800 border-red-200';
    if (s === 'extra_bits' || s === 'extra' || s === 'warn' || s === 'warning') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-white text-gray-700 border-gray-200';
  };

  const getStatusBadge = (verse) => {
    // Check score from details for more accurate validation
    // A verse is considered correct if score >= 0.7 (70%)
    const score = verse.details?.score;
    let isValid;
    
    if (score !== undefined && score !== null) {
      isValid = score >= 0.7;
    } else {
      // Fallback to is_valid and status if no score
      isValid = verse.is_valid === true || verse.status === 'صحيح';
    }
    
    if (isValid) {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
          ✅ Correct
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
        ❌ Broken
      </span>
    );
  };

  // Render tafʿīla as chips
  const renderTafeela = (tafeela) => {
    if (!tafeela) return null;
    if (Array.isArray(tafeela)) {
      return (
        <div className="flex flex-wrap gap-2">
          {tafeela.map((t, i) => {
            // Backend returns objects with pattern, status, text
            const displayText = typeof t === 'object' ? (t.pattern || t.text || JSON.stringify(t)) : t;
            const status = typeof t === 'object' ? t.status : null;
            const colorClass = status === 'broken' || status === 'missing' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800';
            
            return (
              <span key={i} className={`px-3 py-1 ${colorClass} rounded-lg text-sm font-medium`}>
                {displayText}
              </span>
            );
          })}
        </div>
      );
    }
    return <span className="text-sm text-gray-700">{JSON.stringify(tafeela)}</span>;
  };

  // Render ziḥāf as chips
  const renderZihaf = (zihaf) => {
    if (!zihaf) return null;
    if (Array.isArray(zihaf)) {
      return (
        <div className="flex flex-wrap gap-2">
          {zihaf.map((z, i) => (
            <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
              {z}
            </span>
          ))}
        </div>
      );
    }
    return <span className="text-sm text-gray-700">{JSON.stringify(zihaf)}</span>;
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-7 sm:p-8 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
      {/* Verse Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <span className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
          Verse {index + 1}
        </span>
        <div className="flex items-center gap-3">
          {scorePct !== null && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-slate-800 border border-gray-200">
              Score: {scorePct}%
            </span>
          )}
          {getStatusBadge(verse)}
        </div>
      </div>

      {/* Verse Text */}
      <div className="mb-8 bg-white rounded-xl p-6 sm:p-7 border border-gray-200">
        {(verse.sadr || verse.ajuz) ? (
          <div className="space-y-6">
            {verse.sadr && (
              <div>
                <p className="text-sm text-gray-500 mb-1">صدر</p>
                <p className="text-2xl sm:text-3xl text-gray-900 leading-loose text-right" dir="rtl" style={{ fontFamily: 'Amiri, serif' }}>
                  {verse.sadr}
                </p>
              </div>
            )}
            {verse.ajuz && (
              <div className={verse.sadr ? 'pt-4 border-t border-gray-100' : undefined}>
                <p className="text-sm text-gray-500 mb-1">عجز</p>
                <p className="text-2xl sm:text-3xl text-gray-900 leading-loose text-right" dir="rtl" style={{ fontFamily: 'Amiri, serif' }}>
                  {verse.ajuz}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-2xl sm:text-3xl text-gray-900 leading-loose text-right" dir="rtl" style={{ fontFamily: 'Amiri, serif' }}>
            {verse.original_verse || verse.input || ''}
          </p>
        )}

        {scorePct !== null && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 font-medium">Verse score</p>
              <p className="text-sm text-gray-600">{scorePct}%</p>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, scorePct))}%` }}
              />
            </div>
          </div>
        )}

        {(sadrSummary || ajuzSummary) && (
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sadrSummary && (
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">صدر analysis</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(sadrSummary).map(([k, v]) => (
                    <span key={k} className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAnalysisChipClass(k)}`}>
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {ajuzSummary && (
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">عجز analysis</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ajuzSummary).map(([k, v]) => (
                    <span key={k} className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAnalysisChipClass(k)}`}>
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact Analysis */}
      <div className="space-y-7">
        {/* Tafʿīla */}
        {(verse.tafila || verse.tafeela) && (
          <div>
            <h4 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-blue-600">📊</span> Tafʿīla (التفعيلة)
            </h4>
            {renderTafeela(verse.tafila || verse.tafeela)}
          </div>
        )}

        {/* Ziḥāf */}
        {(verse.zihaaf || verse.zihaf) && (
          <div>
            <h4 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-purple-600">🔄</span> Ziḥāf (الزحاف)
            </h4>
            {renderZihaf(verse.zihaaf || verse.zihaf)}
          </div>
        )}

        {/* Missing/Extra Bits */}
        {(verse.missing_bits || verse.extra_bits) && (
          <div className="bg-red-50 rounded-lg p-5 border border-red-200">
            <h4 className="text-base font-semibold text-red-800 mb-4 flex items-center gap-2">
              <span>⚠️</span> Why is it broken?
            </h4>
            {verse.missing_bits && (
              <p className="text-base text-red-700 mb-2">
                <strong>Missing syllables:</strong> {verse.missing_bits}
              </p>
            )}
            {verse.extra_bits && (
              <p className="text-sm text-red-700">
                <strong>Extra syllables:</strong> {verse.extra_bits}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Expand/Collapse Details */}
      {debugMode && (
        <div className="mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            {expanded ? '▼ Hide' : '▶ Show'} raw details
          </button>
          {expanded && (
            <div className="mt-3 bg-gray-900 rounded-lg p-4">
              <pre className="text-xs text-green-400 overflow-x-auto">
                {JSON.stringify(verse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
