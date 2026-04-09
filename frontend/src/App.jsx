import React, { useState, useEffect } from 'react';

function App() {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    total_sqft: 1000,
    bhk: 2,
    bath: 2,
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
          setFormData((prev) => ({ ...prev, location: data.locations[0] }));
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Send form data to Flask backend
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
          total_sqft: formData.total_sqft,
          bhk: formData.bhk,
          bath: formData.bath,
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
    /* Main Wrapper: Includes the background image from Unsplash. 
      We use a modern luxury home image that fits the real estate theme.
    */
    <div 
      className="relative min-h-screen flex items-center justify-center p-4 font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80')" }}
    >
      {/* Dark overlay to ensure the white text remains readable over the image */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-0"></div>

      {/* Main Card (Glassmorphism Effect) */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-600/50 overflow-hidden transition-all duration-300">
        
        {/* Header Area */}
        <div className="bg-slate-950/50 p-8 border-b border-slate-700/50">
          <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-md">
            Bangalore Real Estate
          </h1>
          <p className="text-center text-slate-300 mt-2 text-sm uppercase tracking-widest font-medium">
            AI Price Prediction Engine
          </p>
        </div>

        {/* Input Form */}
        <div className="p-8">
          <form onSubmit={handlePredict} className="space-y-6">
            
            {/* Square Footage */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2 drop-shadow-sm">Area (Square Feet)</label>
              <input
                type="number"
                name="total_sqft"
                value={formData.total_sqft}
                onChange={handleChange}
                className="w-full bg-slate-950/60 text-white border border-slate-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all placeholder-slate-400"
                required
              />
            </div>

            {/* BHK and Bathrooms Grid */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2 drop-shadow-sm">BHK</label>
                <select
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 text-white border border-slate-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num} className="bg-slate-800">{num} BHK</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2 drop-shadow-sm">Bathrooms</label>
                <select
                  name="bath"
                  value={formData.bath}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 text-white border border-slate-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num} className="bg-slate-800">{num} Bath</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2 drop-shadow-sm">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-950/60 text-white border border-slate-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all appearance-none cursor-pointer"
                required
              >
                {locations.length > 0 ? (
                  locations.map((loc, index) => (
                    <option key={index} value={loc} className="bg-slate-800">{loc}</option>
                  ))
                ) : (
                  <option value="" className="bg-slate-800">Loading database...</option>
                )}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Market Data...
                </span>
              ) : 'Estimate Property Value'}
            </button>
          </form>

          {/* Result Output Area */}
          {estimatedPrice && (
            <div className="mt-8 p-6 bg-slate-950/40 border border-slate-500/30 rounded-2xl text-center shadow-inner backdrop-blur-md animate-fade-in-up">
              <p className="text-slate-300 text-xs mb-2 uppercase tracking-widest font-semibold">Estimated Market Value</p>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 drop-shadow-lg">
                ₹ {estimatedPrice} Lakh
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;