import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { Container, Form, Modal, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { BsInfoSquareFill, BsPencil, BsTrash } from "react-icons/bs";
import { Avatar } from "../../components/Ui/Avatar/Avatar";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { useForm } from "react-hook-form";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { useNavigate } from "react-router";
import "./ListarPalestrantes.scss"
import { Loader } from "../../components/Loader/Loader";

export function ListarPalestrantes() {

  const navigate = useNavigate();
  const [load, setLoad] = useState(true);
  const [palestrantes, setPalestrantes] = useState(null);
  const [palestrante, setPalestrante] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    setPalestrante(e)
    reset(e)
  }
  const formRef = useRef(null);
  const { register, reset } = useForm();
  const [acesso, setAcesso] = useState(false);
  const { role } = JSON.parse(localStorage.getItem('userInfo'))
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [page, setPage] = useState(1);//paginação
  const itemsPage = 4;
  const totalPages = palestrantes ? Math.ceil(palestrantes.length / itemsPage) : 0;//disable
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

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      setAcesso((role !== 'superAdmin' && role !== 'admin' && role !== 'organizador') ? false : true);
      listarPalestrantes();
      setLoad(false);
    }, 500);
  }, [role]);

  function listarPalestrantes() {
    axios.get(process.env.REACT_APP_IP+":3001/speakers", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        setPalestrantes(e.data);
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  }

  function onDelete() {
    handleCloseDeleteModal()
    axios.delete(`${process.env.REACT_APP_IP}:3001/speakers/${idDelete}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        listarPalestrantes()
        setIdDelete(null)
        toast.success("O palestrante foi removido.", {
          position: "bottom-right",
          duration: 2500,
        })
      })
      .catch((e) => {
        toast.error(e.response.data.message, { position: "bottom-right", duration: 2500 })
      })
  }

  function onEdit(route) {
    navigate(route)
  }

  return (
    <div>
      <Sidebar />
      <div className="listarPalestrantes-maior d-flex align-items-center justify-content-center">
        <Container className="listarPalestrantes">
          {load ? (
            <Loader />
          ) : (
            <>
              {
                acesso
                  ?
                  <>
                    <button className="btn-add" onClick={() => navigate("/palestrante/registrar")}>+</button>
                    <Table className="table-bordered table-listarPalestrantes mt-5 ">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Nome</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          palestrantes &&
                          pagination(palestrantes, itemsPage, page).map((pal) => {
                            return (
                              <Fragment key={pal.id}>
                                <tr>
                                  <th >ID</th>
                                  <td colSpan={3}>{pal.id}</td>
                                </tr>
                                <tr>
                                  <td></td>
                                  <td>{pal.fullname}</td>
                                  <td className="d-flex justify-content-around">
                                    <BsInfoSquareFill onClick={() => handleShow(pal)} className="icon-listarPalestrante" />
                                    <BsTrash onClick={() => handleShowDeleteModal(pal.id)} className="icon-listarPalestrante" />
                                    <BsPencil onClick={() => onEdit(`/palestrante/editar/${pal.id}`)} className="icon-listarPalestrante" />
                                  </td>
                                </tr>
                              </Fragment>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                    {palestrantes && palestrantes.length >= 5 && (//com essa requisição a paginação só renderiza a prtir de 5 itens...
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
            </>
          )
          }
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 pt-0">
              <Avatar showDisplayName={true} displayName={palestrante?.fullname} photoURL={palestrante?.avatar} size={{ width: 50, height: 50, }} />
              <Form>
                <InputDefault
                  disabled
                  placeholder="Nome"
                  type="text"
                  ref={formRef}
                  controlid="nome-cadastro"
                  {...register("fullname")}
                />
                <Form.Control
                  disabled
                  as="textarea"
                  className=" mb-3"
                  placeholder="Descrição"
                  style={{ height: "100px" }}
                  {...register("description")}
                />
                <InputDefault
                  disabled
                  placeholder="Cargo"
                  type="text"
                  ref={formRef}
                  controlid="position"
                  {...register("position")}
                />
                <InputDefault
                  disabled
                  placeholder="Empresa"
                  type="text"
                  ref={formRef}
                  controlid="company"
                  {...register("company")}
                />
                <InputDefault
                  disabled
                  placeholder="Formação Acadêmica"
                  type="text"
                  ref={formRef}
                  controlid="education"
                  {...register("education")}
                />
                <div className="botao-speaker">
                  <ButtonRadius
                    className="btn rounded-pill bg-success border-success btn-speaker"
                    label="Fechar"
                    type="submit"
                  />
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered={true} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-3">Tem certeza que deseja deletar esse palestrante?</p>
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
  );
}