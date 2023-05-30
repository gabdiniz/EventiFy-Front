import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Container, Modal, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { BsInfoSquareFill, BsPencil, BsTrash } from "react-icons/bs";
import "./ListarLocalizacoes.scss"
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { Loader } from "../../components/Loader/Loader";
import { ModalEditLocation } from "../../components/ModalEditLocation/ModalEditLocation";
import { ModalCadastroLocation } from "../../components/ModalCadastroLocation/ModalCadastroLocation";

export function ListarLocalizacoes() {

  const [locations, setLocations] = useState(null);
  const [acesso, setAcesso] = useState(false);
  const { role } = JSON.parse(localStorage.getItem('userInfo'));
  //deletar localização
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState(null);
  const [load, setLoad] = useState(true);
  const [showEditLocation, setShowEditLocation] = useState(false);
  const [editouLocation, setEditouLocation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);//paginação
  const itemsPage = 4;
  const totalPages = locations ? Math.ceil(locations.length / itemsPage) : 0;//disable
  const paginationArray = Array.from({ length: totalPages }, (_, index) => index + 1);//paginação condicional

  function pagination(array, page_size, page_number) {//paginação
    const startIndex = (page_number - 1) * page_size;
    return array.slice(startIndex, startIndex + page_size);
  }

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setAcesso((role !== 'superAdmin' && role !== 'admin' && role !== 'organizador') ? false : true);
      listarLocalizacoes();
      setLoad(false);
    }, 500);
  }, [role, editouLocation]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleClose = () =>
    setShow(false);
  const handleShow = (loc) => {
    setShow(true);
    setLocation(loc);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  function handleShowDeleteModal(id) {
    setShowDeleteModal(true);
    setIdDelete(id);
  };

  function onDelete() {
    handleCloseDeleteModal()
    axios.delete(`${process.env.REACT_APP_IP}:3001/locations/${idDelete}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        listarLocalizacoes();
        toast.success("A localização foi removida.", {
          position: "bottom-right",
          duration: 2500,
        })
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  };

  function listarLocalizacoes() {
    axios.get(process.env.REACT_APP_IP+":3001/locations", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        setLocations(e.data);
        setEditouLocation(false);
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  };

  function openEditLocation(loc) {
    setLocation(loc);
    setShowEditLocation(true);
  }

  function closeEditLocation() {
    setEditouLocation(true);
    setShowEditLocation(false);
  }

  return (
    <div>
      <Sidebar />
      <div className="listarLocalizacoes-maior d-flex align-items-center justify-content-center">
        {load ? (
          <Loader />
        ) : (
          <Container className="listarLocalizacoes">
            {
              acesso
                ?
                <>
                  <button className="btn-add" onClick={handleShowModal}>+</button>
                  <ModalCadastroLocation 
                  show={showModal} 
                  handleClose={() => setShowModal(false)} 
                  tonavigate="/localizacoes/listar"
                  listarLocalizacoes={listarLocalizacoes}
                  />
                  <Table className="table-bordered table-listarLocalizacoes mt-5 ">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nome</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        locations &&
                        pagination(locations, itemsPage, page).map((loc) => {
                          return (
                            <Fragment key={loc.id}>
                              <tr>
                                <th ><div className="d-flex justify-content-center align-items-center">ID</div></th>
                                <td colSpan={3}>{loc.id}</td>
                              </tr>
                              <tr>
                                <td></td>
                                <td>{loc.name}</td>
                                <td className="d-flex justify-content-around">
                                  <BsInfoSquareFill className="icon-listarPalestrante" onClick={() => handleShow(loc)} />
                                  <BsTrash className="icon-listarPalestrante" onClick={() => handleShowDeleteModal(loc.id)} />
                                  <BsPencil className="icon-listarPalestrante" onClick={() => openEditLocation(loc)} />
                                </td>
                              </tr>
                            </Fragment>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                  {locations && locations.length >= 5 && (//com essa requisição a paginação só renderiza a prtir de 5 itens...
                    <div className="d-flex justify-content-around">
                      <button className="arrow-left"
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
                      <button className="arrow-right"
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
        )}
      </div>
      {/* Modal inf. de localização */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <div className="info-evento d-flex justify-content-center">
            <div className="d-flex justify-content-center py-3">
              <h3 className="m-0">{location?.name}</h3>
            </div>
            <span className="mb-1"> <strong>Cep: </strong>{location?.cep}</span>
            <span className="mb-1"> <strong>UF: </strong>{location?.uf}</span>
            <span className="mb-1"> <strong>Cidade: </strong>{location?.cidade}</span>
            <span className="mb-1"> <strong>Bairro: </strong>{location?.bairro}</span>
            <span className="mb-1"> <strong>Endereço: </strong>{location?.endereco}</span>
            <span className="mb-1"> <strong>Complemento: </strong>{location?.complemento}</span>
          </div>
        </Modal.Body>
      </Modal>
      {/* Modal de deletar localização */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered={true} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Tem certeza que deseja deletar essa localização?</p>
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
      {/* Modal de editar localização */}
      <ModalEditLocation
        loc={location}
        show={showEditLocation}
        handleClose={closeEditLocation} />
    </div>
  );
}