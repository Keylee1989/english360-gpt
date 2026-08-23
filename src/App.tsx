import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./components/home/HomePage";
import OnboardingPage from "./components/learning/OnboardingPage";
import DailyPlanPage from "./components/learning/DailyPlanPage";
import LessonViewer from "./components/learning/LessonViewer";
import ReviewPage from "./components/learning/ReviewPage";
import ProgressDashboard from "./components/progress/ProgressDashboard";
import LearningReports from "./components/progress/LearningReports";
import ShadowingPracticePage from "./components/practice/ShadowingPracticePage";
import ConversationPracticePage from "./components/practice/ConversationPracticePage";
import PronunciationPracticePage from "./components/practice/PronunciationPracticePage";
import NotFoundPage from "./components/common/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="learn" element={<DailyPlanPage />} />
        <Route path="lesson/:lessonId?" element={<LessonViewer />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="progress" element={<ProgressDashboard />} />
        <Route path="reports" element={<LearningReports currentDay={1} />} />
        <Route path="practice/shadowing" element={<ShadowingPracticePage />} />
        <Route path="practice/conversation" element={<ConversationPracticePage />} />
        <Route path="practice/pronunciation" element={<PronunciationPracticePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
