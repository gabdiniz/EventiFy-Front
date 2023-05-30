import { Card, Modal, Carousel } from "react-bootstrap";
import { Avatar } from "../Ui/Avatar/Avatar";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./CardPost.scss";
import { useState } from "react";
import { ModalEditPost } from "../ModalEditPost/ModalEditPost";

export function CardPost(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [showEditPost, setShowEditPost] = useState(false);

  function openEditPost() {
    setShowEditPost(true);
  }

  function closeEditPost() {
    setShowEditPost(false);
    props.handleEdit();
  }

  return (
    <Card className="card-post" style={{ width: "18rem" }}>
      <div className="card-post-header">
        <Avatar
          className="current-img"
          size={{
            width: 45,
            height: 45,
          }}
          photoURL={props.avatar}
          showDisplayName={true}
          displayName={props.name}
        />
        <div className="card-post-name-nickname">
          <span className="card-post-name">{props.name}</span>
          <span className="card-post-nickname">{props.nickname}</span>
        </div>
        {props.myPost && (
          <div className="card-post-options">


            <button onClick={openEditPost}>
              <FaEdit className="icons-card-post" />
            </button>

            {/* Modal de edição */}
            
            <ModalEditPost post={props} show={showEditPost} handleClose={closeEditPost} />
           

            <button>
              <FaTrash className="icons-card-post" onClick={() => props.handleDelete(props.postId)} />
            </button>
          </div>
        )}
      </div>
      <div className="card-post-thumb-container" onClick={() => setShow(true)}>
        <div className="see-more">Ver mais</div>
        {props.midia && Array.isArray(props.midia) && props.midia.length > 0 ? (
          <>
            <div className="card-post-summary">
              <span className="card-post-summary-description">
                {props.message ? props.message : ""}
              </span>
            </div>
            <Card.Img
              className="card-post-thumb"
              variant="top"
              alt="Thumbnail do post"
              src={props.midia[0]}
            ></Card.Img>
          </>
        ) : (
          <div className="card-post-summary-sem-img">
            <span className="card-post-summary-description-sem-img">
              {props.message ? props.message : "Descrição ..."}
            </span>
          </div>
        )}
        <div className="card-post-thumb-footer">
          {props.eventName ? (
            <h5 className="card-post-title-thumb">{props.eventName}</h5>
          ) : (
            ""
          )}
          <div className="container-date-post">
            <span className="card-post-date-thumb">{props.datePost}</span>
            <span className="card-post-date-thumb">Post criado em : </span>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        className="modal-post-detail"
        centered={true}
      >
        <Modal.Header closeButton>
          <Avatar
            className="current-img"
            size={{
              width: 50,
              height: 50,
            }}
            photoURL={props.avatar}
            showDisplayName={true}
            displayName={props.name}
          />
          <div className="card-post-name-nickname">
            <span className="card-post-name">{props.name}</span>
            <span className="card-post-nickname">{props.nickname}</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          {props.midia &&
            Array.isArray(props.midia) &&
            props.midia.length > 0 ? (
            <Carousel>
              {props.midia.map((url, index) => (
                <Carousel.Item key={index}>
                  <div className="container-img-post-detail">
                    <img src={url} alt={`Imagem ${index + 1}`} />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : null}
          <div className="content-detail-post">
            <div className="content-detail-post-title">
              {props.eventName ? (
                <h5 className="card-post-title-thumb">{props.eventName}</h5>
              ) : (
                ""
              )}
              <div className="container-date-post mb-5">
                <span className="card-post-date-thumb">{props.datePost}</span>
                <span className="card-post-date-thumb">Post criado em : </span>
              </div>
            </div>
            <div className="description-detail-post mt-3">
              <p>
                {props.message ? (
                  props.message
                ) : (
                  <span className="desciption-label">Descrição ...</span>
                )}
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
}
