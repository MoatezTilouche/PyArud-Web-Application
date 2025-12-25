import { useState, useEffect } from "react";
import { PoemInput, Results, ErrorAlert, LoadingSpinner } from "./components";
import { analyzePoem } from "./services/api";

// Example poems for quick testing
const EXAMPLES = {
  mutakarib:
    "قَدْ أَذْكَرُ الشَّجْوَ مِنْ أَحْدَاثِ دَهْرِي\nوَتَبْكِي لَهُ الْعَيْنُ مِنْ بَعْدِ صَبْرِ",
  khafif:
    "قَرِبَتْ سَاعَةُ التَّلَاقِي فَهَيَّا\nنَمْضِ فِي دَرْبِنَا بِغَيْرِ ابْتِئَاسِ",
  taweel:
    "قِفا نَبكِ مِن ذِكرى حَبِيبٍ وَمَنزِلِ\nبِسِقطِ اللِّوى بَينَ الدَخولِ فَحَومَلِ"
};


export default function App() {
  const [poemText, setPoemText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [debugMode, setDebugMode] = useState(false);

  // Load last analysis from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lastAnalysis');
    if (saved) {
      try {
        const { poem, results: savedResults } = JSON.parse(saved);
        setPoemText(poem);
        setResults(savedResults);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const handleAnalyze = async () => {
    // Validation
    const trimmed = poemText.trim();
    if (!trimmed) {
      setError("⚠️ Veuillez entrer au moins un vers avant d'analyser");
      return;
    }

    setError("");
    setResults(null);
    setLoading(true);

    try {
      const verses = poemText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (verses.length === 0) {
        throw new Error("⚠️ Aucun vers valide détecté. Veuillez entrer au moins un vers.");
      }

      if (verses.length > 200) {
        throw new Error("⚠️ Maximum 200 vers autorisés. Vous avez " + verses.length + " vers.");
      }

      const response = await analyzePoem(verses);

      if (response.success) {
        setResults(response.data);
        // Save to localStorage
        localStorage.setItem('lastAnalysis', JSON.stringify({
          poem: poemText,
          results: response.data
        }));
      } else {
        throw new Error(response.error || "Erreur lors de l'analyse");
      }
    } catch (err) {
      if (err.message.includes("Unable to connect")) {
        setError("🔌 Impossible de se connecter au serveur. Vérifiez que l'API est en cours d'exécution.");
      } else {
        setError(err.message || "Une erreur inconnue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillExample = (type) => {
    setPoemText(EXAMPLES[type]);
    setError("");
    setResults(null);
  };

  const handleClear = () => {
    setPoemText("");
    setError("");
    setResults(null);
  };

  const getVerseCount = () => {
    if (!poemText.trim()) return 0;
    return poemText.split("\n").filter(line => line.trim().length > 0).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-blue-50">
      {/* Subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="particles"></div>
      </div>
<br/>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 flex justify-center">
        <div className="text-center w-full max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 gradient-text">
            PyArud Web
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 font-medium mb-6">
            Arabic Poetic Meter Analysis
          </p>
          <div className="flex justify-center">
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              A web application for automatic analysis of Arabic poetry based on classical ʿArūḍ rules (العَروض)
            </p>
          </div>
        </div>
      </section>
<br/>

      {/* Input Section */}
      <div className="relative px-4 mb-20 flex justify-center">
        <div className="w-full max-w-3xl">
          <PoemInput
            value={poemText}
            onChange={setPoemText}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            onFillExample={handleFillExample}
            loading={loading}
            verseCount={getVerseCount()}
          />
        </div>
      </div>
<br/>

      {/* Results Section */}
      <main className="relative px-4 py-16 flex flex-col items-center">
        {error && (
          <div className="mb-12 w-full max-w-3xl">
            <ErrorAlert error={error} onDismiss={() => setError("")} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-12 w-full max-w-3xl">
            <LoadingSpinner message="Analyzing your poetry..." />
          </div>
        )}

        {/* Results Display */}
        {results && !loading && (
          <div className="animate-fade-in w-full max-w-4xl">
            <Results
              data={results}
              inputLineCount={getVerseCount()}
              debugMode={debugMode}
              onToggleDebug={() => setDebugMode(!debugMode)}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !results && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm w-full max-w-3xl">
            <div className="text-7xl mb-4">📖</div>
            <h3 className="text-2xl text-gray-700 font-semibold mb-2">
              Ready to analyze your poetry
            </h3>
            <p className="text-gray-500 mb-4">
              Enter your verses above or try an example
            </p>
            <p className="text-xs text-gray-400">
              💡 Tip: Use | to split صدر | عجز (optional)
            </p>
          </div>
        )}
      </main>

   
    </div>
  );
}
          