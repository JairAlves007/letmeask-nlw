import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
// import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';

// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { database } from '../services/firebase';

export function AdminRoom(){
   const history = useHistory();
   const params = useParams();
   const roomID = params.id;
   const { questions, title } = useRoom(roomID);

   const [ response, setResponse ] = useState('');
   // const { user } = useAuth();

   async function handleCheckQuestionAsAnswered(questionID){
      await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
         isAnswered: true
      });
   }

   async function handleSendResponse(event, questionID) {
      event.preventDefault();

      if(response.trim() === ''){
         toast.error('Campo Vazio!!!');
         return;
      }

      const date = new Date();
      const dia = date.getDate();
      const mes = date.getUTCMonth();
      const ano = date.getFullYear();

      await database.ref(`rooms/${roomID}/questions/${questionID}/response`).update({
         response: response,
         responsedAt: `${dia}/${mes}/${ano}`
      });

      await handleCheckQuestionAsAnswered(questionID);
   }

   async function handleHighlightQuestion(questionID){
      await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
         isHighlighted: true
      });
   }

   function handleDeleteQuestion(questionID) {
      if(window.confirm('Quer mesmo deletar essa pergunta?')){
         const dbDeleting = database.ref(`rooms/${roomID}/questions/${questionID}`).remove();
         
         toast.promise(dbDeleting, {
            loading: "Deletando Pergunta...",
            success: "Pergunta Deletada!",
            error: "Erro Ao Deletar!!"
         });
      }
   }

   function handleEndRoom() {
      const dbUpdating = database.ref(`rooms/${roomID}`).update({ closedAt: new Date() });
      toast.promise(dbUpdating, {
         loading: "Encerrando Sala...",
         success: "Sala Encerrada!!",
         error: "Erro Ao Encerrar A Sala!!!"
      });
      
      history.push('/');
   }

   function handleGoToUserRoom() {
      history.push(`/rooms/${roomID}`);
   }

   return(
      <div id="page-room">

         <Toaster />

         <header>
            <div className="content">
               <img src = { logoImg } alt = "Logo" />

               <div>
                  <RoomCode code = { roomID } />
                  <Button isOutlined onClick = { handleGoToUserRoom }>Ir À Sala De Usuários</Button>
                  <Button isOutlined onClick = { handleEndRoom }>Encerrar Sala</Button>
               </div>
            </div>
         </header>

         <main>
            <div className="room-title">
               <h1>Sala { title }</h1>
               { questions.length > 0 && <span>{ questions.length } Pergunta(s)</span> }
            </div>

            <div className="questions-list">
               {
                  questions.map(question => {
                     return (

                        <div key = { question.id }>
                           <Question
                              content = { question.content } 
                              author = { question.author }
                              isHighlighted = { question.isHighlighted }
                              isAnswered = { question.isAnswered }
                           >
                              { !question.isAnswered && (
                                 <>
                                    <button
                                       type = 'button'
                                       aria-label = 'Marcar pergunta como respondida'
                                       onClick = { () => handleHighlightQuestion(question.id) }
                                    >
                                       <img src = { checkImg } alt = 'Respondida'/>
                                    </button>

                                    {/* <button
                                       type = 'button'
                                       aria-label = 'Dar destaque à pergunta'
                                       onClick = { () => handleCheckQuestionAsAnswered(question.id) }
                                    >
                                       <img src = { answerImg } alt = 'Destaque'/>
                                    </button> */}
                                 </>
                              )}

                              <button
                                 type = 'button'
                                 aria-label = 'Deletar pergunta'
                                 onClick = { () => handleDeleteQuestion(question.id) }
                              >
                                 <img src = { deleteImg } alt = 'Deletar'/>
                              </button>
                           </Question>
                        
                           { !question.isAnswered && (
                              <form className = 'form' onSubmit = { (event) => handleSendResponse(event, question.id) }>
                                 <input 
                                    type="text"
                                    placeholder = "Responda à esta pergunta..."
                                    onChange = { event => setResponse(event.target.value) }
                                    value = { response }
                                 />
                                 <button type = 'submit'>Responder</button>
                              </form>
                           )}

                        </div>
                     )
                  })
               }
            </div>

         </main>
      </div>
   );
}