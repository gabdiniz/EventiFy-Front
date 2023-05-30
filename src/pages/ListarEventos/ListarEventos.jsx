import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Container, Form, Modal, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { BsPencil, BsTrash } from "react-icons/bs";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { useForm } from "react-hook-form";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { uploadFoto } from "../../firebase/media";
import "./ListarEventos.scss"
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Loader } from "../../components/Loader/Loader";

export function ListarEventos() {

  const [load, setLoad] = useState(true);
  const [eventos, setEventos] = useState(null);
  const [evento, setEvento] = useState();
  const [acesso, setAcesso] = useState(false);
  const { role } = JSON.parse(localStorage.getItem('userInfo'))
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [locations, setLocations] = useState(null);
  const [organizadores, setOrganizadores] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);//paginação
  const itemsPage = 4;
  const totalPages = eventos ? Math.ceil(eventos.length / itemsPage) : 0;//disable
  const paginationArray = Array.from({ length: totalPages }, (_, index) => index + 1);//paginação condicional

  function pagination(array, page_size, page_number) {//paginação
    const startIndex = (page_number - 1) * page_size;
    return array.slice(startIndex, startIndex + page_size);
  }

  const handleCloseModalDelete = () => setShowModalDelete(false);
  const handleShowModalDelete = (e) => {
    setShowModalDelete(true);
    setEvento(e);
  };
  const handleCloseModalEdit = () => setShowModalEdit(false);
  const handleShowModalEdit = (e) => {
    setShowModalEdit(true);
    e.startDate = format(new Date(e.startDate), "yyyy-MM-dd HH:mm");
    e.endDate = format(new Date(e.endDate), "yyyy-MM-dd HH:mm");
    reset(e)
    setEvento(e);
  };

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      setAcesso((role !== 'superAdmin' && role !== 'admin' && role !== 'organizador') ? false : true);
      listarEventos();
      setLoad(false);
    }, 500);
  }, [role]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_IP+":3001/organizadores", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setOrganizadores(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    axios.get(process.env.REACT_APP_IP+":3001/locations", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  function listarEventos() {
    axios.get(process.env.REACT_APP_IP+":3001/events", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        setEventos(e.data);
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  }

  function onDelete() {
    handleCloseModalDelete()
    axios.delete(`${process.env.REACT_APP_IP}:3001/events/${evento.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        listarEventos()
        setEvento(null)
        toast.success(e.data.message, { position: "bottom-right", duration: 2500 })
      })
      .catch((e) => {
        setEvento(null)
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  }

  function onSubmit(data) {
    let img = data.imagem[0];
    if (img) {
      const toastId = toast.loading("Upload da imagem...", { position: "top-right" });
      uploadFoto(img, "eventos").then((url) => {
        toast.dismiss(toastId);
        delete data.imagem;
        data.header = url;
        post(data)
      })
    }
    else {
      delete data.imagem;
      post(data)
    }
  }

  async function post(data) {
    delete data.id
    delete data.createdAt
    delete data.updatedAt
    delete data.location
    await axios
      .put(`${process.env.REACT_APP_IP}:3001/events/${evento.id}`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        toast.success("Evento editado com sucesso.", {
          position: "bottom-right",
          duration: 2500
        });
        handleCloseModalEdit();
        listarEventos()
      })
      .catch(error => {
        console.log(error)
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500
        });
      });
  }

  return (
    <div>
      <Sidebar />
      <div className="listarEventos-maior d-flex align-items-center justify-content-center">
        {load ? (
          <Loader />
        ) : (
          <Container className="listarEventos">
            {
              acesso
                ?
                <>
                  <button className="btn-add" onClick={() => navigate("/evento/cadastrar")}>+</button>
                  <Table className="table-bordered table-listarEventos mt-1">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nome</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        eventos &&
                        pagination(eventos, itemsPage, page).map((e) => {
                          return (
                            <Fragment key={e.id}>
                              <tr>
                                <th >ID</th>
                                <td colSpan={3}>{e.id}</td>
                              </tr>
                              <tr>
                                <td></td>
                                <td>{e.name}</td>
                                <td className="d-flex justify-content-around gap-4">
                                  <BsTrash onClick={() => handleShowModalDelete(e)} className="icon-listarEventos" />
                                  <BsPencil onClick={() => handleShowModalEdit(e)} className="icon-listarEventos" />
                                </td>
                              </tr>
                            </Fragment>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                  {eventos && eventos.length >= 5 && (//com essa requisição a paginação só renderiza a prtir de 5 itens...
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
          </Container>
        )
        }
      </div>
      <Modal show={showModalDelete} onHide={handleCloseModalDelete} centered={true} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Tem certeza que deseja deletar esse evento?</p>
          <p className="span-modal-deletar-organizador mb-2">*Essa ação não poderá ser desfeita*</p>
          <div className="d-flex justify-content-center">
            <ButtonRadius
              className="btn rounded-pill bg-success border-success btn-speaker mt-4"
              label="Não"
              type="submit"
              onClick={handleCloseModalDelete}
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
      <Modal show={showModalEdit} onHide={handleCloseModalEdit} centered={true} animation={false}>
        <Modal.Header closeButton className="p-0">
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body >
          {
            evento &&
            <div>
              <img src={evento.header} alt="imagem evento" className="modalEditEvent-header rounded" />
              <Form onSubmit={handleSubmit(onSubmit)}>
                <InputDefault
                  placeholder="Nome do Evento"
                  type="text"
                  {...register("name")}
                />
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <InputDefault
                    type="datetime-local"
                    {...register("startDate")}
                  />
                  <InputDefault
                    value={evento.endDate}
                    type="datetime-local"
                    {...register("endDate")}
                  />
                </div>
                <InputDefault
                  className="segmenttInpu"
                  placeholder="Segmento"
                  type="text"
                  {...register("segment")}
                />
                <InputDefault
                  placeholder="Descrição"
                  type="text-area"
                  {...register("description")}
                />
                <div className="mt-4">
                  <Form.Group>
                    <Form.Control {...register("vacancies")}
                      placeholder="vagas"
                      type="number"
                    />
                  </Form.Group>
                </div>
                {organizadores &&
                  <Form.Group className="formStyle">
                    <Form.Label className="txt">Organizador</Form.Label>
                    <Form.Select aria-label="Default select example" {...register("userId")}>
                      {organizadores.map(organizador => (
                        <option key={organizador.id} value={organizador.id}>{organizador.fullname}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                }
                {locations &&
                  <Form.Group className="formStyle">
                    <Form.Label className="txt">Localização</Form.Label>
                    <Form.Select aria-label="Default select example" {...register("locationId")}>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                }
                <InputDefault
                  placeholder="Imagem do Evento"
                  type="file"
                  {...register("imagem")}
                />
                <div className="d-flex justify-content-end me-3 my-2">
                  <ButtonRadius
                    type="submit"
                    label="EDITAR"
                    backgroundColor="success"
                    borderColor="#3E1946"
                    textColor="light"
                    boxShadow={true}
                  />
                </div>
              </Form>
            </div>
          }
        </Modal.Body>
      </Modal>
    </div>
  );
}