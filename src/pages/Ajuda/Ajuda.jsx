import { Accordion, Container } from "react-bootstrap";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import "./Ajuda.scss";
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";


export function Ajuda() {

  const [load, setLoad] = useState(true);
  const [acesso, setAcesso] = useState();
  const { role } = JSON.parse(localStorage.getItem('userInfo'))

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      setAcesso((role !== 'superAdmin' && role !== 'admin' && role !== 'organizador') ? false : true);
      setLoad(false);
    }, 500);
  }, [role])

  return (
    <div>
      <Sidebar />
      <div className="ajuda d-flex justify-content-center align-itens-center">
        <Container className="ajuda-container d-flex flex-column justify-content-center">
          {load ? (
            <Loader /> 
          ) : (
            <div>
              <Accordion defaultActiveKey="0">
                {acesso ? (
                  <>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Como acessar o painel de controle?</Accordion.Header>
                      <Accordion.Body>
                        Temos três painéis de controle, para <Link to="/superadmin">SuperAdmins</Link>, <Link to="/admin">Admins</Link> e <Link to="/organizador">Organizadores</Link>.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Como cadastrar um evento?</Accordion.Header>
                      <Accordion.Body>
                        No painel de controle temos acesso ao <Link to="/eventos/listar">controle de eventos</Link> e lá podemos adicionar, editar, listar e excluir.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>Como gerenciar o acesso dos participantes no dia do evento?</Accordion.Header>
                      <Accordion.Body>
                        Ao se registrar no evento, o participante receberá um QR code associado ao evento. Esse QR code pode ser lido no dia do evento para fazer o check-in e comprovar o registro do participante.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>Como funciona o painel de controle?</Accordion.Header>
                      <Accordion.Body>
                        No painel de controle, podemos ver algumas opções. Diferentes níveis de permissão mostram diferentes opções. <br />
                        Lá podemos criar, listar, editar e deletar tudo o que for necessário. Eventos, localizações e muito mais. <br />
                      </Accordion.Body>
                    </Accordion.Item>
                  </>
                ) : (
                  <>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Como editar meus dados?</Accordion.Header>
                      <Accordion.Body>
                        Você pode editar seus dados no seu <Link to="/perfil">perfil</Link>, dados pessoais, foto, bio, etc.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Como me registrar em um evento?</Accordion.Header>
                      <Accordion.Body>
                        Na página de <Link to="/eventos">eventos</Link>, você pode visualizar todos os eventos disponíveis. Para se registrar, basta clicar no evento de seu desejo e realizar a inscrição.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>Como acessar meus QR codes?</Accordion.Header>
                      <Accordion.Body>
                        No seu <Link to="/perfil">perfil</Link>, você pode acessar todos os seus QR codes válidos. Também é possível acessar um QR code específico na página do <Link to="/eventos">evento</Link> a que ele pertence.
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>Como me conectar com outras pessoas?</Accordion.Header>
                      <Accordion.Body>
                        Ao se registrar em um evento, você pode acessar os participantes do evento, pode adicioná-los como amigos e, a partir disso, trocar <Link to="/messages">mensagens</Link> e ver os posts dos seus amigos na <Link to="/timeline">timeline</Link>.
                      </Accordion.Body>
                    </Accordion.Item>
                  </>
                )}
              </Accordion>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}