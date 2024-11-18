import axios from 'axios';
import { create } from 'zustand';
import { useVideoStore } from './useVideoStore'; // Video store'u içe aktarıyoruz

export const useInterviewStore = create((set, get) => ({
  interview: null,
  questions: [],
  isLoading: false,
  error: null,
  personalInfoSubmitted: false,
  currentQuestionIndex: 0,
  timeRemaining: 0,
  totalTimeRemaining: 0,
  countdownStarted: false,

  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setTotalTimeRemaining: (time) => set({ totalTimeRemaining: time }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setInterview: (interview) => {
    if (interview && interview.questions && interview.questions.length > 0) {
      const totalTime = interview.questions.reduce((acc, q) => acc + (q.timeLimit || 0), 0);
      set({
        interview,
        totalTimeRemaining: totalTime * 60,
        currentQuestionIndex: 0,
        timeRemaining: interview.questions[0].timeLimit * 60,
      });
    } else {
      console.error("Invalid interview data or no questions found.");
      set({ interview: null, totalTimeRemaining: 0, timeRemaining: 0 });
    }
  },
  decrementTime: () => {
    const { timeRemaining, totalTimeRemaining, nextQuestion, setTimeRemaining, setTotalTimeRemaining } = get();

    if (timeRemaining > 0) {
      setTimeRemaining(timeRemaining - 1);
    } else if (timeRemaining === 0) {
      nextQuestion();
    }

    if (totalTimeRemaining > 0) {
      setTotalTimeRemaining(totalTimeRemaining - 1);
    } else {
      console.log("Total interview time is over");
      setTimeRemaining(0);
      setTotalTimeRemaining(0);
    }
  },
  startCountdown: () => {
    if (!get().countdownStarted) {
      set({ countdownStarted: true });
      const interval = setInterval(() => {
        get().decrementTime();
      }, 1000);
      set({ countdownInterval: interval });
    }
  },

  nextQuestion: () => {
    const currentQuestionIndex = get().currentQuestionIndex;
    const interview = get().interview;

    if (interview && currentQuestionIndex < interview.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      set({
        currentQuestionIndex: nextIndex,
        timeRemaining: interview.questions[nextIndex]?.timeLimit * 60 || 120,
      });
    } else {
      console.log("Reached last question or no questions available.");
    }
  },

  // Mülakat bilgilerini backend'den çekme fonksiyonu
  fetchInterview: async (uniqueId) => {
    set({ isLoading: true, error: null });
    try {
      const initialResponse = await axios.get(`http://localhost:5000/api/application/apply/${uniqueId}`);
      const interviewDetails = initialResponse.data;
      const interviewId = interviewDetails?._id;

      if (!interviewId) {
        throw new Error('Interview ID not found in response');
      }

      const questionsResponse = await axios.get(`http://localhost:5000/api/interview/start/${interviewId}`);
      const questions = questionsResponse.data.questions || questionsResponse.data;

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No questions found in this interview');
      }

      set({
        interview: {
          ...interviewDetails,
          questions,
        },
        currentQuestionIndex: 0,
        timeRemaining: questions[0]?.timeLimit * 60 || 120,
        totalTimeRemaining: questions.reduce((acc, q) => acc + (q.timeLimit || 0), 0) * 60,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading interview:', error);
      set({ error: 'Failed to load interview details', isLoading: false });
    }
  },

  // Form verilerini backend'e gönderme fonksiyonu
  submitPersonalInfo: async (formData) => {
    const { interview } = get();
    const { setApplicationId } = useVideoStore.getState(); // setApplicationId fonksiyonunu alıyoruz

    if (!interview?._id) {
      console.error('Mülakat ID bulunamadı');
      set({ error: 'Interview ID is missing' });
      return;
    }

    try {
      set({ isLoading: true });

      const dataToSend = {
        ...formData,
        interviewId: interview._id, // Interview ID ekleniyor
      };

      const response = await axios.post(`http://localhost:5000/api/application/appadd`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const applicationId = response.data.applicationId; // applicationId'yi backend'den alıyoruz

      if (applicationId) {
        setApplicationId(applicationId); // applicationId'yi useVideoStore'a kaydediyoruz
      }

      set({ personalInfoSubmitted: true });
      console.log('Başvuru başarıyla oluşturuldu:', response.data);
    } catch (error) {
      console.error('Başvuru oluşturulamadı:', error);
      set({ error: 'Başvuru oluşturulamadı', isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));