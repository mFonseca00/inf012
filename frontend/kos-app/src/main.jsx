// Seu arquivo main.jsx (provavelmente em src/utils/main.jsx ou src/main.jsx)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Importante
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App"; // 2. Importa o arquivo de rotas que criamos acima
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* 3. O BrowserRouter deve envolver tudo */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
