import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { uploadFoto } from "../../firebase/media";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


export function EditSpeaker() {
    //validação yup
    const schema = yup.object().shape({
        fullname: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
        description: yup.string().min(10, 'A descrição deve ter pelo menos 10 caracteres').required(),
        position: yup.string().min(3, 'O cargo/ocupação deve ter pelo menos 3 caracteres').required(),
        company: yup.string().nullable().transform(transformEmptyString),
        education: yup.string().nullable().transform(transformEmptyString),
        avatar: yup.string().nullable().transform(transformEmptyString),
    });
   
   
    const { id } = useParams();
    const navigate = useNavigate();
    const formRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
    const [load, setLoad] = useState(true);

  

    function transformEmptyString(value) {
        if (typeof value === 'string' && value.trim() === '') {
            return null;
        } else if (typeof value === 'string' && value === "[object FileList]") {
            return null;
        }
        return value;
    }

    
    async function onSubmit(data) {
        let img = data.imagem[0];
        await schema.validate(data)
        if (img) {
            const toastId = toast.loading("Upload da imagem...", { position: "top-right" });
            uploadFoto(img, "speaker").then((url) => {
                toast.dismiss(toastId);
                delete data.imagem;
                data.avatar = url;
                put(data)
            })
        }
        else {
            delete data.imagem;
            put(data)
        }
    }


    //edição do palestrante
    function put(data) {
        axios.put(`${process.env.REACT_APP_IP}:3001/speakers/${id}`, data, config)
            .then(response => {
                toast.success("Palestrante editado.", { position: "bottom-right", duration: 2000 });
                navigate("/palestrantes/listar");
            })
    }

    //buscar palestrante
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_IP}:3001/speakers/?id=${id}`, config)
            .then(response => {
                const { fullname, description, position, company, education, avatar
                } = response.data;

                reset({ fullname, description, position, company, education, avatar });
            })

    }, [id, reset])

    return (
        <div>
            <Sidebar />
            <div className="container-speaker">
                <div className="my-auto register-speaker">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <InputDefault
                            placeholder="Nome"
                            type="text"
                            ref={formRef}
                            controlid="nome-cadastro"
                            {...register("fullname")}
                        />
                        {errors?.fullname && (
                            <span className="speaker-span-error">{errors.fullname.message}</span>
                        )}
                        <InputDefault
                            placeholder="Descrição"
                            type="text"
                            ref={formRef}
                            controlid="description"
                            {...register("description")}
                        />
                        {errors?.description && (
                            <span className="speaker-span-error">{errors.description.message}</span>
                        )}
                        <InputDefault
                            placeholder="Cargo"
                            type="text"
                            ref={formRef}
                            controlid="position"
                            {...register("position")}
                        />
                        {errors?.position && (
                            <span className="speaker-span-error">{errors.position.message}</span>
                        )}
                        <InputDefault
                            placeholder="Empresa"
                            type="text"
                            ref={formRef}
                            controlid="company"
                            {...register("company")}
                        />
                        <InputDefault
                            placeholder="Formação Acadêmica"
                            type="text"
                            ref={formRef}
                            controlid="education"
                            {...register("education")}
                        />
                        <div className="mt-4">
                            <InputDefault
                                label="Foto do Palestrante"
                                className="input-form"
                                type="file"
                                ref={formRef}
                                controlid="avatar"
                                {...register("imagem")}
                            />
                        </div>
                        <div className="botao-speaker">
                            <ButtonRadius
                                className="btn rounded-pill bg-success border-success btn-speaker"
                                label="Editar"
                                type="submit"
                            />
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}