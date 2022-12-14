import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./styles.css";
import firebaseDb from "../../config/firebase.js";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MaskedInput from "./MaskedInput";

import { UserContext } from "../../context/UserContext";

const AddEdit = () => {
  const { infosUser } = useContext(UserContext);

  // console.log(infosUser);
  const initialState = {
    name: infosUser.displayName,
    email: infosUser.email,
  };
  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});
  const {
    name,
    email,
    matricula,
    opcaoServicos,
    name2tecnico,
    notaOrdem,
    dataInicio,
    horaInicio,
    dataIntervalo,
    horaIntervalo,
    dataFim,
    horaFim,
    dataLimite,
    codAlimentador,
    codRamal,
    segmentoIndicador,
    statusOrdemExecucao,
    seccionalInspecao,
    equipeExecucao,
    statusExecucao,
    equipamentos,
    materiais,
    situacaoObra,
    imagemAntes,
    imagemDepois,
  } = state;

  const history = useHistory();

  const { id } = useParams();
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
  }, [id]);

  useEffect(() => {
    if (id) {
      setState({ ...data[id] });
    } else {
      setState({ ...initialState });
    }
    return () => {
      setState({ ...initialState });
    };
  }, [id, data]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    // console.log(e.target.value);
    //PEGAR OS LABELS PORÉM NOME DE CHAVE TEM QUE SER JUNTO NO JS
    setState({
      ...state,
      [name]: value,
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleCaptureValueImage = async (e) => {
    let { name } = e.target;

    const base64 = await convertToBase64(e.target.files[0]);
    // console.log(e.target.files[0]);

    setState({
      ...state,
      [name]: base64,
    });
  };

  // const handleInputChangeCheckbox = (e) => {
  //   let { name, checked } = e.target;
  //   console.log({ name, checked })
  //   setState({
  //     ...state,
  //     [name]: checked,
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Forneça um valor no campo nome");
    } else {
      if (!id) {
        // No id mean user is adding record for the first time
        firebaseDb.child("colaboradores").push(state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Colaborador adicionado com sucesso");
          }
        });
      } else {
        firebaseDb.child(`/colaboradores/${id}`).set(state, (err) => {
          if (err) {
            toast.error(err);
          } else {
            toast.success("Colaborador atualizado com sucesso");
          }
        });
      }
      setTimeout(() => history.push("/"), 500);
    }
  };

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div className='add-edit'>
      <form className='add-edit__form' onSubmit={handleSubmit}>
        <section className='containerForms'>
          <div className='infosObraForm'>
            <h2>Cadastrar informações</h2>
            <label htmlFor='name'>Nome do colaborador</label>
            <input
              type='text'
              id='name'
              name='name'
              value={name}
              disabled
              style={{ cursor: "not-allowed" }}
            />

            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={email}
              disabled
              style={{ cursor: "not-allowed" }}
            />

            <label htmlFor='matricula'>Matrícula do colaborador</label>
            <input
              type='text'
              id='matricula'
              name='matricula'
              minLength={5}
              maxLength={7}
              required
              value={matricula}
              onChange={handleInputChange}
              style={{ textTransform: "uppercase" }}
            />

            <label htmlFor='opcaoServicos'>Opção de Serviços</label>
            <select
              name='opcaoServicos'
              id='opcaoServicos'
              value={opcaoServicos}
              onChange={handleInputChange}
            >
              <option value=''>Nenhum</option>
              <option value='Vistoria de danos elétricos'>
                Vistoria de danos elétricos
              </option>
              <option value='Vistoria técnica PV/ST'>
                Vistoria técnica PV/ST
              </option>
              <option value='Inspeção'>Inspeção</option>
              <option value='Vistoria de nível de tensão'>
                Vistoria de nível de tensão
              </option>
              <option value='Coleta de amostral'>Coleta de amostral</option>
              <option value='Atendimento emergencial'>
                Atendimento emergencial
              </option>
              <option value='Acompanhar Obras/Desligamento'>
                Acompanhar Obras/Desligamento
              </option>
              <option value='Manut/Obra Subestação'>
                Manut/Obra Subestação
              </option>
              <option value='Atividade rotina'>Atividade rotina</option>
              <option value='RS1 - Religamento'>RS1 - Religamento</option>
              <option value='Plano Manutenção'>Plano Manutenção</option>
              <option value='Reincidente'>Reincidente</option>
              <option value='Demanda Extra'>Demanda Extra</option>
            </select>

            <label htmlFor='name2tecnico'>Nome do 2° Técnico</label>
            <input
              type='text'
              id='name2tecnico'
              name='name2tecnico'
              value={name2tecnico || ""}
              onChange={handleInputChange}
            />

            <label htmlFor='notaOrdem'>Nota da Ordem</label>
            <input
              type='text'
              id='notaOrdem'
              name='notaOrdem'
              required
              minLength={3}
              maxLength={12}
              value={notaOrdem}
              onChange={handleInputChange}
              style={{ textTransform: "uppercase" }}
            />

            {opcaoServicos === "Inspeção" && (
              <>
                <label htmlFor='codAlimentador'>Alimentador</label>
                <input
                  type='text'
                  id='codAlimentador'
                  name='codAlimentador'
                  minLength={7}
                  maxLength={7}
                  required
                  style={{ textTransform: "uppercase" }}
                  value={codAlimentador || ""}
                  onChange={handleInputChange}
                />

                <label htmlFor='codRamal'>Componente</label>
                <input
                  type='text'
                  id='codRamal'
                  name='codRamal'
                  minLength={7}
                  maxLength={7}
                  value={codRamal || ""}
                  onChange={handleInputChange}
                />
              </>
            )}

            <label htmlFor='imagemAntes'>Imagem Antes do Serviço</label>
            <input
              type='file'
              id='imagemAntes'
              name='imagemAntes'
              onChange={handleCaptureValueImage}
            />
            {imagemAntes && <img src={imagemAntes} className='imagemPreview' />}
            <br />
            <label htmlFor='imagemDepois'>Imagem Depois do Serviço</label>
            <input
              type='file'
              id='imagemDepois'
              name='imagemDepois'
              onChange={handleCaptureValueImage}
            />
            {imagemDepois && (
              <img src={imagemDepois} className='imagemPreview' />
            )}
            <br />

            <Button onClick={handleClickOpen("paper")} variant='contained'>
              Preencher dados da ação
            </Button>

            <Dialog
              open={open}
              onClose={handleClose}
              scroll={scroll}
              aria-labelledby='scroll-dialog-title'
              aria-describedby='scroll-dialog-description'
            >
              <DialogTitle id='scroll-dialog-title'>
                Preencher dados da ação
              </DialogTitle>
              <DialogContent dividers={scroll === "paper"}>
                <label htmlFor='statusExecucao'> Status de Execução</label>
                <select
                  name='statusExecucao'
                  id='statusExecucao'
                  value={statusExecucao}
                  onChange={handleInputChange}
                >
                  <option value=''>Nenhum</option>
                  <option value='Retirada'>Retirada</option>
                  <option value='Acompanhamento'>Acompanhamento</option>
                  <option value='Pendente'>Pendente</option>
                </select>

                <label htmlFor='seccionalInspecao'>Seccional de Inspeção</label>
                <select
                  name='seccionalInspecao'
                  id='seccionalInspecao'
                  value={seccionalInspecao}
                  onChange={handleInputChange}
                >
                  <option value=''>Nenhum</option>
                  <option value='São Luís'>São Luís</option>
                  <option value='Barreirinhas'>Barreirinhas</option>
                  <option value='Rosário'>Rosário</option>
                </select>

                {/* <fieldset>
                  <legend>Elemento da obra</legend>

                  <div>
                    <input
                      type='checkbox'
                      id='alimentador'
                      name='alimentador'
                      value={alimentador || ""}
                      onChange={handleInputChangeCheckbox}
                      className='input-fieldset'
                    />
                    <label htmlFor='alimentador'>Alimentador</label>
                  </div>

                  <div>
                    <input
                      type='checkbox'
                      id='ramal'
                      name='ramal'
                      value={ramal || ""}
                      onChange={handleInputChangeCheckbox}
                      className='input-fieldset'
                    />
                    <label htmlFor='ramal'>Ramal</label>
                  </div>

                  <div>
                    <input
                      type='checkbox'
                      id='baixaTensao'
                      name='baixaTensao'
                      value={baixaTensao || ""}
                      onChange={handleInputChangeCheckbox}
                      className='input-fieldset'
                    />
                    <label htmlFor='baixaTensao'>Baixa Tensão</label>
                  </div>
                </fieldset> */}

                <label htmlFor='equipamentos'>Equipamentos</label>
                <textarea
                  name='equipamentos'
                  id='equipamentos'
                  value={equipamentos}
                  onChange={handleInputChange}
                ></textarea>

                <label htmlFor='materiais'>Materiais</label>
                <textarea
                  name='materiais'
                  id='materiais'
                  value={materiais}
                  onChange={handleInputChange}
                ></textarea>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleClose} variant='contained'>
                  Salvar
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <div className='situacaoObraForm'>
            <h2>Informações da Obra</h2>

            <label htmlFor='situacaoObra'>Situação da obra</label>
            <textarea
              name='situacaoObra'
              id='situacaoObra'
              rows={12}
              spellCheck={true}
              style={{ resize: "none" }}
              value={situacaoObra}
              onChange={handleInputChange}
            ></textarea>

            <label htmlFor='statusOrdemExecucao'>
              Status de Ordem de execução
            </label>
            <select
              name='statusOrdemExecucao'
              id='statusOrdemExecucao'
              value={statusOrdemExecucao}
              onChange={handleInputChange}
            >
              <option value=''>Nenhum</option>
              <option value='Executada'>Executada</option>
              <option value='Não Executada'>Não Executada</option>
            </select>

            <div>
              <label htmlFor='dataLimite'>Prazo do Serviço</label>
              <input
                type='date'
                id='dataLimite'
                name='dataLimite'
                pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                required
                value={dataLimite}
                onChange={handleInputChange}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              <div>
                <label htmlFor='dataInicio'>Data de Início</label>
                <input
                  type='date'
                  id='dataInicio'
                  name='dataInicio'
                  pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                  required
                  value={dataInicio}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor='horaInicio'>Horário de Início</label>
                <input
                  type='time'
                  id='horaInicio'
                  name='horaInicio'
                  pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                  value={horaInicio || ""}
                  onChange={handleInputChange}
                />
              </div>

              {opcaoServicos === "Inspeção" && (
                <>
                  <div>
                    <label htmlFor='dataIntervalo'>Data de Intervalo</label>
                    <input
                      type='date'
                      id='dataIntervalo'
                      name='dataIntervalo'
                      pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                      value={dataIntervalo || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor='horaIntervalo'>Horário de Intervalo</label>
                    <input
                      type='time'
                      id='horaIntervalo'
                      name='horaIntervalo'
                      pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                      value={horaIntervalo || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor='dataFim'>Data de Término</label>
                <input
                  type='date'
                  id='dataFim'
                  name='dataFim'
                  pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                  required
                  value={dataFim}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor='horaFim'>Horário de Término</label>
                <input
                  type='time'
                  id='horaFim'
                  name='horaFim'
                  pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
                  value={horaFim || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </section>

        <input type='submit' value={id ? "Atualizar" : "Cadastrar"} />
      </form>
    </div>
  );
};

export default AddEdit;
