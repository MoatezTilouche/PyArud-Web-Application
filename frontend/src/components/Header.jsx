/**
 * Header Component
 * Displays the app title and description
 */
export default function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            PyArud Web
          </h1>
          <p className="text-emerald-50 text-base sm:text-lg md:text-xl mb-4" dir="rtl">
            تحليل عَروضي للشعر العربي
          </p>
          <p className="text-emerald-100 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            Analysez la métrique de votre poésie arabe en quelques secondes. 
            Entrez vos vers ci-dessous et découvrez le baḥr (البحر), 
            les tafʿīlāt (التفعيلات) et les ziḥāfāt (الزحافات).
          </p>
        </div>
      </div>
    </header>
  );
}
