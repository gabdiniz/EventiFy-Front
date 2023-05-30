import axios from "axios";

export async function getEndereco(cep) {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, {
            timeout: 4000 // Defina o tempo limite em milissegundos (5 segundos neste exemplo)
        });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Tempo limite da solicitação excedido.');
        } 
    }
}