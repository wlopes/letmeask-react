import { useState, useEffect } from "react";
import { database } from '../services/firebase'
import { ref, onValue } from 'firebase/database'

type Author = {
  name:string;
  avatar: string;
}

type QuestionType = {
  id?:string;
  author:Author;
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

export function useRoom(roomId: string){
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  

  useEffect(()=>{
      const roomRef = ref(database,`rooms/${roomId}`)
      onValue(roomRef, snapshot => {            
          const questionObject: Map<string,QuestionType> = snapshot.val().questions
          const questionData: QuestionType[] = Object.entries(questionObject)
              .map(e => {
                  return {
                      id:e[0],
                      ...e[1]
                  }
              })

          setQuestions(questionData);
          setTitle(snapshot.val().title);
      })
  },[roomId])

  return {questions, title}

}