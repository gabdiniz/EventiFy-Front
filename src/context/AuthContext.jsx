import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { createContext, useState } from 'react';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    //cria-se um estado de autenticação do token
    const [authToken, setAuthToken] = useState(null);

    //dentro dessa função eu pego o token, decodifico ele com jwtDecode e armazeno ele em localStorage
    const userLogin = async (data) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_IP}:3001/auth/login`, data);
            const token = response.data.token;
            const decodedToken = jwtDecode(token);

            localStorage.setItem('token', token);
            //aqui ele vai pegar essas informaçãoes e retornar como um objeto
            localStorage.setItem('userInfo', JSON.stringify(decodedToken));

            setAuthToken(token);
            return null;
        } catch (error) {
            return error;
        }
    };
    // aqui nessa função iremos limpar o token do estado e do localStorage
    const userLogout = () => {
        
        setAuthToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
    };

    const updateUser = () => {
        
        const { id } = JSON.parse(localStorage.getItem('userInfo'))
        
        axios.get(`${process.env.REACT_APP_IP}:3001/users/?id=${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((user) => {

        const info = {
          nome: user.data.fullname,
          apelido: user.data.profile.nickname,
          avatar: user.data.profile.avatar
        }

        setUser(info);
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-right",
          duration: 2500
        }); 
      }) 
    };




    return (
        //dentro desse provider, eu passo em value o estado de autenticação do 
        //token, a função que iremos pegar o usuário e guardar no localStorage
        //e a que iremos setar esse estado
        //Dentro dessa tag eu passo o children, que também é passado como
        //parâmetro da função userLogin, pois vou passar para todos componentes filhos
        <AuthContext.Provider value={{ authToken, userLogin, userLogout, updateUser, user }}>
            {children}
        </AuthContext.Provider>
    );
}