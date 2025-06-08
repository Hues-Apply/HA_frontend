import { useState, useRef, useEffect } from 'react';

function App() {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if ((e.key === 'Backspace' || e.key === 'Delete') && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    alert('Code submitted: ' + code.join(''));
  };

  const isComplete = code.every(d => d !== '');

  return (
    <div className="flex h-screen bg-blue-50 items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-md w-[500px] h-[600px] flex flex-col justify-between">
        <div>
          <h2 className="text-center font-bold text-lg mb-2">Verify Email Address</h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            We sent you a 6 digit code to your email address. Please input your code to verify your account.
          </p>

          <div className="flex justify-between mb-4">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el: HTMLInputElement | null) => {inputsRef.current[i] = el;}}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                value={digit}
                onChange={e => handleChange(e.target.value, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                onPaste={e => e.preventDefault()}
                className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <div className="text-sm text-center text-gray-500 mb-10">
            Didn’t get code? <button className="text-blue-500 hover:underline">Resend</button>
          </div>
        </div>

        <button
          disabled={!isComplete}
          onClick={handleSubmit}
          className={`w-full py-2 rounded-md text-white ${
            isComplete ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
          }`}
        >
          Verify Email
        </button>
      </div>
    </div>
  );
}

export default App;
