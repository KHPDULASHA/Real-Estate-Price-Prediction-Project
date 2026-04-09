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

  // 1. Fetch locations from your Flask backend when the app loads
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_location_names')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.locations) {
          setLocations(data.locations);
          // Set the default dropdown value to the first location
          setFormData((prev) => ({ ...prev, location: data.locations[0] }));
        }
      })
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Send form data to Flask backend to get the prediction
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
        // URLSearchParams perfectly matches Flask's request.form
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
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 border-b border-slate-700">
          <h1 className="text-3xl font-bold text-center text-blue-400">
            Bangalore Real Estate
          </h1>
          <p className="text-center text-slate-400 mt-2 text-sm uppercase tracking-widest">
            Price Prediction Engine
          </p>
        </div>

        {/* Input Form */}
        <div className="p-8">
          <form onSubmit={handlePredict} className="space-y-6">
            
            {/* Square Footage */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Area (Square Feet)</label>
              <input
                type="number"
                name="total_sqft"
                value={formData.total_sqft}
                onChange={handleChange}
                className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* BHK and Bathrooms Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">BHK</label>
                <select
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleChange}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} BHK</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Bathrooms</label>
                <select
                  name="bath"
                  value={formData.bath}
                  onChange={handleChange}
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Bath</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
                {locations.length > 0 ? (
                  locations.map((loc, index) => (
                    <option key={index} value={loc}>{loc}</option>
                  ))
                ) : (
                  <option value="">Loading database...</option>
                )}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-300 disabled:opacity-50 mt-4"
            >
              {loading ? 'Analyzing Data...' : 'Estimate Price'}
            </button>
          </form>

          {/* Result Output Area */}
          {estimatedPrice && (
            <div className="mt-8 p-6 bg-slate-900 border border-slate-700 rounded-xl text-center shadow-inner">
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-wide">Estimated Value</p>
              <h2 className="text-4xl font-extrabold text-emerald-400">
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