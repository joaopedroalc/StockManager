import React, { useState, useEffect, useContext } from "react";
import firebaseDb from "../../config/firebase.js";
import { Link } from "react-router-dom";
import "./styles.css";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import WatchLaterIcon from "@mui/icons-material/WatchLater";

import Tooltip from "@mui/material/Tooltip";

const Home = () => {
  const [data, setData] = useState({});

  const { infosUser } = useContext(UserContext);

  useEffect(() => {
    firebaseDb.child("colaboradores").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({
          ...snapshot.val(),
        });
      } else {
        setData({});
      }
    });

    return () => {
      setData({});
    };
  }, []);

  const onDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir ?")) {
      firebaseDb.child(`colaboradores/${id}`).remove((err) => {
        if (err) {
          console.log(err);
        } else {
          toast.success("Colaborador deletado com sucesso");
        }
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className='home'>
      <div className='sectionRegisterContainer'>
        <div className='sectionRegister'>
          <h2>Gerenciamento de ações</h2>
          <Link to={`/add`}>
            <button className='registrarColaborador'>
              Cadastrar nova ação
            </button>
          </Link>
        </div>
        <input
          type='search'
          placeholder='Buscar por Colaborador ou Nota'
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
      </div>

      <table className='styled-table'>
        <tbody>
          {Object.keys(data)
            .filter((id) => {
              if (searchTerm == "") {
                return data[id];
              } else if (
                data[id].name.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return data[id];
              } else if (
                data[id].notaOrdem
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return data[id];
              }
            })
            .map((id, index) => {
              return (
                <tr key={id}>
                  <td>
                    {data[id].name} | {data[id].dataInicio} |{" "}
                    {data[id].notaOrdem.toUpperCase()}
                  </td>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      {Date.parse(data[id].dataFim) <=
                      Date.parse(data[id].dataLimite) ? (
                        <>
                          <Tooltip title='No prazo'>
                            <WatchLaterIcon color='success' />
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title='Passou do prazo'>
                            <WatchLaterIcon color='error' />
                          </Tooltip>
                        </>
                      )}

                      {data[id].statusExecucao === "Retirada" && (
                        <>
                          <Tooltip title='Retirada'>
                            <AssignmentTurnedInIcon color='success' />
                          </Tooltip>
                        </>
                      )}
                      {data[id].statusExecucao === "Acompanhamento" && (
                        <>
                          <Tooltip title='Acompanhamento'>
                            <HourglassBottomIcon color='primary' />
                          </Tooltip>
                        </>
                      )}

                      {data[id].statusExecucao === "Pendente" && (
                        <>
                          <Tooltip title='Pendente'>
                            <PendingActionsIcon color='warning' />
                          </Tooltip>
                        </>
                      )}
                    </div>

                    <td className='buttonsAction'>
                      {infosUser.email === data[id].email && (
                        <>
                          <Link to={`/update/${id}`}>
                            <button className='btn btn-edit'>Editar</button>
                          </Link>
                          <button
                            className='btn btn-delete'
                            onClick={() => onDelete(id)}
                          >
                            Deletar
                          </button>
                        </>
                      )}
                      <Link to={`/view/${id}`}>
                        <button className='btn btn-view'>
                          Visualizar tudo
                        </button>
                      </Link>
                    </td>
                  </div>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
