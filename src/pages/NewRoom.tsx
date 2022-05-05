import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import {Button} from '../components/Button'
import {Link, useNavigate} from 'react-router-dom'

import { useContext, useState, FormEvent } from 'react'
import { AuthContext } from '../contexts/AuthContext';

import { database } from '../services/firebase'
import { push, ref } from "firebase/database";


import '../styles/auth.css'

export function NewRoom(){
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const [newRoomName, setNewRoomName] = useState('')

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();

        //Not allow empty name
        if(newRoomName.trim() === ''){
            return;
        }
        
        const roomRef = await push(ref(database, `rooms/`),{
            title:newRoomName,
            authorId:user?.id
        })        

        navigate(`../rooms/${roomRef.key}`)
        
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
                    <h1>Olá {user?.name}</h1>
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input type="text" placeholder="Nome da Sala"
                            value={newRoomName}
                            onChange = {event => setNewRoomName(event.target.value)}
                        />
                        <Button type="submit">Criar Sala</Button>
                    </form>
                    <p className="existent-room-p">Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                </div>                
                
            </main>
        </div>
    )
}