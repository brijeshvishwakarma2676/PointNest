import React from "react";

const PointsLookup = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">Check Points</h2>

        <input
          placeholder="Phone or Email"
          className="w-full border p-2 rounded mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Check
        </button>
      </div>
    </div>
  );
};

export default PointsLookup;
