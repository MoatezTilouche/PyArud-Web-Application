/**
 * PoemInput Component
 * Perfect textarea for entering poem verses with RTL support
 */
export default function PoemInput({ value, onChange, onAnalyze, onClear, onFillExample, loading, verseCount }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 sm:p-12 border border-gray-200">
      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-4 text-lg">
          📝 Enter your poem (one verse per line)
        </label>
        <p className="text-sm text-gray-500 mb-3">
          💡 Tip: Two consecutive lines will be paired as صدر (sadr) and عجز (ajuz) to form one بيت (verse)
        </p>
        {verseCount > 0 && (
          <p className="text-sm text-blue-600 font-medium">
            {verseCount} line{verseCount > 1 ? 's' : ''} entered
          </p>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="اكتب الأبيات هنا...&#10;أَسِرْبَ القَطَا هَلْ مَنْ يُعِيرُ جَنَاحَهُ&#10;لَعَلِّي إِلَى مَنْ قَدْ هَوِيتُ أَطِيرُ"
        dir="rtl"
        style={{ unicodeBidi: 'plaintext' }}
        className="w-full h-56 sm:h-64 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl
                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                   text-lg sm:text-xl text-gray-900 resize-none transition-all
                   placeholder-gray-400"
        disabled={loading}
        maxLength={10000}
      />
      
      <div className="mt-10 flex flex-col gap-5">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-5">
          <button
            onClick={onAnalyze}
            disabled={loading || !value.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                       px-6 py-4 rounded-xl font-semibold text-lg
                       hover:from-blue-700 hover:to-blue-800
                       disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                       transform hover:scale-[1.02] active:scale-[0.98]
                       transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>🔍</span>
            <span>Analyze</span>
          </button>
          
          <button
            onClick={onClear}
            disabled={loading || !value.trim()}
            className="px-6 py-4 rounded-xl font-semibold text-lg
                       border-2 border-gray-300 text-gray-700 bg-white
                       hover:bg-gray-50 hover:border-gray-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            <span>Clear</span>
          </button>
        </div>

        {/* Example Buttons */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 mb-2">Fill with example:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onFillExample('mutakarib')}
              disabled={loading}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600
                         hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700
                         disabled:opacity-50 transition-all"
            >
              Mutaqārib
            </button>
            <button
              onClick={() => onFillExample('kamil')}
              disabled={loading}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600
                         hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700
                         disabled:opacity-50 transition-all"
            >
              Kāmil
            </button>
            <button
              onClick={() => onFillExample('taweel')}
              disabled={loading}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600
                         hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700
                         disabled:opacity-50 transition-all"
            >
              Ṭawīl
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
