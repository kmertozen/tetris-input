import "./App.css";
import { useState, useEffect, TouchEvent } from "react";
const createNewBag = () => {
  const defaultNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const numbers = defaultNumbers.slice();
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  if (!numbers || numbers.length === 0) {
    return defaultNumbers;
  }
  return numbers;
};

function App() {
  const [phoneNumber, setPhoneNumber] = useState<string[]>(Array(10).fill(""));
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [numberBag, setNumberBag] = useState<number[]>(createNewBag());
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const isPhoneNumberComplete = () => {
    return !phoneNumber.includes("");
  };

  const generateRandomNumber = () => {
    if (numberBag.length === 0) {
      setNumberBag(createNewBag());
      return numberBag[0] || 0;
    }
    const number = numberBag[0];
    setNumberBag((prev) => prev.slice(1));
    return number;
  };

  const startNewNumber = () => {
    if (!isPhoneNumberComplete()) {
      setPosition({ x: 4, y: 0 });
      setCurrentNumber(generateRandomNumber());
    }
  };

  useEffect(() => {
    if (isPhoneNumberComplete()) return;

    const gravity = setInterval(() => {
      if (position.y < 7) {
        setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
      }
    }, 500);

    return () => clearInterval(gravity);
  }, [position, phoneNumber]);

  useEffect(() => {
    if (isPhoneNumberComplete()) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (position.x > 0) {
            setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
          }
          break;
        case "ArrowRight":
          if (position.x < 9) {
            setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
          }
          break;
        case "ArrowDown":
          if (position.y < 7) {
            setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
          }
          break;
        case " ":
          setPosition((prev) => ({ ...prev, y: 7 }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, phoneNumber]);

  useEffect(() => {
    if (position.y >= 7) {
      const newPhoneNumber = [...phoneNumber];
      newPhoneNumber[position.x] = currentNumber.toString();
      setPhoneNumber(newPhoneNumber);
      startNewNumber();
    }
  }, [position.y]);

  useEffect(() => {
    startNewNumber();
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 30) {
      if (diff > 0 && position.x > 0) {
        setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
      } else if (diff < 0 && position.x < 9) {
        setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
      }
      setTouchStart(touchEnd);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handleDoubleTap = () => {
    setPosition((prev) => ({ ...prev, y: 7 }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="p-4 sm:p-8 bg-gray-800 rounded-lg shadow-xl w-[340px] md:w-[504px]">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white text-center">
          Tetris Phone Number Input
        </h2>
        <div
          className="relative w-full h-[320px] sm:h-[320px] bg-gray-700 rounded-lg overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleTap}>
          {!isPhoneNumberComplete() && (
            <div
              style={{
                position: "absolute",
                left: `${
                  (position.x + 1) * (window.innerWidth <= 640 ? 28 : 40)
                }px`,
                top: `${position.y * (window.innerWidth <= 640 ? 35 : 40)}px`,
                transition: "all 0.1s",
              }}
              className="w-7 h-7 sm:w-10 sm:h-10 bg-blue-500 rounded-md flex items-center justify-center text-white text-sm sm:text-base font-bold">
              {currentNumber}
            </div>
          )}

          <div className="absolute bottom-0 w-full flex">
            <div className="w-7 h-7 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center text-white text-sm sm:text-base font-bold">
              +
            </div>
            {phoneNumber.map((num, idx) => (
              <div
                key={idx}
                className="w-7 h-7 sm:w-10 sm:h-10 border border-gray-600 flex items-center justify-center text-white text-sm sm:text-base font-bold">
                {num}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-white text-center">
          <p>Phone: +{phoneNumber.join("")}</p>
          {isPhoneNumberComplete() && (
            <p className="text-green-500 mt-2">Phone number complete!</p>
          )}
          <button
            onClick={() => {
              setPhoneNumber(Array(10).fill(""));
              startNewNumber();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition">
            Reset
          </button>
        </div>

        <div className="mt-4 text-gray-400 text-xs sm:text-sm">
          <p>Controls:</p>
          <p>← → : Move left/right (Swipe left/right on mobile)</p>
          <p>↓ : Move down faster (Swipe down on mobile)</p>
          <p>Space : Drop instantly (Double tap on mobile)</p>
        </div>
      </div>
    </div>
  );
}

export default App;
