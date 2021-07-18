import { useState, useEffect } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useRoom(roomID) {
   const { user } = useAuth();
   const [ questions, setQuestions ] = useState([]);
   const [ title, setTitle ] = useState('');

   useEffect(() => {
      const roomRef = database.ref(`rooms/${roomID}`);
      
      roomRef.on('value', room => {
         const databaseRoom = room.val();
         const firebaseQuestions = databaseRoom.questions ?? {};

         const parsedQuestions = Object.entries(firebaseQuestions).map(([ key, value ]) => {
            return {
               id: key,
               content: value.content,
               author: value.author,
               isHighlighted: value.isHighlighted,
               isAnswered: value.isAnswered,
               likeCount: Object.values(value.likes ?? {}).length,
               likeID: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorID === user?.id)?.[0],
               response: value.response?.response,
               dateResponse: value.response?.responsedAt
            }
         });

         setTitle(databaseRoom.title);
         setQuestions(parsedQuestions);
      });

      return () => {
         roomRef.off('value');
      }
   }, [roomID, user?.id]);

   return {
      questions,
      title
   }
}