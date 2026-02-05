import Home from "./components/pages/Home";
import { useColors } from "./utils/theme";

const AppContent = () => {
  const colors = useColors();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: colors.neutral900,
      }}
    >
      <Home />
    </div>
  );
};

function App() {
  return (
    <AppContent />
  );
}

export default App;
