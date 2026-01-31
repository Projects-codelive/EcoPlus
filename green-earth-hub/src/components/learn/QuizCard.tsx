
import { useState, useEffect } from 'react';
import { Check, X, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface Question {
  id: string; // Changed from number to string for MongoDB _id
  question: string;
  options: string[];
  // correct is no longer on client side
}

export const QuizCard = () => {
  const { user, updateUserPoints } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null); // For revealing answer
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [score, setScore] = useState(0); // Session score (local visual only)

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/quiz/random');
      if (!res.ok) throw new Error('Failed to fetch quiz');
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (index: number) => {
    if (showResult || verifying) return;

    setSelectedAnswer(index);
    setVerifying(true);

    const question = questions[currentQuestionIndex];

    try {
      const res = await fetch('http://localhost:5000/api/quiz/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          questionId: question.id,
          selectedOptionIndex: index
        })
      });

      const data = await res.json();

      // data = { success: boolean, newTotalPoints: number, correctOptionIndex: number }

      setCorrectOptionIndex(data.correctOptionIndex);
      setIsCorrect(data.success);
      setShowResult(true);

      if (data.success) {
        setScore(prev => prev + 20); // Local session score
        toast.success('+20 Points!', {
          description: 'Great job! Keep learning.',
          duration: 2000,
        });

        // Immediately update global user state
        if (data.newTotalPoints !== undefined) {
          updateUserPoints(data.newTotalPoints);
        }
      } else {
        toast.error('Incorrect', {
          description: `The correct answer was: ${question.options[data.correctOptionIndex]}`,
          duration: 2000
        });
      }

    } catch (error) {
      console.error("Verification failed", error);
      toast.error("Something went wrong verifying your answer.");
    } finally {
      setVerifying(false);
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    if (isLastQuestion) {
      // Reset and fetch new questions for endless mode or just reset
      setScore(0);
      setCurrentQuestionIndex(0);
      setQuestions([]); // Clear to trigger loading state if we want visual refresh
      fetchQuestions(); // Fetch new set
      toast.success("New questions loaded!");

      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(null);
      setCorrectOptionIndex(null);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(null);
      setCorrectOptionIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="lisboa-card min-h-[300px] flex items-center justify-center">
        <Loader2 className="animate-spin text-jungle" size={32} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="lisboa-card min-h-[300px] flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">No questions available right now.</p>
        <button onClick={fetchQuestions} className="btn-jungle">Retry</button>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="lisboa-card space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-bold text-coral">
          Session Score: {score} pts
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-lime h-2">
        <div
          className="progress-fill"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg font-bold text-foreground">
        {question.question}
      </h3>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === correctOptionIndex;

          let buttonStyle = "bg-cream border-transparent hover:border-muted-foreground/30";
          if (showResult) {
            if (isCorrectOption) {
              buttonStyle = "bg-success/20 border-success text-jungle";
            } else if (isSelected && !isCorrectOption) {
              buttonStyle = "bg-destructive/20 border-destructive text-destructive";
            } else {
              buttonStyle = "bg-cream/50 opacity-50 border-transparent";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult || verifying}
              className={cn(
                "p-4 rounded-2xl text-left font-semibold transition-all duration-200 border-2",
                buttonStyle,
                !showResult && "active:scale-95"
              )}
            >
              <div className="flex items-center gap-2">
                {showResult && isCorrectOption && (
                  <Check size={18} strokeWidth={3} className="text-success" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <X size={18} strokeWidth={3} className="text-destructive" />
                )}
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      {showResult && (
        <button
          onClick={handleNext}
          className="btn-coral w-full flex items-center justify-center gap-2 animate-slide-up"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Start New Round' : 'Next Question'}
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
