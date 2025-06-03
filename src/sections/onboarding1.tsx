import { useState } from "react";

const goals = [
  "Get Job Opportunities",
  "Get Grant Opportunities",
  "CV & Cover Letter Assistance",
  "Get Scholarship Opportunities",
];

export default function GoalSelectionForm() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md pb-16">
        <h2 className="text-xl font-semibold text-center mb-6">
          What is your goal of creating this account?
        </h2>

        <div className="border-t-2 border-blue-400 w-full mb-4" />
        <p className="text-right text-sm text-gray-500 mb-6">Step 1/2</p>

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
          </div>

          <button
            type="button"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mt-8"
            onClick={() => alert("Selected goals: " + selectedGoals.join(", "))}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
