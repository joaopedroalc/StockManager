/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import firebaseDb from "../../config/firebase.js";
import { useParams, Link, useHistory } from "react-router-dom";
import "./styles.css";

import { PDFExport } from "@progress/kendo-react-pdf";
import { useRef } from "react";
import { Button } from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";

const View = () => {
  const [data, setData] = useState({});

  let currentId = useParams();
  const { id } = currentId;
  const history = useHistory();
  useEffect(() => {
    firebaseDb.child("colaboradores").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({
          ...snapshot.val(),
        });
      } else {
        snapshot({});
      }
    });
  }, [id]);

  const pdfExportComponentAcao = useRef(null);
  const pdfExportComponentRotina = useRef(null);
  const pdfExportComponentNovasAcoes = useRef(null);

  const exportPDFWithComponentAcao = () => {
    if (pdfExportComponentAcao.current) {
      pdfExportComponentAcao.current.save();
    }
  };

  const exportPDFWithComponentRotina = () => {
    if (pdfExportComponentRotina.current) {
      pdfExportComponentRotina.current.save();
    }
  };

  const exportPDFWithComponentNovasAcoes = () => {
    if (pdfExportComponentNovasAcoes.current) {
      pdfExportComponentNovasAcoes.current.save();
    }
  };

  return (
    <div className='container mt-5'>
      {Object.keys(data).map((userId) => {
        if (userId === id) {
          return (
            <div key={userId} className='view'>
              <div className='col-2'>
                <div className='card'>
                  <div className='card-header'>
                    <h2>Detalhes da Ação</h2>
                  </div>

                  <div className='container-colaborador'>
                    <PDFExport
                      ref={pdfExportComponentAcao}
                      paperSize='auto'
                      margin={40}
                      fileName={`Ação ${data[id].name} - ${data[id].dataInicio}`}
                      author='joaopedrocode'
                    >
                      <div className='container-items'>
                        {/* {
                    Object.keys(data[id]).map((item) => {
                      return <div>
                        <h3>{item.toUpperCase()}: </h3>
                        <span>{data[id][item].toString()}</span>
                      </div>
                    })
                  } */}
                        <div className='dadosPessoais'>
                          <h2>Dados pessoais</h2>
                          <div>
                            <h3>Nome </h3>
                            <p>{data[id].name}</p>
                          </div>
                          <div>
                            <h3>Matrícula </h3>
                            <p>{data[id].matricula.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className='dadosConsulta'>
                          <h2>Dados da ação</h2>
                          <div className='colThree'>
                            <div>
                              <div>
                                <h3>Nota Ordem </h3>
                                <p>{data[id].notaOrdem.toUpperCase()}</p>
                              </div>
                              <div>
                                <h3>Opção de Serviço</h3>
                                <p>{data[id].opcaoServicos}</p>
                              </div>
                              <div>
                                <h3>Data/Horário de Início</h3>
                                <p>
                                  {data[id].dataInicio} | {data[id].horaInicio}
                                </p>
                                <h3>Data/Horário de Término</h3>
                                <p>
                                  {data[id].dataFim} | {data[id].horaFim}
                                </p>
                                <h3>Prazo de Serviço</h3>
                                <p>{data[id].dataLimite}</p>
                              </div>

                              {data[id].opcaoServicos === "Inspeção" && (
                                <>
                                  <div>
                                    <h3>Alimentador </h3>
                                    <p>
                                      {data[id].codAlimentador.toUpperCase()}
                                    </p>
                                  </div>
                                  <div>
                                    <h3>Ramal</h3>
                                    <p>{data[id].codRamal?.toUpperCase()}</p>
                                  </div>
                                </>
                              )}
                            </div>
                            <div>
                              <div>
                                <h3>Status de Execução</h3>
                                <p>{data[id].statusExecucao}</p>
                              </div>
                              <div>
                                <h3>Status de Ordem de Execução</h3>
                                <p>{data[id].statusOrdemExecucao}</p>
                              </div>
                              <div>
                                <h3>Seccional de Inspeção</h3>
                                <p>{data[id].seccionalInspecao}</p>
                              </div>
                              <div>
                                <h3>Nome do 2° Técnico</h3>
                                <p>{data[id].name2tecnico}</p>
                              </div>
                            </div>
                            <div>
                              <div>
                                <h3>Equipamentos</h3>
                                <p>{data[id].equipamentos}</p>
                              </div>
                              <div>
                                <h3>Materiais</h3>
                                <p>{data[id].materiais}</p>
                              </div>
                            </div>
                          </div>

                          <br />

                          <div>
                            <h3>Situação da Obra</h3>
                            <p>{data[id].situacaoObra}</p>
                          </div>
                          <br />
                          <div className='imagensContainer'>
                            <div>
                              <h3>Imagem antes do Serviço</h3>
                              <br />
                              <img
                                src={data[id].imagemAntes}
                                className='imagemView'
                              />
                            </div>

                            <div>
                              <h3>Imagem depois do Serviço</h3>
                              <br />
                              <img
                                src={data[id].imagemDepois}
                                className='imagemView'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </PDFExport>

                    <Button
                      onClick={exportPDFWithComponentAcao}
                      className='button-download'
                      variant='contained'
                    >
                      Imprimir Ação
                      <PrintIcon />
                    </Button>
                  </div>
                </div>
              </div>

              <Link to='/'>
                <Button
                  variant='outlined'
                  style={{ display: "block", margin: "1rem auto" }}
                  onClick={() => history.push("/")}
                >
                  Voltar
                </Button>
              </Link>
            </div>
          );
        }
      })}
    </div>
  );
};

export default View;
