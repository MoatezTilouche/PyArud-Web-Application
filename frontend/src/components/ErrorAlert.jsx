/**
 * ErrorAlert Component
 * Displays error messages
 */
export default function ErrorAlert({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl flex-shrink-0">❌</span>
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold mb-1 text-lg">Erreur</h3>
            <p className="text-red-700 text-base">{error}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
