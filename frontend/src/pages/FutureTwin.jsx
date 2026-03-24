import { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import { futureTwinMockResponse } from '../data/mockData';
import { motion } from 'framer-motion';
import FutureTwinPic from '../assets/digitwin.png'

const FutureTwin = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    if (!query.trim()) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use mock response with user's query
    setResult({
      ...futureTwinMockResponse,
      query: query
    });

    setIsLoading(false);
  };

  const getFeasibilityColor = (feasibility) => {
    if (feasibility === 'High') return 'text-green-400 bg-green-500/20';
    if (feasibility === 'Medium') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={40} className="text-indigo-400 animate-pulse" />

            <motion.h1 className="text-4xl font-bold young-serif-regular text-white"
            animate={{
              textShadow: [
                "0px 0px 0px rgba(99,102,241,0)",
                "0px 0px 15px rgba(99,102,241,0.6)",
                "0px 0px 0px rgba(99,102,241,0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}>
              Future<span className="bg-gradient-to-r baloo-2-700 md:text-5xl from-indigo-400 to-purple-400 bg-clip-text text-transparent">Twin</span>AI
            </motion.h1>
          </div>

          <p className="text-gray-400 text-lg">
            Simulate your future. Optimize your decisions.
          </p>
        </motion.div>

        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">

            {/* LEFT → AI HUMAN */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative flex justify-center"
            >

              {/* Glow Background */}
              <div className="absolute w-72 h-72 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-30 rounded-full"></div>

              {/* IMAGE */}
              <motion.img
                src={FutureTwinPic}
                alt="Future Twin"
                className="relative w-full max-w-xs md:max-w-md rounded-3xl object-cover border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.5)]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Scan Line Effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-indigo-400 opacity-60"
                animate={{ y: [0, 235, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

            </motion.div>

            {/* RIGHT → INPUT PANEL */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
            >

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]">

                <h2 className="text-xl font-semibold text-white mb-4">
                  Ask Your Future Twin
                </h2>

                <div className="flex items-center gap-2 mb-3 text-sm text-indigo-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  Future Twin Connected
                </div>

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Simulate your future scenario..."
                  className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all min-h-[160px] text-lg resize-none"
                />

                <GradientButton
                  onClick={handleSimulate}
                  className="w-full mt-4 text-lg py-4"
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      Running Simulation...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={24} />
                      Simulate Future
                    </span>
                  )}
                </GradientButton>

              </Card>

            </motion.div>

          </div>

        )}

        {result && (

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-6" data-testid="futuretwin-result">
              <div className="text-center text-indigo-400 text-sm mb-2 animate-pulse">
                Simulation Complete ✔
              </div>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-indigo-400 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-green-400 text-base mb-1 font-mono">
                      &gt; input.query
                    </p>
                    <p className="text-white text-lg font-medium italic">"{result.query}"</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="text-blue-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Feasibility</h3>
                  </div>
                  <div className={`inline-block px-6 py-3 rounded-full text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] font-bold ${getFeasibilityColor(result.feasibility)}`}>
                    {result.feasibility}
                  </div>
                  <p className="text-gray-400 text-sm mt-3">
                    This goal is {result.feasibility.toLowerCase()} feasible with proper planning and commitment.
                  </p>
                </Card>

                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    {result.isGood ? (
                      <CheckCircle className="text-green-400" size={24} />
                    ) : (
                      <XCircle className="text-red-400" size={24} />
                    )}
                    <h3 className="text-xl font-semibold text-white">Is It Good?</h3>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold ${result.isGood
                    ? 'text-green-400 bg-green-500/20'
                    : 'text-red-400 bg-red-500/20'
                    }`}>
                    {result.isGood ? (
                      <>
                        <CheckCircle size={24} />
                        Yes, Recommended
                      </>
                    ) : (
                      <>
                        <XCircle size={24} />
                        Needs Consideration
                      </>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-3">
                    {result.isGood
                      ? 'This action aligns well with personal growth and success.'
                      : 'Consider potential drawbacks before proceeding.'}
                  </p>
                </Card>
              </div>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-green-400" size={28} />
                  <h3 className="text-2xl font-semibold text-white">Benefits</h3>
                </div>
                <ul className="space-y-3">
                  {result.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-200"
                    >
                      <span className="text-green-400 mt-1 text-xl flex-shrink-0">✓</span>
                      <span className="text-base">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-orange-400" size={28} />
                  <h3 className="text-2xl font-semibold text-white">Consequences & Challenges</h3>
                </div>
                <ul className="space-y-3">
                  {result.consequences.map((consequence, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-200"
                    >
                      <span className="text-orange-400 mt-1 text-xl flex-shrink-0">⚠</span>
                      <span className="text-base">{consequence}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="text-yellow-400" size={28} />
                  <h3 className="text-2xl font-semibold text-white">AI Insights & Recommendations</h3>
                </div>
                <div className="space-y-4">
                  {result.insights.map((insight, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-indigo-500">
                      <div className="flex items-start gap-3">
                        <span className="text-indigo-400 font-bold text-lg flex-shrink-0">{index + 1}.</span>
                        <p className="text-gray-200 leading-relaxed text-base">{insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setQuery('');
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 text-white cursor-pointer rounded-xl transition-all font-semibold text-lg"
                  data-testid="ask-another-btn"
                >
                  Ask Another Question →
                </button>
                <button
                  onClick={() => {
                    alert('Feature coming soon: Save insights to your goals!');
                  }}
                  className="flex-1 py-4 bg-gray-700 cursor-pointer hover:bg-gray-600 text-white rounded-xl transition-all font-semibold text-lg"
                >
                  Save to My Goals
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FutureTwin;