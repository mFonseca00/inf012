import React, { useState } from "react";
import "./index.css";

function Home() {
  // 2. Criamos as variáveis de estado
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div>
      <form>
        Usuario:{" "}
        <input
          type="text"
          name="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        Senha:{" "}
        <input
          type="text"
          name="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button>Enviar</button>
        <br />
      </form>
    </div>
  );
}

export default Home;
