import { Link } from "react-router-dom";
import { Container, Tab, Tabs, Modal } from "react-bootstrap";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { CardPost } from "../../components/CardPost/CardPost";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "../../components/Loader/Loader";
import { format } from "date-fns";
import { ModalPost } from "../../components/ModalPost/ModalPost";
import "./Timeline.scss";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { toast } from "react-hot-toast";

export function Timeline() {
  const { id } = JSON.parse(localStorage.getItem("userInfo"));
  const [posts, setPosts] = useState(null);
  const [postagem, setPostagem] = useState(false);
  const [friendsPosts, setFriendsPosts] = useState(null);
  const [user, setUser] = useState();
  const [showNewPost, setShowNewPost] = useState(false);
  const [showDeleteConfirmation, setShowDelete] = useState(false);
  const [postDelete, setPostDelete] = useState(null);

  function OpenPost(postId) {
    setPostDelete(postId);
    setShowDelete(true);
  }

  function closeDelete() {
    setPostDelete(null);
    setShowDelete(false);
  }

  function openNewPost(user) {
    setUser(user);
    setShowNewPost(true);
  }

  function closeNewPost() {
    setShowNewPost(false);
    setPostagem(true);
  }

  function updateEdit() {
    setPostagem(true);
  }

  function getUser(id) {
    axios
      .get(`${process.env.REACT_APP_IP}:3001/users?id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (id) {
      getUser(id);
    }
  }, [id]);

  function listPosts() {
    //todos os posts
    axios
      .get(`${process.env.REACT_APP_IP}:3001/posts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setPosts(response.data);
        setPostagem(false);
      });
  }

  function listMyPosts() {
    //posts usuario logado
    axios
      .get(`${process.env.REACT_APP_IP}:3001/posts?userId=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setPosts(response.data);
      });
  }

  function listFriendsPosts() {
    //posts amigos de usuario logado
    axios
      .get(`${process.env.REACT_APP_IP}:3001/posts?usuarioLogado=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setFriendsPosts(response.data);
      });
  }

  useEffect(() => {
    listPosts();
    listMyPosts();
    listFriendsPosts();
  }, [postagem]);

  function deleteMyPost(postId) {
    //deletar post de usuario logado
    axios
      .delete(`${process.env.REACT_APP_IP}:3001/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        closeDelete();
        listPosts();
      });
    toast.success("A postagem foi removida.", {
      position: "bottom-right",
      duration: 2500,
    });
  }

  return (
    <div className="timiline-container bg={styles.primary} mb-5">
      <Sidebar />
      <Container className="container-timeline-contents">
        <div className="contents">
          <div className="tabs-container">
            <Tabs
              defaultActiveKey="all"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="all" title="Todos">
                <div className="d-flex justify-content-center mt-5 flex-column align-items-center gap-4">
                  {!posts ? (
                    <Loader />
                  ) : (
                    posts.map((post) => {
                      const myPost = id === post.user.id;
                      const data = new Date(post.date);
                      const dataFormatada = format(data, "dd/MM/yyyy HH:mm");
                      return (
                        <CardPost
                          key={post.id}
                          midia={
                            post.media.length > 0
                              ? post.media.map((e) => e.link)
                              : null
                          }
                          postId={post.id}
                          name={post.user.fullname}
                          nickname={post.profile.nickname}
                          eventName={post.event?.name}
                          message={post.message}
                          datePost={dataFormatada}
                          myPost={myPost}
                          handleDelete={OpenPost}
                          handleEdit={updateEdit}
                          avatar={post.profile.avatar}
                        />
                      );
                    })
                  )}
                </div>
              </Tab>
              <Tab eventKey="my-posts" title="Meus posts">
                <div className="d-flex justify-content-center mt-5 flex-column align-items-center gap-4">
                  {!posts ? (
                    <Loader />
                  ) : (
                    <>
                      {posts.some((post) => id === post.user.id) ? ( //o método some está mapeando uma postagem específica, nesse caso a de usuário logado.
                        posts.map((post) => {
                          const myPost = id === post.user.id;
                          const data = new Date(post.date);
                          const dataFormatada = format(
                            data,
                            "dd/MM/yyyy HH:mm"
                          );
                          if (myPost) {
                            return (
                              <CardPost
                                key={post.id}
                                midia={
                                  post.media.length > 0
                                    ? post.media.map((e) => e.link)
                                    : null
                                }
                                postId={post.id}
                                name={post.user.fullname}
                                nickname={post.profile.nickname}
                                eventName={post.event?.name}
                                message={post.message}
                                datePost={dataFormatada}
                                myPost={myPost}
                                handleDelete={OpenPost}
                                handleEdit={updateEdit}
                                avatar={post.profile.avatar}
                              />
                            );
                          }
                          return null;
                        })
                      ) : (
                        <p>Você não possui postagem.</p>
                      )}
                    </>
                  )}
                </div>
              </Tab>
              <Tab eventKey="friends-posts" title="Amigos">
                <div className="d-flex justify-content-center mt-5 flex-column align-items-center gap-4">
                  {!friendsPosts ? (
                    <Loader />
                  ) : friendsPosts.length === 0 ? (
                    <p>Nenhuma postagem encontrada.</p>
                  ) : (
                    friendsPosts.map((post) => {
                      const data = new Date(post.date);
                      const dataFormatada = format(data, "dd/MM/yyyy HH:mm");
                      return (
                        <CardPost
                          key={post.id}
                          midia={
                            post.media.length > 0
                              ? post.media.map((e) => e.link)
                              : null
                          }
                          name={post.user.fullname}
                          nickname={post.profile.nickname}
                          myPost={id === post.user.id}
                          eventName={post.event?.name}
                          message={post.message}
                          datePost={dataFormatada}
                          avatar={post.profile.avatar}
                        />
                      );
                    })
                  )}
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </Container>
      <Link to>
        <button className="btn-add" onClick={() => openNewPost(user)}>
          +
        </button>
      </Link>
      <div>
        <ModalPost user={user} show={showNewPost} handleClose={closeNewPost} />
      </div>
      <Modal
        show={showDeleteConfirmation}
        onHide={closeDelete}
        centered={true}
        animation={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <p>Excluir postagem?</p>
          </div>
          <div className="d-flex justify-content-center">
            <ButtonRadius
              className="btn rounded-pill bg-success border-success btn-speaker"
              label="Não"
              type="submit"
              onClick={closeDelete}
            />
            <ButtonRadius
              className="btn rounded-pill btn-modal-deletar-sim btn-speaker"
              label="Sim"
              type="submit"
              onClick={() => deleteMyPost(postDelete)}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
