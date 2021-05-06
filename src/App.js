import React, { useEffect, useState, useCallback } from "react";
import Question from "./components/Question";
import CategorySelector from "./components/CategorySelector";
import ResultModal from "./components/ResultModal";
import Scoreboard from "./components/Scoreboard";
import "./App.css";

export default function App() {
  const [question, setQuestion] = useState(null);
  const [category, setCategory] = useState("any");
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctScore, setCorrectScore] = useState(0);
  const [wrongScore, setWrongScore] = useState(0);

  const getQuestion = useCallback(() => {
    setIsCorrect(null);
    let url = "https://opentdb.com/api.php?amount=1";
    if (category !== "any") url += `&category=${category}`;

    console.log(url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => setQuestion(data.results[0]));
  }, [category]);

  useEffect(() => {
    getQuestion();
  }, [getQuestion, category]);

  function handleQuestionsAnswered(answer) {
    const isAnswerCorrect = answer === question.correct_answer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) setCorrectScore((score) => score + 1);
    else setWrongScore((score) => score + 1);
  }

  return (
    <div className="app">
      {/* show the result modal ----------------------- */}
      {isCorrect !== null && (
        <ResultModal
          isCorrect={isCorrect}
          question={question}
          getQuestion={getQuestion}
        />
      )}

      {/* question header ----------------------- */}
      <div className="question-header">
        <CategorySelector category={category} chooseCategory={setCategory} />
        <Scoreboard correct={correctScore} wrong={wrongScore} />
      </div>

      {/* the question itself ----------------------- */}
      <div className="question-main">
        {question && (
          <Question
            question={question}
            answerQuestion={handleQuestionsAnswered}
          />
        )}
      </div>

      {/* question footer ----------------------- */}
      <div className="question-footer">
        <button onClick={getQuestion}>Go to next question 👉</button>
      </div>
    </div>
  );
}
