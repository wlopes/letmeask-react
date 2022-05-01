import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import {Button} from '../components/Button'

import { AuthContext } from '../contexts/AuthContext';

import '../styles/auth.css'

export function Home(){
    const navigate = useNavigate();
    const {user, signInWithGoogle} = useContext(AuthContext);

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
        
        navigate('/rooms/new')
    }

    return (
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="logotipo LetMeAsk" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="logotipo Google" />
                        Crie sua sala com Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form>
                        <input type="text" placeholder="Digite o código da sala"/>
                        <Button type="submit">Entrar na Sala</Button>
                    </form>
                </div>                
                
            </main>
        </div>
    )
}