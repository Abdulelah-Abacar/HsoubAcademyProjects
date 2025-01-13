"use client";
import { AppContext } from "@/app/context/AppContext";
import { getChatCompletion } from "@/app/controller/dataFetch";
import MainLayout from "@/app/layouts/MainLayout";
import {
  Button,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

const page = ({ params }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [answersArray, setAnswersArray] = useState([]);
  const [question, setQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const {
    contextPreviousMessage,
    setContextPreviousMessage,
    setShowAlert,
    setErrorMessage,
    setTextButton,
    setShowFooterButton,
  } = useContext(AppContext);

  const prompt = {
    role: "user",
    content: `Please give me one multiple-choice question exercise about ${params.slug} 
    without an answer so that I can work on solving it and you have to provide 
    the question and the response should contan the choices only.
    Please put each answer on a separate line and choices shold start by cpital 
    letter A), B), C) and D). the question shold be in level A2 in english`,
  };

  const loadingTextArray = [
    "قريبًا سيتم كشف الستار عن السؤال الشيق، استعد للتحدي!",
    "هل أنت مستعد لإظهار مهاراتك؟ سنكشف عن السؤال قريبًا!",
    "التحدي قادم! انتظر لرؤية السؤال والتفوق في حله.",
    "استعد لاختبار قوتك العقلية، سنقدم لك السؤال قريبًا.",
    "نحن هنا لتقديم لك تحديًا جديدًا، استمتع بانتظار السؤال!",
    "استعد لرحلة تفكير مثيرة، سنعرض السؤال في وقت قريب.",
    "سنكشف النقاب عن اللغز قريبًا، حان وقت إثبات قوتك.",
    "انتظر لحظات قليلة، سنعرض السؤال وستبدأ المتعة!",
    "حان وقت اختبار قدراتك، استعد لحل السؤال.",
  ];

  const getQuestion = async () => {
    setAssistantAnswer("");
    setShowFooterButton(false);
    setLoading(true);
    const response = await getChatCompletion([prompt]);
    checkResponse(response, "question");
    setShowFooterButton(true);
    setTextButton("أعطني سؤال جديد");
    setLoading(false);
  };

  const checkResponse = (response, messageType) => {
    if (response.status == 200) {
      if (messageType == "question") {
        questionRegex(response.data.content);
        setContextPreviousMessage([
          prompt,
          {
            role: response.data.role,
            content: response.data.content,
          },
        ]);
      } else {
        setAssistantAnswer(response.data.content);
        setContextPreviousMessage([
          ...contextPreviousMessage,
          {
            role: "user",
            content: userAnswer,
          },
          {
            role: response.data.role,
            content: response.data.content,
          },
        ]);
      }
    } else {
      setShowAlert(true);
      setErrorMessage(response.data.error);
    }
  };

  const questionRegex = (message) => {
    const regex = /([A-Ea-e]\) | [A-Ea-e]\.)(.*)/g;
    const answerArray = message.match(regex);
    const firstLine = message.split("\n")[0];
    setAnswersArray(answerArray);
    setQuestion(firstLine);
    setMessage(message);
  };

  const getNewQuestion = async () => {
    setAssistantAnswer("");
    setLoading(true);
    const response = await getChatCompletion([
      ...contextPreviousMessage,
      {
        role: "user",
        content: `give me one more question about ${params.slug} without answer`,
      },
    ]);
    checkResponse(response, "question");
    setLoading(false);
  };

  const checkAnswer = async (userAnswer) => {
    setAnswerLoading(true);
    const response = await getChatCompletion([
      {
        role: "assistant",
        content: message,
      },
      {
        role: "user",
        content: `هل الإجابة ${userAnswer} صحيحة للسؤال التالي: ${message}`,
      },
    ]);
    checkResponse(response, "answer");
    setAnswerLoading(false);
  };

  useEffect(() => {
    getQuestion();
  }, []);

  return (
    <MainLayout
      loading={loading}
      onButtonClick={() => getNewQuestion()}
      loadingText={
        loadingTextArray[
          Math.floor(Math.random() * (loadingTextArray.length - 1))
        ]
      }
    >
      {question && (
        <CardContent sx={{ mb: 12 }}>
          <Typography
            sx={{ mt: 6, fontSize: "16px", textAlign: "left" }}
            variant="p"
            component={"span"}
          >
            {question}
          </Typography>
          {answersArray &&
            answersArray.map((item, index) => {
              return (
                <Button
                  variant="contained"
                  size="medium"
                  sx={{ ml: 2, mt: 2, direction: "rtl" }}
                  key={index}
                  onClick={() => {
                    setUserAnswer(item);
                    checkAnswer(item);
                  }}
                >
                  {item}
                </Button>
              );
            })}

          <Box component="div" sx={{ mt: 3 }}>
            {answerLoading ? (
              <CircularProgress />
            ) : (
              assistantAnswer && (
                <Typography component="span">{assistantAnswer}</Typography>
              )
            )}
          </Box>
        </CardContent>
      )}
    </MainLayout>
  );
};

export default page;
