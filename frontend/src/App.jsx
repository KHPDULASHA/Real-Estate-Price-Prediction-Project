import React, { useState, useEffect } from 'react';
import { Home, MapPin, Grid3X3, Bath, TrendingUp, Info, Activity, Layers, Target, Database } from 'lucide-react'; 

function App() {
  const [locations, setLocations] = useState([]);
  
  // 1. Initial state is completely empty
  const [formData, setFormData] = useState({ 
    total_sqft: '', 
    bhk: '', 
    bath: '', 
    location: '' 
  });
  
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch locations from Flask backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_location_names')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.locations) {
          setLocations(data.locations);
          // 2. Auto-select removed: We no longer force the first location into state
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstimatedPrice(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict_home_price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          total_sqft: parseFloat(formData.total_sqft),
          bhk: parseInt(formData.bhk),
          bath: parseInt(formData.bath),
          location: formData.location
        })
      });

      const data = await response.json();
      setEstimatedPrice(data.estimated_price);
    } catch (error) {
      console.error("Error predicting price:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center p-4 font-sans bg-cover bg-center bg-fixed selection:bg-indigo-500/30"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80')" }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-0"></div>

      <div className="relative z-10 w-full max-w-4xl bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-600/50 overflow-hidden transition-all duration-300 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
        
        {/* Left Column: Form and Results */}
        <div className="space-y-8">
          <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-700/50 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-md">
                Bangalore Real Estate
              </h1>
            </div>
            <p className="text-slate-300 text-sm uppercase tracking-widest font-medium">
              Predictive AI Dashboard
            </p>
          </div>

          <form onSubmit={handlePredict} className="space-y-6">
            <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-700/50 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-200">Property Specifications</h3>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Total Area (SqFt)</label>
                <div className="relative">
                  <Grid3X3 className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="number" 
                    name="total_sqft" 
                    value={formData.total_sqft} 
                    onChange={handleChange}
                    placeholder="e.g. 1200"
                    className="w-full bg-slate-950/60 text-white border border-slate-600/50 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-blue-500/80 transition-all placeholder-slate-500"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-4">Total area is a key value in property valuation.</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-1.5 block">BHK</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    {/* 3. Placeholder option added, marked required */}
                    <select name="bhk" value={formData.bhk} onChange={handleChange} required className="w-full h-11 bg-slate-950/60 text-white border border-slate-600/50 rounded-xl pl-9 pr-4 focus:ring-2 focus:ring-blue-500/80 cursor-pointer">
                      <option value="" disabled>Select BHK</option>
                      {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num} className="bg-slate-900">{num} BHK</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Bathrooms</label>
                  <div className="relative">
                    <Bath className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    {/* 3. Placeholder option added, marked required */}
                    <select name="bath" value={formData.bath} onChange={handleChange} required className="w-full h-11 bg-slate-950/60 text-white border border-slate-600/50 rounded-xl pl-9 pr-4 focus:ring-2 focus:ring-blue-500/80 cursor-pointer">
                      <option value="" disabled>Select Bath</option>
                      {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num} className="bg-slate-900">{num} Bath</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-200">Location Details</h3>
              </div>
              <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Location Name</label>
              {/* 3. Placeholder option added, marked required */}
              <select name="location" value={formData.location} onChange={handleChange} required className="w-full h-12 bg-slate-950/60 text-white border border-slate-600/50 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/80 cursor-pointer">
                <option value="" disabled>Choose a Location...</option>
                {locations.length > 0 ? locations.map((loc, index) => <option key={index} value={loc} className="bg-slate-900">{loc}</option>) : <option value="" disabled>Loading database...</option>}
              </select>
              <p className="text-xs text-slate-500 mt-1 ml-4">Location significantly impacts property prices due to amenities, transport, and overall area desirability.</p>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full mt-2 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Activity className="animate-pulse" /> : 'Analyze Property Data'}
            </button>
          </form>

          {estimatedPrice && (
            <div className="mt-8 bg-slate-950/40 border border-slate-700/50 rounded-3xl p-6 text-center shadow-inner backdrop-blur-md animate-fade-in-up">
              <p className="text-slate-300 text-sm mb-1 uppercase tracking-widest font-semibold">Estimated Market Value</p>
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 drop-shadow-lg animate-pulse-slow">
                ₹ {estimatedPrice} Lakh
              </h2>
            </div>
          )}
        </div>

        {/* Right Column: Educational Insights Dashboard */}
        <div className="space-y-8 mt-10 md:mt-0">
          <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-700/50 space-y-3">
            <h2 className="text-2xl font-bold flex items-center gap-3"><Layers className="text-indigo-400" /> Data Science & Market Insights</h2>
            <p className="text-slate-400 text-sm">Understand the concepts driving the predictions and typical property characteristics.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-700/50 space-y-4 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <h4 className="font-semibold text-slate-100">Project Model Overview </h4>
              </div>
              <p className="text-slate-300 text-xs">Utilizes real-world data, optimized using Linear Regression & GridSearchCV.</p>
            </div>
            <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-700/50 space-y-4 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <h4 className="font-semibold text-slate-100">Key Feature Drivers </h4>
              </div>
              <p className="text-slate-300 text-xs">Area, Location Desirability, and Property Size are typical primary valuation factors.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-700/50 space-y-4 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-slate-100">Project Journey</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-slate-400 text-xs">
                {['Data Cleansing', 'Outlier Removal', 'Feature Engineering', 'Model Building', 'Prediction API'].map(step => (
                  <div key={step} className="bg-slate-900 rounded-lg p-1.5 border border-slate-800">{step}</div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-100">Model Performance </h3>
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-slate-300 text-xs">Linear Regression is typically chosen for interpretability; grid search optimizes hyperparameters.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-100">Feature Insights </h3>
                    <Info className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-slate-300 text-xs">Typically, Location significantly impacts price variability, followed by Area and BHK.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-100">Bangalore Property Trends </h3>
                <Layers className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-slate-300 text-xs">Properties commonly range from small apartments to large villas; demand varies significantly by sub-region desirability.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;