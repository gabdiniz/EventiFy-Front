import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Root } from "./pages/Root/Root";
import { Login } from "./pages/Login/Login";
import { Timeline } from "./pages/Timeline/Timeline";
import { SignIn } from "./pages/SignIn/SignIn";
import { RegisterEvent } from "./pages/RegisterEvent/RegisterEvent";
import { Register } from "./pages/Register/Register";
import { AuthProvider } from "./context/AuthContext";
import { Profile } from "./pages/Profile/Profile"
import { Toaster } from "react-hot-toast";
import { Event } from "./pages/Event/Event";
import { ResetPassword } from "./pages/ResetPassword/ResetPassword";
import { RegisterSpeaker } from "./pages/RegisterSpeaker/RegisterSpeaker";
import { Friends } from "./pages/Friends/Friends";
import { Events } from "./pages/Eventos/Events";
import { RegisterTalk } from "./pages/RegisterTalk/RegisterTalk";
import { SuperAdmin } from "./pages/SuperAdmin/SuperAdmin";
import { ListarAdmins } from "./pages/ListarAdmins/ListarAdmins";
import { ListarOrganizadores } from "./pages/ListarOrganizadores/ListarOrganizadores";
import { ListarPalestrantes } from "./pages/ListarPalestrantes/ListarPalestrantes";
import { ControllerSuperAdmins } from "./pages/ControllerSuperAdmins/ControllerSuperAdmins";
import { ControllerOrganizators } from "./pages/ControllerOrganizators/ControllerOrganizators";
import { EditSpeaker } from "./pages/EditSpeaker/EditSpeaker";
import { EditTalk } from "./pages/EditTalk/EditTalk";
import { ListarEventos } from "./pages/ListarEventos/ListarEventos";
import { ListarPalestras } from "./pages/ListarPalestras/ListarPalestras";
import { ValidateRegistration } from "./pages/ValidateRegistration/ValidateRegistration";
import { ControllerAdmins } from "./pages/ControllerAdmins/ControllerAdmins";
import { ListarLocalizacoes } from "./pages/ListarLocalizacoes/ListarLocalizacoes";
import { ValidateEventSpeaker } from "./pages/ValidateEventSpeaker/ValidateEventSpeaker";
import { Participants } from "./pages/Participants/Participants";
import { Messages } from "./pages/Messages/Messages";
import { Ajuda } from "./pages/Ajuda/Ajuda";
import { RegisterOrganizers } from "./pages/RegisterOrganizers/RegisterOrganizers";
import { Agenda } from "./pages/Agenda/Agenda";



function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Register />} />
        <Route path="/recuperar-senha" element={<ResetPassword />} />
        <Route path="/" element={<Root />}>
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/superadmin" element={<ControllerSuperAdmins/>} />
          <Route path="/admin" element={<ControllerAdmins/>} />
          <Route path="/admins/listar" element={<ListarAdmins />} />
          <Route path="/organizador" element={<ControllerOrganizators/>} />
          <Route path="/organizador/registrar" element={<RegisterOrganizers />} />
          <Route path="/organizadores/listar" element={<ListarOrganizadores />} />
          <Route path="/palestrantes/listar" element={<ListarPalestrantes />} />
          <Route path="/localizacoes/listar" element={<ListarLocalizacoes />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/superadmin/cadastros" element={<SuperAdmin />} />
          <Route path="/eventos/:id" element={<Event />} />
          <Route path="/amigos" element={<Friends/>}/>
          <Route path="/evento/cadastrar" element={<RegisterEvent />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/palestrante/registrar" element={<RegisterSpeaker />} />
          <Route path="/palestrante/editar/:id" element={<EditSpeaker />} />
          <Route path="/palestra/registrar" element={<RegisterTalk />} />
          <Route path="/palestra/editar/:id" element={<EditTalk />} />
          <Route path="/eventos/listar" element={<ListarEventos />} />
          <Route path="/palestras/listar" element={<ListarPalestras />} />
          <Route path="/participantes/listar/:id" element={<Participants/>} />
          <Route path="/agenda/:id" element={<Agenda />} />
          <Route path="/cadastros/checkin/:userId/:eventId" element={<ValidateRegistration />} />
          <Route path="/palestrantes/checkin/:speakerId/:eventId" element={<ValidateEventSpeaker/>} />
          <Route path="/ajuda" element={<Ajuda/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster/>
    </AuthProvider>
  );
}

export default App;
