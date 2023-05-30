import { Container, Modal, Table, FormSelect } from "react-bootstrap";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BsPencil, BsTrash, BsInfoSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { Loader } from "../../components/Loader/Loader";
import "./ListarPalestras.scss"
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { format } from "date-fns";

export function ListarPalestras() {

  const navigate = useNavigate();
  const [acesso, setAcesso] = useState(false);
  const [palestra, setPalestra] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState('');
  const [palestraSelecionada, setPalestraSelecionada] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [load, setLoad] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [page, setPage] = useState(1);//paginação
  const itemsPage = 4;
  const totalPages = palestra ? Math.ceil(palestra.length / itemsPage) : 0;//disable
  const paginationArray = Array.from({ length: totalPages }, (_, index) => index + 1);//paginação condicional

  function pagination(array, page_size, page_number) {//paginação
    const startIndex = (page_number - 1) * page_size;
    return array.slice(startIndex, startIndex + page_size);
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  function handleShowDeleteModal(id) {
    setShowDeleteModal(true);
    setIdDelete(id);
  }

  const [show, setShow] = useState(false);

  const { role } = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      setAcesso((role !== 'superAdmin' && role !== 'admin' && role !== 'organizador') ? false : true);
      listarEventos();
      setLoad(false);
    }, 500);
  }, [role]);

  useEffect(() => {
    listarPalestras();
  }, [eventoSelecionado]);

  useEffect(() => {
    if (eventos !== null && palestra !== null) {
    }
  }, [eventos, palestra])

  async function listarEventos() {
    await axios.get(process.env.REACT_APP_IP+":3001/events", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((response) => {
        setEventos(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500
        });
      });
  }

  async function listarPalestras() {
    await axios.get(process.env.REACT_APP_IP+":3001/talks", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((response) => {
        const palestrasTotais = response.data;

        if (eventoSelecionado) {
          const palestrasFiltradas = palestrasTotais.filter((palestra) => palestra.eventId === (eventoSelecionado));
          setPalestra([...palestrasFiltradas]);
        } else {
          setPalestra([...palestrasTotais]);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500
        });
      });
  }

  function onDelete() {
    handleCloseDeleteModal()
    axios.delete(`${process.env.REACT_APP_IP}:3001/talks/${idDelete}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        listarPalestras()
        toast.success("A palestra foi removido.", {
          position: "bottom-right",
          duration: 2500,
        })
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  }

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    setPalestraSelecionada(e);
  }

  function onEdit(route) {
    navigate(route)
  }

  return (
    <div>
      <Sidebar />
      <div className="listarTalk-container d-flex align-items-center justify-content-center">
        <Container className="listarTalk">
          {load ? (
            <Loader />
          ) : (
            <>
              {acesso
                ?
                <> <div className="listarTalkDiv">
                  <FormSelect
                    value={eventoSelecionado}
                    onChange={(e) => setEventoSelecionado(e.target.value)}
                  >
                    <option value="">Selecione um evento</option>
                    {eventos && eventos.map((evento) => (
                      <option key={evento.id} value={evento.id}>{evento.name}</option>
                    ))}
                    <option></option>
                  </FormSelect>
                  <button className="btn-add" onClick={() => navigate("/palestra/registrar")}>+</button>
                  <Table className="table-bordered table-listarTalk mt-5 ">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        palestra &&
                        pagination(palestra, itemsPage, page).map((talk) => {
                          return (
                            <Fragment key={talk.id}>
                              <tr>
                                <td>{talk.name}</td>
                                <td className="d-flex justify-content-around">
                                  <BsInfoSquareFill onClick={() => handleShow(talk)} className="icon-listarTalk" />
                                  <BsTrash onClick={() => handleShowDeleteModal(talk.id)} className="icon-listarTalk" />
                                  <BsPencil onClick={() => onEdit(`/palestra/editar/${talk.id}`)} className="icon-listarTalk" /></td>
                              </tr>
                            </Fragment>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                  {palestra && palestra.length >= 5 && (//com essa requisição a paginação só renderiza a prtir de 5 itens...
                    <div className="d-flex justify-content-around">
                      <button class="arrow-left"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1} >
                      </button>
                      <div>
                        {page > 3 && (//condicional de paginação
                          <>
                            <button className="page-number" onClick={() => setPage(1)}>
                              1
                            </button>
                            <span className="ellipsis">...</span>
                          </>
                        )}
                        {paginationArray
                          .slice(Math.max(page - 3, 0), Math.min(page + 2, totalPages))
                          .map((pageNumber) => (
                            <button
                              key={pageNumber}
                              className={`page-number ${pageNumber === page ? "active" : ""}`}
                              onClick={() => setPage(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          ))}
                        {page < totalPages - 3 && (//condicional de paginação
                          <>
                            <span className="ellipsis">...</span>
                            <button className="page-number" onClick={() => setPage(totalPages)}>
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      <button class="arrow-right"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}>
                      </button>
                    </div>
                  )}
                </div>
                </>
                :
                <div>
                  <Container className="m-auto">
                    <div>
                      <h5>Acesso negado. Você não possui permissão para acessar esta página.</h5>
                    </div>
                  </Container>
                </div>
              }
            </>
          )}
        </Container>
        {/*MODAIS DE EDIÇÃO E DELEÇÃO */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Body>
            <div className="info-evento d-flex justify-content-center">
              <div className="d-flex justify-content-center py-3">
                <h3 className="m-0">{palestraSelecionada?.name}</h3>
              </div>
              <strong className="mb-1">Data de Início</strong>
              <span className="mb-2">{palestraSelecionada?.startDate &&
                format(new Date(palestraSelecionada.startDate), "dd/MM/yyyy HH:mm")}</span>
              <strong className="mb-1">Data de Término</strong>
              <span className="mb-2">{palestraSelecionada?.endDate &&
                format(new Date(palestraSelecionada.endDate), "dd/MM/yyyy HH:mm")}</span>
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered={true} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-3">Tem certeza que deseja deletar esse palestra?</p>
            <p className="span-modal-deletar-organizador mb-2">*Essa ação não poderá ser desfeita*</p>
            <div className="d-flex justify-content-center">
              <ButtonRadius
                className="btn rounded-pill bg-success border-success btn-speaker mt-4"
                label="Não"
                type="submit"
                onClick={handleCloseDeleteModal}
              />
              <ButtonRadius
                className="btn rounded-pill btn-modal-deletar-sim btn-speaker mt-4"
                label="Sim"
                type="submit"
                onClick={onDelete}
              />
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}