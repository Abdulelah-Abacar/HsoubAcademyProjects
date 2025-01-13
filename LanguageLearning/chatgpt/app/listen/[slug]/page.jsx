"use client";

import { AppContext } from "@/app/context/AppContext";
import { getChatCompletion, getTextSpeech } from "@/app/controller/dataFetch";
import MainLayout from "@/app/layouts/MainLayout";
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";

const page = ({ params }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // const [value, setValue] = useState("");
  const [sentence, setSentence] = useState("");
  const [assitantAnswer, setAssitantAnswer] = useState("");
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);

  const {
    setContextPreviousMessage,
    contextPreviousMessage,
    setErrorMessage,
    setShowAlert,
    setTextButton,
    setShowFooterButton,
  } = useContext(AppContext);

  const prompt = {
    role: "user",
    content: `Give me a simple English sentence that contains the ${params.slug}`,
  };

  const loadingTextArray = [
    "القراءة توسّع مفرداتك وتعزز قوة لغتك.",
    "كل جملة تعزز فهمك لبنية اللغة واستخدام الكلمات.",
    "من خلال القراءة، تصبح أكثر دقة في التعبير عن أفكارك.",
    "اكتشف معاني جديدة واستخدمها لتحسين تواصلك اللغوي.",
    "قراءة الجمل تساعدك في تطوير مهاراتك في القواعد اللغوية.",
    "استمتع بالتعرف على أساليب متنوعة للتعبير من خلال القراءة.",
    "كل جملة تمنحك نموًا في فهمك للغة واستخدامها بثقة.",
  ];

  const getSentence = async () => {
    setAssitantAnswer("");
    setShowFooterButton(false);
    setLoading(true);
    const response = await getChatCompletion([prompt]);
    checkResponse(response);
    setShowFooterButton(true);
    setTextButton("أعطني جملة جديدة");
    setLoading(false);
  };

  const checkResponse = (response) => {
    if (response.status == 200) {
      setMessage(response.data.content);
      setContextPreviousMessage([
        prompt,
        {
          role: response.data.role,
          content: response.data.content,
        },
      ]);
    } else {
      setShowAlert(true);
      setErrorMessage(response.data.error);
    }
  };

  const getNewSentence = async () => {
    setAssitantAnswer("");
    setShowFooterButton(false);
    setLoading(true);
    const response = await getChatCompletion([
      ...contextPreviousMessage,
      {
        role: "user",
        content: `أعطني جملة جديدة عن ${params.slug}`,
      },
    ]);
    checkResponse(response);
    setShowFooterButton(true);
    setLoading(false);
  };

  const checkAnswer = async () => {
    setTranscriptionLoading(true);
    // const response = await getChatCompletion([
    //   ...contextPreviousMessage,
    //   {
    //     role: "user",
    //     content: `أنا أعمل على ترجمة الجملة التالية \n ${message} \n وكانت ترجمتي لها هي هذه الجملة \n ${value} \n فهل ترجمتي صحيحة للجملة، تأكد لي من الترجمة الصحيحة وأعطني خطئي في حال كان لدي خطأ`,
    //   },
    // ]);
    if (!(sentence == message)) {
      setAssitantAnswer(`الجملة الصحيحة هي: ${message}`);
      console.log("rwong");
    }
    console.log("right");
    // checkResponse(response, "answer");
    setSentence("");
    setTranscriptionLoading(false);
  };

  useEffect(() => {
    getSentence();
  }, []);

  return (
    <MainLayout
      loading={loading}
      onButtonClick={() => getNewSentence()}
      loadingText={
        loadingTextArray[
          Math.floor(Math.random() * (loadingTextArray.length - 1))
        ]
      }
    >
      {message && (
        <CardContent sx={{ mb: 12, textAlign: "center" }}>
          <Typography component="p">مالذي سمعته: </Typography>
          <Typography
            sx={{ mt: 6, fontSize: "16px", textAlign: "left" }}
            variant="p"
            component="span"
          >
            <MicIcon onClick={() => getTextSpeech(message)} />
          </Typography>
          <Box component="div" sx={{ mt: 2 }}>
            <TextField
              placeholder="مالذي سمعته"
              sx={{ padding: 1 }}
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
            />
            {transcriptionLoading ? (
              <Button
                variant="outlined"
                sx={{ display: "block", mt: 2, mx: "auto" }}
              >
                <CircularProgress size="1rem" />
              </Button>
            ) : (
              <Button
                variant="outlined"
                sx={{ display: "block", mt: 2, mx: "auto" }}
                onClick={() => checkAnswer()}
              >
                تأكد من الجملة
              </Button>
            )}
          </Box>
          {assitantAnswer && (
            <Box component="div" sx={{ mt: 5 }}>
              <Typography component="p">{assitantAnswer}</Typography>
              <Typography component="p">الجملة التي ذكرتها</Typography>
              <Typography component="p">{sentence}</Typography>
            </Box>
          )}
        </CardContent>
      )}
    </MainLayout>
  );
};

export default page;
