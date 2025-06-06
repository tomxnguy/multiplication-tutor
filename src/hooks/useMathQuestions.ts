import { useState, useEffect } from "react";

interface Question {
  question: string;
  number_0: string;
  number_1: string;
  operator: string;
}

interface PublicMathQuestions {
  [key: `multiplication_${number}`]: Question[];
}

interface UseMathQuestionsReturn {
  questions: PublicMathQuestions | null;
  loading: boolean;
  error: string | null;
}

const useMathQuestions = (): UseMathQuestionsReturn => {
  const [questions, setQuestions] = useState<PublicMathQuestions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMathQuestions = async () => {
      const url = "https://www.bloshup.com:8181/dev/publicmathget";
      const payload = {
        tag: "publicmath.get",
        deviceid: "680810a0737ab55963f6223b",
      };

      try {
        setLoading(true);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Unknown error" }));
          throw new Error(
            `HTTP error! status: ${response.status} - ${
              errorData.message || "Server error"
            }`
          );
        }

        const data: { public: PublicMathQuestions } = await response.json();
        setQuestions(data.public);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMathQuestions();

    const intervalId = setInterval(fetchMathQuestions, 3 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);
  return { questions, loading, error };
};

export default useMathQuestions;
