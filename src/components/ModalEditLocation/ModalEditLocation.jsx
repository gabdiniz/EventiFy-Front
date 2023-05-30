import { Form, Modal } from "react-bootstrap";
import { InputDefault } from "../Ui/FormGroup/InputDefault";
import { ButtonRadius } from "../Ui/ButtoRadius";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { listaCidades, listaCidadesByUF, listaEstados } from "../../apis/IBGE";
import { getEndereco } from "../../apis/ViaCep";
import { Loader } from "../Loader/Loader";
import { toast } from "react-hot-toast";
import { FcSearch } from "react-icons/fc"
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function ModalEditLocation({ loc, show, handleClose }) {
    const schemaLocation = yup.object().shape({
        cep: yup
            .string()
            .required("Campo é obrigatório")
            .matches(/^\d{5}-\d{3}$/, "O Cep deve conter 8 dígitos"),
        uf: yup.string().required("Campo é obrigatório"),
        cidade: yup.string().required("Campo é obrigatório"),
        bairro: yup.string().required("Campo é obrigatório"),
        endereco: yup.string().required("Campo é obrigatório"),
        name: yup.string().required("Campo é obrigatório"),
        complemento: yup.string().nullable().transform(transformEmptyString),
    });

    function transformEmptyString(value) { // função que retorna null em campo opicional não preenchido
        if (value) {
            if (typeof value === 'string' && value.trim() === '') {
                return null;
            } else {
                return value;
            }
        }
    }

    const [ufs, setUFs] = useState(null);
    const [cidades, setCidades] = useState(null);
    const [cep, setCep] = useState(null);
    const [showCidades, setShowCidades] = useState(null);
    const [submitted, setSubmitted] = useState(false);


    const formLocation = useForm({ resolver: yupResolver(schemaLocation), defaultValues: { uf: "" } });
    const cepPesquisado = formLocation.watch("cep");
    const ufSelecionada = formLocation.watch("uf");
    const navigate = useNavigate();

    async function listaUf() { // função que lista todas as UFs
        listaEstados().then(response => {
            setUFs(response.data);
        });
    }

    async function listaLocalidades() { // função que lista todos os municipios brasileiros
        listaCidades().then(response => {
            setCidades(response.data);
        });
    }

    function filtrarByUf(e) { // função que lista as cidades com base na UF
        listaCidadesByUF(e).then(response => {
            setCidades(response.data);
            setCep(null);
            setShowCidades(true);
            formLocation.setValue("cep", "")
            formLocation.setValue("bairro", "")
            formLocation.setValue("endereco", "")
            formLocation.setValue("complemento", "")
        })
    }

    function pesquisarCep() {
        setCep(cepPesquisado);
    }

    async function getEnderecoByCep(data) {
        if (data.length !== 9) { // verifica se todos os dígitos foram informados.
            toast.error("Informe os 8 digítos do CEP", {
                position: "top-right",
                duration: 3500
            });
            return;
        }

        getEndereco(data)
            .then((res) => {
                if (res.erro) {
                    toast.error(`O Cep: ${cep} não foi encontrado`, {
                        position: "top-right",
                        duration: 3500
                    });
                    return;
                }
                const endereco = {
                    uf: res.uf,
                    cidade: res.localidade,
                    bairro: res.bairro,
                    endereco: res.logradouro,
                    complemento: res.complemento,
                    cep: res.cep,
                };
                setShowCidades(true);
                formLocation.reset(endereco);
            })
            .catch((error) => {
                toast.error(error.message, {
                    position: "top-right",
                    duration: 3500
                });
            });
    }

    useEffect(() => {
        listaUf();
        listaLocalidades();
    }, []);

    useEffect(() => {
        formLocation.reset(loc);
    }, [loc]);

    useEffect(() => {
        if (cep) {
            listaLocalidades();
            getEnderecoByCep(cepPesquisado);
        }
    }, [cep, ufSelecionada]);

    useEffect(() => {
        if (submitted) {
            setSubmitted(false);
            handleClose();
            navigate("/localizacoes/listar", { state: { editouLocation: true } });
        }
    }, [submitted, formLocation]);


    async function onLocation(data) {
        const dataValid = await schemaLocation.validate(data);
        await axios.put(`${process.env.REACT_APP_IP}:3001/locations/${loc.id}`, dataValid, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((response) => {
            toast.success("Localização editada com sucesso.", {
                position: "bottom-right",
                duration: 2500,
            });
            setCep(null);
        }).catch((error) => {
            console.error(error);
            toast.error(error.response.data.message, {
                position: "bottom-right",
                duration: 2500,
            });
        }).finally(() => {
            setSubmitted(true);
        });
    }

    return (
      <Modal size="lg" className="" show={show} onHide={handleClose} centered>
        <div className="container">
          {!ufs || !cidades ? (
            <Loader />
          ) : (
            <Form
              autoComplete="off"
              onSubmit={formLocation.handleSubmit(onLocation)}
            >
              <div>
                <InputDefault
                  placeholder="Nome do espaço"
                  type="text"
                  {...formLocation.register("name")}
                />
                <span style={{ color: "red", fontSize: "small" }}>
                  {formLocation.formState.errors.name?.message}
                </span>

                <div className="input-group formStyle">
                  <span className="input-group-text" id="basic-addon1">
                    <FcSearch onClick={() => pesquisarCep()} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cep"
                    aria-label="cep"
                    {...formLocation.register("cep", {
                      required: "Campo é obrigatório",
                      pattern: {
                        value: /^\d{5}-\d{3}$/,
                        message: "O Cep deve conter 8 dígitos",
                      },
                    })}
                    onChange={(e) => {
                      const maskedCep = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8)
                        .replace(/(\d{5})(\d)/, "$1-$2");
                      formLocation.setValue("cep", maskedCep);
                    }}
                  />
                </div>
                <span style={{ color: "red", fontSize: "small" }}>
                  {formLocation.formState.errors.cep?.message}
                </span>

                <Form.Group className="formStyle">
                  <Form.Label className="txt">UF</Form.Label>
                  <Form.Select
                    {...formLocation.register("uf")}
                    id="uf"
                    onChange={(e) => filtrarByUf(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {ufs.map((uf) => (
                      <option key={uf.id} value={uf.sigla}>
                        {uf.sigla}
                      </option>
                    ))}
                  </Form.Select>
                  <span style={{ color: "red", fontSize: "small" }}>
                    {formLocation.formState.errors.uf?.message}
                  </span>
                </Form.Group>

                <Form.Group className="formStyle">
                  <Form.Label className="txt">Cidade</Form.Label>
                  <Form.Select {...formLocation.register("cidade")} id="cidade">
                    <option value="" disabled>
                      Selecione
                    </option>
                    {cidades.map((cidade) => (
                      <option key={cidade.id} value={cidade.nome}>
                        {cidade.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <span style={{ color: "red", fontSize: "small" }}>
                  {formLocation.formState.errors.cidade?.message}
                </span>

                <InputDefault
                  placeholder="Bairro"
                  type="text"
                  {...formLocation.register("bairro")}
                />
                <span style={{ color: "red", fontSize: "small" }}>
                  {formLocation.formState.errors.bairro?.message}
                </span>

                <InputDefault
                  placeholder="Endereço"
                  type="text"
                  {...formLocation.register("endereco")}
                />
                <span style={{ color: "red", fontSize: "small" }}>
                  {formLocation.formState.errors.endereco?.message}
                </span>

                <InputDefault
                  placeholder="Complemento"
                  type="text"
                  {...formLocation.register("complemento")}
                />
              </div>
              <Modal.Footer className="footer-btn-modal-post">
                <ButtonRadius
                  label="Cancelar"
                  backgroundColor="transparent"
                  borderColor="primary"
                  textColor="primary"
                  boxShadow={true}
                  onClick={handleClose}
                />
                <ButtonRadius
                  type="submit"
                  label="Editar"
                  backgroundColor="success"
                  borderColor="#3E1946"
                  textColor="light"
                  boxShadow={true}
                />
              </Modal.Footer>
            </Form>
          )}
        </div>
      </Modal>
    );
}