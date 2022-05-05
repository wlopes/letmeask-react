import { useNavigate } from 'react-router-dom';
import { FormEvent, useContext, useState } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import {Button} from '../components/Button'

import { AuthContext } from '../contexts/AuthContext';

import '../styles/auth.css'
import { database } from '../services/firebase';
import { onValue, ref } from 'firebase/database'

export function Home(){
    const navigate = useNavigate();
    const {user, signInWithGoogle} = useContext(AuthContext);
    const [roomName, setRoomName] = useState('')

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
        
        navigate('/rooms/new')
    }

    async function handleRoomEnter(event: FormEvent){
        event.preventDefault();        

        //Not allow empty name
        if(roomName.trim() === ''){
            return;
        }

        const roomRef = await ref(database,`/rooms/${roomName}`)

        onValue(roomRef,(snapshot) => {
            
            const data = snapshot.val()            
            if( data && data.title && data.authorId){
                navigate(`/rooms/${roomName}`)
            }else{
                alert(`Room ${roomName} does not exist`)
            }
            
        })        
        
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
                    <form onSubmit={handleRoomEnter}>
                        <input type="text" placeholder="Digite o código da sala"
                            value={roomName}
                            onChange={event => setRoomName(event.target.value)}
                        />
                        <Button type="submit">Entrar na Sala</Button>
                    </form>
                </div>                
                
            </main>
        </div>
    )
}