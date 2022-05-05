import { useState, useContext, FormEvent } from 'react'
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { AuthContext } from '../contexts/AuthContext'

import { database } from '../services/firebase'

import '../styles/room.css'
import { ref, push } from 'firebase/database'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'

type RoomParams = {
    id:string;
  }

export function Room(){
    const {user} = useContext(AuthContext);
    
    const [newQuestion, setNewQuestion] = useState('');
    const roomId = useParams<RoomParams>().id;
    const {questions, title} = useRoom(roomId as string)    
    
    async function handleSendQuestion(event: FormEvent){        
        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted:false,
            isAnswered: false
        }        

        const collectionRef = ref(database, `rooms/${roomId}/questions`)
        await push(collectionRef, question)

        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="header-content">
                    <img src={logoImg} alt="logo Letmeask" />
                    <RoomCode code={roomId || ''} />
                </div>
            </header>
            <main className="room-content">
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length > 0 && (<span>{questions.length} pergunta(s)</span>)}                    
                </div>
                
                <form onSubmit={handleSendQuestion}>
                    <textarea placeholder="O que você deseja perguntar?" 
                    value={newQuestion}
                    onChange={event => setNewQuestion(event.target.value)}
                    />                

                    <div className="form-footer">
                        { user ? 
                        (
                            <div className='user-info'>
                                <img src={user.avatar} alt="user.name"/>
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )
                        
                        }
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form>

                <div className="question-list">
                    {questions.map(q => {
                        return (
                            <Question key={q.id} 
                            content={q.content} author={q.author} 
                            />
                        )
                    })}
                </div>                
            </main>
        </div>
    )
}