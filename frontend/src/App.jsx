import "./App.css";
import AppRoute from "./routes/AppRoute";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { FolderProvider } from "./context/FolderContext";
import { SearchProvider } from "./context/SearchContext";
function App() {
  return (
    <>
      <div>
        <ToastContainer
          position="top-right"
          autoClose="3000"
        />
        <AuthProvider>
          <FolderProvider>
            <SearchProvider>
              <BrowserRouter>
                <AppRoute />
              </BrowserRouter>
            </SearchProvider>
          </FolderProvider>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
