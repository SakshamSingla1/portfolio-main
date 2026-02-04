import Home from "./components/pages/Home";
import ContactUs from "./components/pages/ContactUs.page";
import { useColors } from "./utils/theme";

const AppContent = () => {
  const colors = useColors();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: colors.neutral50,
      }}
    >
      <Home />
      <ContactUs />
    </div>
  );
};

function App() {
  return (
    <AppContent />
  );
}

export default App;
