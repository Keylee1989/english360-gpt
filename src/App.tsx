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
import ReferencePage from "./components/reference/ReferencePage";
import MediaLibraryPage from "./components/resources/MediaLibraryPage";
import LearningResourcesPage from "./components/resources/LearningResourcesPage";
import LevelTestPage from "./components/assessment/LevelTestPage";
import LevelPathPage from "./components/path/LevelPathPage";
import RNGQuizPage from "./components/assessment/RNGQuizPage";
import AISettingsPage from "./components/settings/AISettingsPage";
import PhonicsPage from "./components/phonics/PhonicsPage";
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
        <Route path="reference" element={<ReferencePage />} />
        <Route path="resources" element={<MediaLibraryPage />} />
        <Route path="resources/external" element={<LearningResourcesPage />} />
        <Route path="level-test" element={<LevelTestPage />} />
        <Route path="path" element={<LevelPathPage />} />
        <Route path="quiz" element={<RNGQuizPage />} />
        <Route path="phonics" element={<PhonicsPage />} />
        <Route path="ai-settings" element={<AISettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
