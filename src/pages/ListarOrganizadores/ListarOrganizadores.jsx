import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Container, Modal, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { BsTrash } from "react-icons/bs";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import "./ListarOrganizadores.scss"
import { Loader } from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";

export function ListarOrganizadores() {

  const [load, setLoad] = useState(true);
  const [organizadores, setOrganizadores] = useState(null);
  const [idDelete, setIdDelete] = useState();
  const [acesso, setAcesso] = useState(false);
  const navigate = useNavigate();
  const { role } = JSON.parse(localStorage.getItem('userInfo'))
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);//paginação
  const itemsPage = 4;
  const totalPages = organizadores ? Math.ceil(organizadores.length / itemsPage) : 0;//disable
  const paginationArray = Array.from({ length: totalPages }, (_, index) => index + 1);//paginação condicional

  function pagination(array, page_size, page_number) {//paginação
    const startIndex = (page_number - 1) * page_size;
    return array.slice(startIndex, startIndex + page_size);
  }

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setIdDelete(id);
  };

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      setAcesso((role !== 'superAdmin' && role !== 'admin') ? false : true)
      listarOrganizadores()
      setLoad(false);
    }, 500);
  }, [role]);

  function listarOrganizadores() {
    axios.get(process.env.REACT_APP_IP+":3001/organizadores", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        setOrganizadores(e.data);
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  }

  function onDelete() {
    handleClose()
    axios.delete(`${process.env.REACT_APP_IP}:3001/organizadores/${idDelete}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        listarOrganizadores()
        setIdDelete(null)
        toast.success("O organizador foi removido.", {
          position: "bottom-right",
          duration: 2500,
        })
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  }

  return (
    <div>
      <Sidebar />
      <div className="listarOrganizadores-maior d-flex align-items-center justify-content-center">
        {load ? (
          <Loader />
        ) : (
          <Container className="listarOrganizadores">
            {
              acesso
                ?
                <>
                  <button className="btn-add" onClick={() => (role === "superAdmin" ? navigate("/superadmin/cadastros") : navigate("/organizador/registrar"))}>+</button>
                  <Table className="table-bordered table-listarOrganizadores mt-5 ">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nome</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        organizadores &&
                        pagination(organizadores, itemsPage, page).map((org) => {
                          return (
                            <Fragment key={org.id}>
                              <tr>
                                <th ><div className="d-flex justify-content-center align-items-center">ID</div></th>
                                <td colSpan={3}>{org.id}</td>
                              </tr>
                              <tr>
                                <td><div className="d-flex justify-content-center align-items-end"><BsTrash onClick={() => handleShow(org.id)} className="trash-listarOrganizadores" /></div></td>
                                <td>{org.fullname}</td>
                                <td>{org.email}</td>
                              </tr>
                            </Fragment>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                  {organizadores && organizadores.length >= 5 && (//com essa requisição a paginação só renderiza a prtir de 5 itens...
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
        )}
      </div>
      <Modal show={show} onHide={handleClose} centered={true} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Tem certeza que deseja deletar esse organizador?</p>
          <p className="span-modal-deletar-organizador mb-2">*Essa ação não poderá ser desfeita*</p>
          <div className="d-flex justify-content-center">
            <ButtonRadius
              className="btn rounded-pill bg-success border-success btn-speaker mt-4"
              label="Não"
              type="submit"
              onClick={handleClose}
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
  );
}