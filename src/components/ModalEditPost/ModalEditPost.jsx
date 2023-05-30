import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import axios from "axios";
import { Loader } from "../Loader/Loader";
import { Avatar } from "../Ui/Avatar/Avatar";
import { useForm } from "react-hook-form";
import { ButtonRadius } from "../Ui/ButtoRadius";
import { toast } from "react-hot-toast";


export function ModalEditPost({ post, show, handleClose }) {

    const { register, handleSubmit, reset } = useForm();
    const [load, setLoad] = useState(false);
    const [numCaractere, setNumCaractere] = useState(255);

    //edição do post
    function onSubmit(data) {
        axios.put(`${process.env.REACT_APP_IP}:3001/posts/${post.postId}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then(response => {
                toast.success("Post Editado.", { position: "bottom-right", duration: 2000 });
                handleClose();

            })
            .catch((error) => {
                console.error(error);
            })
    }

    function contadorCaractere(e) {
        setNumCaractere(e.target.value.length)
    }


    //busca de post
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_IP}:3001/posts/?id=${post.postId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then(response => {
                const { message
                } = response.data;

                reset({ message });
            })
            .catch((error) => {
                console.error(error);
            });

    }, [reset]);


    return (
        <>
            {load ? <Loader /> :
                (
                    <Modal centered size="md" show={show} onHide={handleClose}>
                        <Modal.Header>
                            <Avatar
                                className="current-img"
                                size={{
                                    width: 50,
                                    height: 50,
                                }}
                                photoURL={post.avatar}
                                showDisplayName={true}
                                displayName={post.name}
                            />

                            <div className="card-post-name-nickname">
                                <span className="card-post-name">{post.name}</span>
                                <span className="card-post-nickname">{post.nickname}</span>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Edite sua mensagem</Form.Label>
                                    <Form.Control as="textarea" rows={3} {...register("message", { required: "Campo obrigatório." })} onChange={contadorCaractere} />
                                    <div className="d-flex justify-content-end">
                                        <span className={`pe-1 ${255 - numCaractere < 0 && "text-danger border-danger"}`}>{255 - numCaractere}</span>
                                    </div>
                                </Form.Group>
                            </Form>

                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonRadius
                                type="submit"
                                label="Editar"
                                backgroundColor="success"
                                borderColor="#3E1946"
                                textColor="light"
                                boxShadow={true}
                                onClick={handleSubmit(onSubmit)}
                                disabled={numCaractere > 255 ? true : false}
                            />
                        </Modal.Footer>
                    </Modal>
                )
            }
        </>
    );

}
