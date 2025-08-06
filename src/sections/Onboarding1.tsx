import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserGoals } from "../services/profile";

const goals = [
  "Get Job Opportunities",
  "Get Grant Opportunities", 
  "CV & Cover Letter Assistance",
  "Get Scholarship Opportunities",
];

export default function GoalSelectionForm() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = async () => {
    if (selectedGoals.length === 0) {
      setError("Please select at least one goal to continue.");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Save goals to backend
      await updateUserGoals(selectedGoals);
      
      // Store selected goals in localStorage as backup
      sessionStorage.setItem('selectedGoals', JSON.stringify(selectedGoals));
      
      // Navigate to step 2 and replace the current history entry
      navigate('/onboarding/step-2', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to save goals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      {/* Top-left title */}
      <div className="absolute top-6 left-6 text-lg font-semibold text-sky-500">
        Hues Apply
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md pb-16">
        <h2 className="text-xl font-semibold text-center mb-6">
          What is your goal of creating this account?
        </h2>        <div className="border-t-2 border-blue-400 w-full mb-4" />
        <p className="text-right text-sm text-gray-500 mb-6">Step 1/2</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4 flex flex-col items-center">
          <div className="flex flex-col items-start w-full px-4">
            {goals.map((goal) => (
              <label
                key={goal}
                className="flex items-center space-x-3 cursor-pointer mb-2"
              >
                <input
                  type="checkbox"
                  checked={selectedGoals.includes(goal)}
                  onChange={() => toggleGoal(goal)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-gray-800">{goal}</span>
              </label>
            ))}
          </div>          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mt-8 disabled:bg-blue-300"
            onClick={handleNext}
            disabled={isLoading}
          >
            {isLoading ? 'Saving Goals...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
