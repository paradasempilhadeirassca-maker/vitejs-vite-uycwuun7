import { query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

// ✅ TIPOS

type Parada = {
  id: string;
  tipoMaquina: string;
  frota: string;
  operador: string;
  motivo: string;
  status: "aberto" | "em_manutencao" | "finalizado";
  dataAbertura: any;
  dataInicio?: any;
  dataFinalizacao?: any;
  descricao?: string;
  pecas?: string;
};

type Preventiva = {
  id: string;
  tipo: string;
  frota: string;
  dataCadastro: any;
};

// ================= APP =================

function App() {
  const [telaAtual, setTelaAtual] = useState("menu");
  const [submenuAtivo, setSubmenuAtivo] = useState<
    "principal" | "corretiva" | "preventiva"|"dashboard"
  >("principal");

  const [mensagem, setMensagem] = useState("");

  const mostrarMensagem = (msg: string) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(""), 3000);
  };

  const containerStyle = { padding: 20 };
  const buttonStyle = { padding: 10, margin: "5px 0", width: "100%" };
  const cardStyle = {
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 10
  };

  // ================= MENU =================
 
  const TelaMenu = () => {
    const menuInterno = submenuAtivo;

    return (
      <div style={{ padding: 30}}>
        <h1>Manutenção Empilhadeiras</h1>

        {menuInterno === "principal" && (
          <>
            <button style={buttonStyle} onClick={() => setTelaAtual("incluirParada")}>
              ➕ Incluir Parada
            </button>

            <button style={buttonStyle} onClick={() => setTelaAtual("maquinasParadas")}>
              🚜 Máquinas Paradas
            </button>

            <button style={buttonStyle} onClick={() => setTelaAtual("historico")}>
              📋 Histórico
            </button>

            <button style={buttonStyle} onClick={() => setSubmenuAtivo("corretiva")}>
              🔧 Manutenção Corretiva
            </button>

            <button style={buttonStyle} onClick={() => setSubmenuAtivo("preventiva")}>
              🛠 Manutenção Preventiva
            </button>

            <button style={buttonStyle} onClick={() => setTelaAtual("dashboard")}>
              📊 Dashboard
            </button>
          </>
        )}

        {menuInterno === "corretiva" && (
          <>
            <button style={buttonStyle} onClick={() => setTelaAtual("iniciarManutencao")}>
              ▶️ Iniciar Manutenção
            </button>

            <button style={buttonStyle} onClick={() => setTelaAtual("finalizarManutencao")}>
              ✅ Finalizar Manutenção
            </button>

            <button style={buttonStyle} onClick={() => setSubmenuAtivo("principal")}>
              🔙 Voltar
            </button>
          </>
        )}

        {menuInterno === "preventiva" && (
          <>
            <button style={buttonStyle} onClick={() => setTelaAtual("cadastrarPreventiva")}>
              ➕ Cadastrar Preventiva
            </button>

            <button style={buttonStyle} onClick={() => setTelaAtual("conferirPreventivas")}>
              📊 Conferir Preventivas
            </button>

            <button style={buttonStyle} onClick={() => setSubmenuAtivo("principal")}>
              🔙 Voltar
            </button>
          </>
        )}
                {menuInterno === "dashboard" && (
          <>
            <button style={buttonStyle} onClick={() => setTelaAtual("Dashboard Geral")}>
            📊 Dashboard Geral
            </button>

            <button style={buttonStyle} onClick={() => setTelaAtual("Dashboard por Frota")}>
            🚜 Dashboard por Frota
            </button>

            <button 
  className="btn-voltar"
  onClick={() => setTelaAtual("menu")}
>
  🔙 Voltar
</button>
          </>
        )}
      </div>
    );
  };

  // ================= INCLUIR PARADA =================

  const TelaIncluirParada = () => {
    const [tipoMaquina, setTipoMaquina] = useState("");
    const [frota, setFrota] = useState("");
    const [operador, setOperador] = useState("");
    const [motivo, setMotivo] = useState("");
    const [mensagem, setMensagem] = useState("");
  
    const maquinas = {
      "Empilhadeira NEQ": ["9100032", "9100054", "9100065", "9100176"],
      "Manipulador NEQ": ["9100071", "9100072"],
      "Empilhadeira SCA": ["8640001"]
    };
  
    const operadores = ["Romário","Rogerio","Ednaldo","Divan","Jaison","Natan"];
  
    const verificarParadaExistente = async (frota: string) => {
      const snap = await getDocs(collection(db, "paradas"));
  
      return snap.docs.some((doc) => {
        const d: any = doc.data();
        return (
          d.frota === frota &&
          (d.status === "aberto" || d.status === "em_manutencao")
        );
      });
    };
  
    const salvar = async () => {
      if (!tipoMaquina || !frota || !operador || !motivo) {
        setMensagem("⚠️ Preencha todos os campos!");
        return;
      }
  
      const existe = await verificarParadaExistente(frota);
  
      if (existe) {
        setMensagem("⚠️ Essa máquina já possui uma parada ativa!");
        return;
      }
  
      await addDoc(collection(db, "paradas"), {
        tipoMaquina,
        frota,
        operador,
        motivo,
        status: "aberto",
        dataAbertura: new Date()
      });
  
      setMensagem("✅ Parada registrada!");
  
      setTipoMaquina("");
      setFrota("");
      setOperador("");
      setMotivo("");
  
      setTimeout(() => setMensagem(""), 3000);
    };
  
    const container = { display: "flex", justifyContent: "center", padding: 15 };
    const wrapper = { width: "100%", maxWidth: 500 };
    const card = {
      width: "100%",
      background: "#fff",
      padding: 15,
      borderRadius: 12,
      boxShadow: "0 0 8px rgba(0,0,0,0.1)"
    };
    const campo = {
      width: "100%",
      padding: 8,
      marginBottom: 8,
      borderRadius: 6,
      border: "1px solid #ccc",
      fontSize: 14
    };
    const botao = {
      width: "100%",
      padding: 8,
      fontSize: 14,
      border: "none",
      borderRadius: 6,
      cursor: "pointer"
    };
  
    return (
      <div style={container}>
        <div style={wrapper}>
          <h2 style={{ textAlign: "center" }}>➕ Incluir Parada</h2>
  
          {mensagem && (
            <div style={{ marginBottom: 10, textAlign: "center" }}>
              {mensagem}
            </div>
          )}
  
          <div style={card}>
            <select style={campo} onChange={(e) => setTipoMaquina(e.target.value)}>
              <option value="">Tipo de máquina</option>
              {Object.keys(maquinas).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
  
            <select style={campo} onChange={(e) => setFrota(e.target.value)}>
              <option value="">Frota</option>
              {(maquinas as any)[tipoMaquina]?.map((f: string) => (
                <option key={f}>{f}</option>
              ))}
            </select>
  
            <select style={campo} onChange={(e) => setOperador(e.target.value)}>
              <option value="">Operador</option>
              {operadores.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
  
            <input
              style={campo}
              placeholder="Motivo da parada"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
  
            <button
              style={{ ...botao, background: "#007bff", color: "#fff" }}
              onClick={salvar}
            >
              💾 Salvar
            </button>
          </div>
  
          <button
            onClick={() => setTelaAtual("menu")}
            style={{ ...botao, background: "#ccc", marginTop: 10 }}
          >
            🔙 Voltar
          </button>
        </div>
      </div>
    );
  };

  // ================= MAQUINAS PARADAS =================

  const TelaMaquinasParadas = () => {
    const [lista, setLista] = useState<any[]>([]);
    const [agora, setAgora] = useState(new Date());
  
    useEffect(() => {
      carregar();
  
      const intervalo = setInterval(() => {
        setAgora(new Date());
      }, 1000);
  
      return () => clearInterval(intervalo);
    }, []);
  
    const carregar = async () => {
      const q = query(
        collection(db, "paradas"),
        where("status", "in", ["aberto", "em_manutencao"])
      );
      
      const snap = await getDocs(q);
      
      const dados = snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
  
      setLista(dados);
    };
  
    const getDate = (data: any) => {
      if (!data) return null;
      if (data.toDate) return data.toDate();
      return new Date(data);
    };
  
    const calcularHoras = (inicio: any, fim: any) => {
      const i = getDate(inicio);
      const f = getDate(fim);
      if (!i || !f) return 0;
      return (f.getTime() - i.getTime()) / 3600000;
    };
  
    const formatarTempoHumano = (horas: number) => {
      const totalMin = Math.floor(horas * 60);
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
  
      if (h === 0) return `há ${m} min`;
      return `há ${h}h ${m}min`;
    };
  
    const formatarData = (data: any) => {
      const d = getDate(data);
      if (!d) return "-";
      return d.toLocaleDateString("pt-BR");
    };
  
    const getCor = (horas: number) => {
      if (horas > 48) return "#ff4d4d";
      if (horas > 24) return "#ffd11a";
      return "#66cc66";
    };
  
    const listaOrdenada = [...lista].sort((a, b) => {
      const tempoA =
        a.status === "aberto"
          ? calcularHoras(a.dataAbertura, agora)
          : calcularHoras(a.dataInicio, agora);
  
      const tempoB =
        b.status === "aberto"
          ? calcularHoras(b.dataAbertura, agora)
          : calcularHoras(b.dataInicio, agora);
  
      return tempoB - tempoA;
    });
  
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
        <div style={{ width: 500 }}>
          <h2 style={{ textAlign: "center" }}>
            🚜 Máquinas Paradas
          </h2>
  
          {listaOrdenada.length === 0 && (
            <p style={{ textAlign: "center" }}>
              Nenhuma máquina parada
            </p>
          )}
  
          {listaOrdenada.map((p) => {
            const tempoEspera =
              p.status === "aberto"
                ? calcularHoras(p.dataAbertura, agora)
                : calcularHoras(p.dataAbertura, p.dataInicio);
  
            const tempoManutencao =
              p.status === "em_manutencao" ||
              p.status === "Em Manutenção"
                ? calcularHoras(p.dataInicio, agora)
                : 0;
  
            const tempoTotal = tempoEspera + tempoManutencao;
  
            const tempoBase =
              p.status === "aberto"
                ? tempoEspera
                : tempoManutencao;
  
            return (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  marginBottom: 12,
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)"
                }}
              >
                {/* 🔥 BARRA LATERAL */}
                <div
                  style={{
                    width: 6,
                    backgroundColor: getCor(tempoBase)
                  }}
                />
  
                {/* CONTEÚDO */}
                <div
                  style={{
                    flex: 1,
                    padding: 15,
                    background: "#fff"
                  }}
                >
                  <p><strong>Tipo:</strong> {p.tipoMaquina}</p>
                  <p><strong>Frota:</strong> {p.frota}</p>
                  <p><strong>Operador:</strong> {p.operador}</p>
  
                  <p><strong>Motivo:</strong> {p.motivo}</p>
                  <p><strong>Abertura:</strong> {formatarData(p.dataAbertura)}</p>
  
                  <p>
                    <strong>Status:</strong>{" "}
                    {p.status === "aberto"
                      ? "🟥 Parada"
                      : "🟨 Em manutenção"}
                  </p>
  
                  <p>⏱ Espera: {formatarTempoHumano(tempoEspera)}</p>
  
                  {tempoManutencao > 0 && (
                    <p>🔧 Manutenção: {formatarTempoHumano(tempoManutencao)}</p>
                  )}
  
                  <p>
                    🧮 <strong>Total:</strong>{" "}
                    {formatarTempoHumano(tempoTotal)}
                  </p>
                </div>
              </div>
            );
          })}
  
          <button
            onClick={() => {
              setSubmenuAtivo("principal");
              setTelaAtual("menu");
            }}
            style={{
              width: "100%",
              padding: 10,
              background: "#ccc",
              border: "none",
              borderRadius: 6
            }}
          >
            🔙 Voltar
          </button>
        </div>
      </div>
    );
  };

