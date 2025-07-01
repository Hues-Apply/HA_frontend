interface AIPreferences {
  opportunities: string[];
  prioritizeBy: string[];
  salaryExpectation: string;
}

interface AITabProps {
  aiPreferences: AIPreferences;
  setAIPreferences: (preferences: AIPreferences) => void;
}

export default function AITab({ aiPreferences, setAIPreferences }: AITabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Select the opportunities you're interested with AI</h3>
        <div className="space-y-2">
          {['Scholarships', 'Jobs', 'Grants', 'Internships'].map((opportunity) => (
            <label key={opportunity} className="flex items-center">
              <input
                type="checkbox"
                checked={aiPreferences.opportunities.includes(opportunity)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAIPreferences({
                      ...aiPreferences,
                      opportunities: [...aiPreferences.opportunities, opportunity]
                    });
                  } else {
                    setAIPreferences({
                      ...aiPreferences,
                      opportunities: aiPreferences.opportunities.filter(o => o !== opportunity)
                    });
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{opportunity}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Prioritize recommendation based on</h3>
        <div className="space-y-2">
          {['My academic background', 'My work experience', 'My preferred locations', 'Other'].map((priority) => (
            <label key={priority} className="flex items-center">
              <input
                type="checkbox"
                checked={aiPreferences.prioritizeBy.includes(priority)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAIPreferences({
                      ...aiPreferences,
                      prioritizeBy: [...aiPreferences.prioritizeBy, priority]
                    });
                  } else {
                    setAIPreferences({
                      ...aiPreferences,
                      prioritizeBy: aiPreferences.prioritizeBy.filter(p => p !== priority)
                    });
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{priority}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional preferences</label>
        <textarea
          value={aiPreferences.salaryExpectation}
          onChange={(e) => setAIPreferences({...aiPreferences, salaryExpectation: e.target.value})}
          rows={2}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
