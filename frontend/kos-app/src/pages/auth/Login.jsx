import React, { useState } from "react";
import "./index.css";

function Login() {
  // 2. Criamos as variáveis de estado
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div>
      <form>
        Usuario:{" "}
        <input
          type="text"
          className="textBox"
          name="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        Senha:{" "}
        <input
          type="password"
          className="textBox"
          name="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <input type="button" className="send_button" value={"Enviar"} />
        <br />
      </form>
    </div>
  );
}

export default Login;