// ================= Iniciar Manutenção =================

const TelaIniciar = () => {
  const [lista, setLista] = useState<any[]>([]);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const q = query(
      collection(db, "paradas"),
      where("status", "==", "aberto")
    );
    
    const snap = await getDocs(q);

    const dados = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p: any) => p.status === "aberto");

    setLista(dados);
  };

  const iniciar = async (p: any) => {
    await updateDoc(doc(db, "paradas", p.id), {
      status: "em_manutencao",
      dataInicio: new Date()
    });

    carregar();
  };

  const getDate = (data: any) => {
    if (!data) return null;
    if (data.toDate) return data.toDate();
    return new Date(data);
  };

  const calcularHoras = (inicio: any, fim: any) => {
    const i = getDate(inicio);
    const f = getDate(fim);
    if (!i || !f) return 0;
    return (f.getTime() - i.getTime()) / 3600000;
  };

  const formatarTempo = (h: number) => {
    const m = Math.floor(h * 60);
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    return hh > 0 ? `${hh}h ${mm}min` : `${mm} min`;
  };

  const formatarData = (data: any) => {
    const d = getDate(data);
    return d ? d.toLocaleDateString("pt-BR") : "-";
  };

  const container = { display: "flex", justifyContent: "center", padding: 15 };
  const wrapper = { width: "100%", maxWidth: 500 };
  const card = {
    width: "100%",
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    marginBottom: 10
  };
  const botao = {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
  };

  return (
    <div style={container}>
      <div style={wrapper}>
        <h2 style={{ textAlign: "center" }}>🛠 Iniciar Manutenção</h2>

        {lista.map((p) => {
          const espera = calcularHoras(p.dataAbertura, new Date());

          return (
            <div key={p.id} style={card}>
              <p><strong>{p.tipoMaquina}</strong> - {p.frota}</p>
              <p>Operador: {p.operador}</p>
              <p>Motivo: {p.motivo}</p>

              <p>Abertura: {formatarData(p.dataAbertura)}</p>
              <p>⏱ Espera: {formatarTempo(espera)}</p>

              <button
                style={{ ...botao, background: "#28a745", color: "#fff" }}
                onClick={() => iniciar(p)}
              >
                ▶️ Iniciar
              </button>
            </div>
          );
        })}

        <button
          onClick={() => setTelaAtual("menu")}
          style={{ ...botao, background: "#ccc", marginTop: 5 }}
        >
          🔙 Voltar
        </button>
      </div>
    </div>
  );
};

