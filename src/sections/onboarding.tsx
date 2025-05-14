import React from "react";

const App: React.FC = () => {
  return (
    <div className="bg-[#f0f8ff] min-h-screen flex flex-col items-center justify-center text-center px-4">
      {/* Top-left title */}
      <div className="absolute top-6 left-6 text-lg font-semibold text-sky-500">
        Hues Apply
      </div>

      {/* Placeholder for image or avatar */}
      <div className="w-48 h-60 bg-white rounded-md shadow-md mb-8" />

      {/* Success message */}
      <h2 className="text-xl font-medium text-gray-800">
        Congratulations! You have successfully <br />
        created your profile
      </h2>

      {/* Continue button */}
      <button className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full shadow-md transition">
        Continue
      </button>
    </div>
  );
};

export default App;
