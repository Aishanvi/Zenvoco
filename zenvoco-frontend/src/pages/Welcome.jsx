import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Welcome() {
  return (
    <>
      <Navbar />

      <div className="bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">

        {/* HERO SECTION */}
        <section id="home" className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 overflow-hidden">

          {/* Background Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

            <div className="inline-block px-4 py-2 border border-gray-800 bg-gray-900/50 rounded-full text-blue-400 text-sm font-medium mb-8 backdrop-blur-md">
              ✨ The New Standard for Communication
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
              Master the Art of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500">
                Fearless Communication
              </span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl md:leading-relaxed mb-12 max-w-2xl px-4">
              Zenvoco is an AI-powered system designed for students to conquer anxiety, structure their thoughts, and speak with absolute confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-auto px-6">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Training Free
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto bg-gray-900 border border-gray-800 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 md:py-32 flex flex-col justify-center items-center px-6 text-center bg-gray-950">

          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            How does it <span className="text-blue-500">work?</span>
          </h2>
          <p className="text-gray-400 mb-16 max-w-xl text-lg">A simple three-step methodology to build your speaking muscles.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 transition-all duration-300 group text-left">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 text-3xl mb-8 group-hover:scale-110 transition-transform">
                📖
              </div>
              <h3 className="text-2xl font-bold mb-4">Learn</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Study guided frameworks for interviews, presentations, and viva. Understand the "why" before the "how."
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 transition-all duration-300 group text-left">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 text-3xl mb-8 group-hover:scale-110 transition-transform">
                🎤
              </div>
              <h3 className="text-2xl font-bold mb-4">Practice</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Speak safely into our AI simulator. Make mistakes without judgment and follow on-screen hints.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 transition-all duration-300 group text-left">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 text-3xl mb-8 group-hover:scale-110 transition-transform">
                📈
              </div>
              <h3 className="text-2xl font-bold mb-4">Improve</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Get instant analytics on fluency, clarity, and filler words. Track your growth visually.
              </p>
            </div>

          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 md:py-32 flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">

          <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

          <div className="relative z-10 max-w-4xl bg-gray-900/40 border border-gray-800 backdrop-blur-lg rounded-3xl p-12 md:p-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              Why we built Zenvoco
            </h2>

            <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-left md:text-center font-medium">
              Zenvoco is <span className="text-white font-bold">not</span> an English learning app.
              <br className="hidden md:block" /><br className="hidden md:block" />
              It is a confidence-building communication system designed strictly for students facing high-stakes situations. Through structured learning, guided speaking practice, AI-powered feedback, and personalized insights, it helps you overcome speaking anxiety and build real-world confidence.
            </p>
          </div>

        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-10 text-center text-gray-500 bg-black">
          <p>© 2026 Zenvoco. Master the art of speaking.</p>
        </footer>

      </div>
    </>
  );
}

export default Welcome;