// ================= FINALIZAR =================

const TelaFinalizarManutencao = () => {
  const [lista, setLista] = useState<any[]>([]);
  const [mensagem, setMensagem] = useState("");

  // estados por item
  const [dadosExtras, setDadosExtras] = useState<any>({});

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const q = query(
      collection(db, "paradas"),
      where("status", "==", "em_manutencao")
    );
    
    const snap = await getDocs(q);

    const dados = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p: any) => p.status === "em_manutencao");

    setLista(dados);
  };

  const atualizarCampo = (id: string, campo: string, valor: any) => {
    setDadosExtras((prev: any) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  const finalizar = async (p: any) => {
    const extra = dadosExtras[p.id] || {};

    if (!extra.descricao) {
      setMensagem("⚠️ Descreva o que foi feito!");
      return;
    }

    if (extra.trocouPeca === "sim" && !extra.pecas) {
      setMensagem("⚠️ Informe as peças trocadas!");
      return;
    }

    await updateDoc(doc(db, "paradas", p.id), {
      status: "finalizado",
      dataFinalizacao: new Date(),
      descricao: extra.descricao,
      trocouPeca: extra.trocouPeca || "não",
      pecas: extra.pecas || ""
    });

    setMensagem("✅ Manutenção finalizada!");
    setDadosExtras({});
    carregar();

    setTimeout(() => setMensagem(""), 3000);
  };

  const getDate = (data: any) => {
    if (!data) return null;
    if (data.toDate) return data.toDate();
    return new Date(data);
  };

  const calcularHoras = (inicio: any, fim: any) => {
    const i = getDate(inicio);
    const f = getDate(fim);
    if (!i || !f) return 0;
    return (f.getTime() - i.getTime()) / 3600000;
  };

  const formatarTempo = (h: number) => {
    const m = Math.floor(h * 60);
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    return hh > 0 ? `${hh}h ${mm}min` : `${mm} min`;
  };

  const formatarData = (data: any) => {
    const d = getDate(data);
    return d ? d.toLocaleDateString("pt-BR") : "-";
  };

  const container = { display: "flex", justifyContent: "center", padding: 15 };
  const wrapper = { width: "100%", maxWidth: 500 };

  const card = {
    width: "100%",
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    marginBottom: 10
  };

  const campo = {
    width: "100%",
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14
  };

  const botao = {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "none",
    cursor: "pointer"
  };

  return (
    <div style={container}>
      <div style={wrapper}>
        <h2 style={{ textAlign: "center" }}>✅ Finalizar Manutenção</h2>

        {mensagem && (
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            {mensagem}
          </div>
        )}

        {lista.map((p) => {
          const espera = calcularHoras(p.dataAbertura, p.dataInicio);
          const manut = calcularHoras(p.dataInicio, new Date());
          const total = espera + manut;

          const extra = dadosExtras[p.id] || {};

          return (
            <div key={p.id} style={card}>
              <p><strong>{p.tipoMaquina}</strong> - {p.frota}</p>
              <p>Operador: {p.operador}</p>
              <p>Motivo: {p.motivo}</p>

              <p>Abertura: {formatarData(p.dataAbertura)}</p>

              <p>⏱ Espera: {formatarTempo(espera)}</p>
              <p>🔧 Manutenção: {formatarTempo(manut)}</p>
              <p>🧮 Total: {formatarTempo(total)}</p>

              {/* DESCRIÇÃO */}
              <textarea
                style={campo}
                placeholder="O que foi feito?"
                value={extra.descricao || ""}
                onChange={(e) =>
                  atualizarCampo(p.id, "descricao", e.target.value)
                }
              />

              {/* TROCA DE PEÇA */}
              <select
                style={campo}
                value={extra.trocouPeca || ""}
                onChange={(e) =>
                  atualizarCampo(p.id, "trocouPeca", e.target.value)
                }
              >
                <option value="">Houve troca de peças?</option>
                <option value="sim">Sim</option>
                <option value="não">Não</option>
              </select>

              {/* PEÇAS */}
              {extra.trocouPeca === "sim" && (
                <input
                  style={campo}
                  placeholder="Quais peças foram trocadas?"
                  value={extra.pecas || ""}
                  onChange={(e) =>
                    atualizarCampo(p.id, "pecas", e.target.value)
                  }
                />
              )}

              <button
                style={{ ...botao, background: "#007bff", color: "#fff" }}
                onClick={() => finalizar(p)}
              >
                ✅ Finalizar
              </button>
            </div>
          );
        })}

        <button
          onClick={() => setTelaAtual("menu")}
          style={{ ...botao, background: "#ccc", marginTop: 5 }}
        >
          🔙 Voltar
        </button>
      </div>
    </div>
  );
};

  // ================= HISTÓRICO =================

  const TelaHistorico = () => {
    const [lista, setLista] = useState<Parada[]>([]);

    useEffect(() => {
      carregar();
    }, []);

    const carregar = async () => {
      const q = query(
        collection(db, "paradas"),
        where("status", "==", "finalizado")
      );
      
      const snap = await getDocs(q);

      const dados = snap.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Parada, "id">)
        }))
        .filter((p) => p.status === "finalizado");

      setLista(dados);
    };

    const getDate = (data: any) => {
      if (!data) return null;
      if (data.toDate) return data.toDate();
      return new Date(data);
    };

    const calcularHoras = (inicio: any, fim: any) => {
      const i = getDate(inicio);
      const f = getDate(fim);
      if (!i || !f) return 0;
      return (f.getTime() - i.getTime()) / 3600000;
    };

    const formatarTempo = (h: number) => {
      const m = Math.floor(h * 60);
      const hh = Math.floor(m / 60);
      const mm = m % 60;
      return hh > 0 ? `${hh}h ${mm}min` : `${mm} min`;
    };

    const formatarData = (data: any) => {
      const d = getDate(data);
      return d ? d.toLocaleDateString("pt-BR") : "-";
    };

    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 15 }}>
        <div style={{ width: "100%", maxWidth: 500 }}>
          <h2 style={{ textAlign: "center" }}>📊 Histórico</h2>

          {lista.map((p) => {
            const espera = calcularHoras(p.dataAbertura, p.dataInicio);
            const manut = calcularHoras(p.dataInicio, p.dataFinalizacao);
            const total = espera + manut;

            return (
              <div key={p.id} style={cardStyle}>
                <p><strong>{p.tipoMaquina}</strong> - {p.frota}</p>
                <p>Operador: {p.operador}</p>
                <p>Motivo: {p.motivo}</p>

                <p>📅 Abertura: {formatarData(p.dataAbertura)}</p>

                <p>⏱ Espera: {formatarTempo(espera)}</p>
                <p>🔧 Manutenção: {formatarTempo(manut)}</p>
                <p>🧮 Total: {formatarTempo(total)}</p>
              </div>
            );
          })}

          <button onClick={() => setTelaAtual("menu")} style={buttonStyle}>
            🔙 Voltar
          </button>
        </div>
      </div>
    );
  };

  // ================= PREVENTIVA =================

  const TelaCadastrarPreventiva = () => {
    const [tipo, setTipo] = useState("");
    const [frota, setFrota] = useState("");

    const salvar = async () => {
      await addDoc(collection(db, "preventivas"), {
        tipo,
        frota,
        dataCadastro: new Date()
      });

      mostrarMensagem("Preventiva cadastrada!");
      setTelaAtual("menu");
    };

    return (
      <div style={containerStyle}>
        <h2>Cadastrar Preventiva</h2>

        <input value={tipo} onChange={(e) => setTipo(e.target.value)} />
        <input value={frota} onChange={(e) => setFrota(e.target.value)} />

        <button onClick={salvar}>Salvar</button>

        <button
          onClick={() => {
            setSubmenuAtivo("preventiva");
            setTelaAtual("menu");
          }}
        >
          Voltar
        </button>
      </div>
    );
  };

  const TelaConferirPreventivas = () => {
    const [lista, setLista] = useState<any[]>([]);

    useEffect(() => {
      carregar();
    }, []);

    const carregar = async () => {
      const snap = await getDocs(collection(db, "preventivas"));
      setLista(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    return (
      <div style={containerStyle}>
        <h2>Conferir Preventivas</h2>

        {lista.map((p) => (
          <div key={p.id} style={cardStyle}>
            <p>{p.tipo}</p>
            <p>{p.frota}</p>
          </div>
        ))}

        <button
          onClick={() => {
            setSubmenuAtivo("preventiva");
            setTelaAtual("menu");
          }}
        >
          Voltar
        </button>
      </div>
    );
  };


// ================= DASHBOARD =================

const TelaDashboard = () => {
  const [lista, setLista] = useState<any[]>([]);
  const [telaInterna, setTelaInterna] = useState<"menu" | "geral" | "frota">("menu");

  const [mes, setMes] = useState("");
  const [frota, setFrota] = useState("");
  const [operador, setOperador] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const snap = await getDocs(collection(db, "paradas"));

    const dados = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p: any) => p.status === "finalizado");

    setLista(dados);
  };

  // ================= UTILS =================

  const getDate = (data: any) => {
    if (!data) return null;
    if (data.toDate) return data.toDate();
    return new Date(data);
  };

  const calcularHoras = (inicio: any, fim: any) => {
    const i = getDate(inicio);
    const f = getDate(fim);
    if (!i || !f) return 0;
    return (f.getTime() - i.getTime()) / 3600000;
  };

  const formatar = (h: number) => {
    const m = Math.floor(h * 60);
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    return hh > 0 ? `${hh}h ${mm}min` : `${mm} min`;
  };

  // ================= LISTAS =================

  const listaFrotas = [...new Set(lista.map((p) => p.frota))];
  const listaOperadores = [...new Set(lista.map((p) => p.operador))];

  // ================= FILTRO =================

  const filtrarDados = (dados: any[]) => {
    return dados.filter((p) => {
      const data = getDate(p.dataAbertura);

      const mesOk =
        !mes || (data && data.getMonth() + 1 === Number(mes));

      const frotaOk = !frota || p.frota === frota;

      const operadorOk =
        !operador || p.operador === operador;

      return mesOk && frotaOk && operadorOk;
    });
  };

  const dadosFiltrados = filtrarDados(lista);

  // ================= MÉTRICAS =================

  const calcularIndicadores = (dados: any[]) => {
    let totalParadas = dados.length;
    let horasParadas = 0;
    let totalManut = 0;

    dados.forEach((p) => {
      const espera = calcularHoras(p.dataAbertura, p.dataInicio);
      const manut = calcularHoras(p.dataInicio, p.dataFinalizacao);

      horasParadas += espera + manut;
      totalManut += manut;
    });

    const horasDisponiveis = 24 * 30;

    const mttr = totalParadas ? totalManut / totalParadas : 0;

    const mtbf = totalParadas
      ? (horasDisponiveis - horasParadas) / totalParadas
      : 0;

    const disponibilidade =
      horasDisponiveis > 0
        ? ((horasDisponiveis - horasParadas) / horasDisponiveis) * 100
        : 0;

    const indisponibilidade = 100 - disponibilidade;

    return {
      totalParadas,
      horasParadas,
      horasDisponiveis,
      mttr,
      mtbf,
      disponibilidade,
      indisponibilidade
    };
  };

  const agruparPorFrota = () => {
    const grupos: any = {};

    dadosFiltrados.forEach((p) => {
      if (!grupos[p.frota]) grupos[p.frota] = [];
      grupos[p.frota].push(p);
    });

    return grupos;
  };


