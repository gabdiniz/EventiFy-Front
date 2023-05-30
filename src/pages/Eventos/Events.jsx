import { Container } from "react-bootstrap";
import { CardEvent } from "../../components/CardEvent/CardEvent";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { InputDefault } from "../../components/Ui/FormGroup/InputDefault";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker'; //local
import ptBR from 'date-fns/locale/pt-BR'; //idioma
import "./Events.scss";
import { ButtonRadius } from "../../components/Ui/ButtoRadius";
import { Loader } from "../../components/Loader/Loader";


export function Events() {
  const [eventos, setEventos] = useState(null);
  const [buscarEvento, setBuscarEvento] = useState(null);
  const [date, setDate] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setLoad(true);

    setTimeout(() => {
      setLoad(false);
    }, 500);
  }, []);


  function findEvent(busca) {
    const resultado = [];
    eventos?.map((e) => {
      let indice = e.name.toLowerCase().indexOf(busca.target.value.toLowerCase())
      if (indice !== -1) {
        resultado.push(e);
      }
      return null;
    })
    setBuscarEvento(resultado)
  }

  useEffect(() => {
    axios.get(process.env.REACT_APP_IP+":3001/events", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((e) => {
        setEventos(e.data);
      })
  }, [])

  const filterEventDate = (date) => {
    setDate(date);
    if (date) {
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const filterEvent = eventos?.filter(
        (e) =>
          new Date(e.startDate) <= endOfDay && startOfDay <= new Date(e.endDate)
      );

      setBuscarEvento(filterEvent);
    } else {
      setBuscarEvento(null);
    }
  };

  registerLocale('pt-BR', ptBR);

  return (
    <div>
      <Sidebar />
      {load ? (
        <Loader />
      ) : (
        <Container
          className="d-flex flex-column align-items-center container-eventos gap-4"
          fluid="sm"
        >
          <div className="fixed-datepicker me-auto">
            <DatePicker
              isClearable
              className="react-datepicker react-datepicker__day--selected react-datepicker__header"
              selected={date}
              onChange={(date) => filterEventDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione uma data"
              locale="pt-BR"
            />
          </div>
          <div className="w-100 cards-event-eventos flex-column">

            <div>
              <InputDefault
                placeholder="Digite o nome do evento"
                onChange={findEvent}
                type="text"
                size="lg"
              />
            </div>
            <div className="mt-5">
              {eventos && (buscarEvento ? buscarEvento : eventos).length === 0 ? (
                <span>Nenhum evento encontrado, tente uma nova busca.</span>
              ) : (
                (buscarEvento ? buscarEvento : eventos)?.map((e) => (
                  <Link to={`/eventos/${e.id}`} key={e.id}>
                    <CardEvent
                      className="mb-3 card-event-eventos mt-5"
                      title={e.name}
                      location={`${e?.location?.cidade} - ${e?.location?.uf}`}
                      startDate={new Date(e.startDate).toLocaleDateString()}
                      endDate={new Date(e.endDate).toLocaleDateString()}
                      image={e.header}
                    />
                  </Link>
                ))
              )}
            </div>
          </div>
        </Container>
      )}

    </div>
  );
}
