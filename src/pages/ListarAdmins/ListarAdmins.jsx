import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Container, Modal, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { BsTrash } from "react-icons/bs";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import "./ListarAdmins.scss";
import { Loader } from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";

export function ListarAdmins() {
  const [admins, setAdmins] = useState(null);
  const [idDelete, setIdDelete] = useState();
  const [superAdmin, setSuperAdmin] = useState(false);
  const { role } = JSON.parse(localStorage.getItem('userInfo'));
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);//paginação
  const itemsPage = 4;
  const totalPages = admins ? Math.ceil(admins.length / itemsPage) : 0;//disable
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
      setSuperAdmin((role !== 'superAdmin') ? false : true);
      listarAdmins();
      setLoad(false);
    }, 500);
  }, [role]);

  function listarAdmins() {
    axios.get(process.env.REACT_APP_IP+":3001/admins", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        setAdmins(e.data);
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 });
      });
  }

  function onDelete() {
    handleClose();
    axios.delete(`${process.env.REACT_APP_IP}:3001/admins/${idDelete}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        listarAdmins();
        setIdDelete(null);
        toast.success("O administrador foi removido.", {
          position: "bottom-right",
          duration: 2500,
        });
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 });
      });
  }

  return (
    <div>
      <Sidebar />
      <div className="listarAdmins-maior d-flex align-items-center justify-content-center">
        <Container className="listarAdmins">
          {load ? (
            <Loader />
          ) : superAdmin ? (
            <>
              <button className="btn-add" onClick={() => navigate("/superadmin/cadastros")}>+</button>
              <Table className="table-bordered table-listarAdmins mt-5">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nome</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {admins &&
                    pagination(admins, itemsPage, page).map((adm) => {
                      return (
                        <Fragment key={adm.id}>
                          <tr>
                            <th>
                              <div className="d-flex justify-content-center align-items-center">ID</div>
                            </th>
                            <td colSpan={3}>{adm.id}</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex justify-content-center align-items-end">
                                <BsTrash onClick={() => handleShow(adm.id)} className="trash-listarOrganizadores" />
                              </div>
                            </td>
                            <td>{adm.fullname}</td>
                            <td>{adm.email}</td>
                          </tr>
                        </Fragment>
                      );
                    })}
                </tbody>
              </Table>
              {admins && admins.length >= 5 && (//com essa requisição a paginação só renderiza a prtir de 5 itens...
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
          ) : (
            <div>
              <Container className="m-auto">
                <div>
                  <h5>Acesso negado. Você não possui permissão para acessar esta página.</h5>
                </div>
              </Container>
            </div>
          )}
        </Container>
      </div>
      <Modal show={show} onHide={handleClose} centered={true} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Tem certeza que deseja deletar esse administrador?</p>
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