// ================= FILTROS =================

const Filtros = () => {
  return (
    <div className="filtros-container">

      <div className="filtro-item">
        <label>Mês</label>
        <select value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="">Todos</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-item">
        <label>Frota</label>
        <select value={frota} onChange={(e) => setFrota(e.target.value)}>
          <option value="">Todas</option>
          {listaFrotas.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-item">
        <label>Operador</label>
        <select value={operador} onChange={(e) => setOperador(e.target.value)}>
          <option value="">Todos</option>
          {listaOperadores.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn-limpar"
        onClick={() => {
          setMes("");
          setFrota("");
          setOperador("");
        }}
      >
        Limpar
      </button>

    </div>
  );
};

  // ================= MENU =================

  if (telaInterna === "menu") {
    return (
      <div className="container">

        <h1>Manutenção Empilhadeiras</h1>
        <h2>📊 Dashboard</h2>

        <div className="menu">
          <button onClick={() => setTelaInterna("geral")}>
            📊 Geral
          </button>

          <button onClick={() => setTelaInterna("frota")}>
            🚜 Por Frota
          </button>

          <button onClick={() => setTelaAtual("menu")}>
            🔙 Voltar
          </button>
        </div>

      </div>
    );
  }

  // ================= GERAL =================

  if (telaInterna === "geral") {
    const ind = calcularIndicadores(dadosFiltrados);

    return (
      <div className="container">

        <h2>📊 Dashboard Geral</h2>

        <Filtros />

        <div className="cards">

          <div className="card">
            <h4>Total de Paradas</h4>
            <p>{ind.totalParadas}</p>
          </div>

          <div className="card">
            <h4>Horas Paradas</h4>
            <p>{formatar(ind.horasParadas)}</p>
          </div>

          <div className="card">
            <h4>MTTR(tempo medio para reparo)</h4>
            <p>{formatar(ind.mttr)}</p>
          </div>

          <div className="card">
            <h4>MTBF(tempo medio entre falhas)</h4>
            <p>{formatar(ind.mtbf)}</p>
          </div>

          <div className={`card ${
            ind.disponibilidade > 90 ? "ok" :
            ind.disponibilidade > 75 ? "alerta" :
            "critico"
          }`}>
            <h4>Disponibilidade</h4>
            <p>{ind.disponibilidade.toFixed(1)}%</p>
          </div>

        </div>

       <button 
  className="btn-voltar"
  onClick={() => setTelaInterna("menu")}
>
  🔙 Voltar
</button>

      </div>
    );
  }

  // ================= FROTA =================

  if (telaInterna === "frota") {
    const grupos = agruparPorFrota();

    return (
      <div className="container">
        <h2>🚜 Dashboard por Frota</h2>

        <Filtros />

        {Object.entries(grupos).map(([f, dados]: any) => {
          const ind = calcularIndicadores(dados);

          return (
            <div key={f} className="card">
              <h4>🚜 {f}</h4>

              <p>Paradas: {ind.totalParadas}</p>
              <p>Horas: {formatar(ind.horasParadas)}</p>
              <p>Disp: {ind.disponibilidade.toFixed(1)}%</p>
            </div>
          );
        })}

<button 
  className="btn-voltar"
  onClick={() => setTelaInterna("menu")}
>
  🔙 Voltar
</button>

      </div>
    );
  }

  return null;
};

  // ================= RENDER =================

  return (
    <div>
      {mensagem && <div>{mensagem}</div>}

      {telaAtual === "menu" && <TelaMenu />}
      {telaAtual === "incluirParada" && <TelaIncluirParada />}
      {telaAtual === "maquinasParadas" && <TelaMaquinasParadas />}
      {telaAtual === "iniciarManutencao" && <TelaIniciar />}
      {telaAtual === "finalizarManutencao" && <TelaFinalizarManutencao />}
      {telaAtual === "historico" && <TelaHistorico />}
      {telaAtual === "cadastrarPreventiva" && <TelaCadastrarPreventiva />}
      {telaAtual === "conferirPreventivas" && <TelaConferirPreventivas />}
      {telaAtual === "dashboard" && <TelaDashboard />}
    </div>
  );
}

export default App;
