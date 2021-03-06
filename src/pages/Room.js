import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { database } from '../services/firebase';
import { Question } from '../components/Question';

export function Room() {
   const params = useParams();
   const roomID = params.id;
   const { questions, title } = useRoom(roomID);
   const { user, signInWithGoogle } = useAuth();

   const [newQuestion, setNewQuestion] = useState('');

   async function handleSendQuestion(event) {
      event.preventDefault();

      if (newQuestion.trim() === '') {
         return;
      }

      if (!user) {
         throw new Error('You must be logged in');
      }

      const question = {
         content: newQuestion,
         author: {
            name: user.name,
            avatar: user.avatar
         },
         isHighlighted: false,
         isAnswered: false
      };

      const myPromise = database.ref(`rooms/${roomID}/questions`).push(question);

      toast.promise(myPromise, {
         loading: "Enviando Pergunta...",
         success: "Enviada Com Sucesso!",
         error: "Erro Ao Enviar!!!"
      });

      setNewQuestion('');
   }

   async function handleLikeQuestion(questionID, likeID) {
      if (likeID) {
         await database.ref(`rooms/${roomID}/questions/${questionID}/likes/${likeID}`).remove();
      } else {
         await database.ref(`rooms/${roomID}/questions/${questionID}/likes`).push({
            authorID: user?.id,
         });
      }

   }

   return (
      <div id="page-room">
         <Toaster />
         <header>
            <div className="content">
               <img src={logoImg} alt="Logo" />
               <RoomCode code={roomID} />
            </div>
         </header>

         <main>
            <div className="room-title">
               <h1>Sala {title}</h1>
               {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
            </div>

            <form onSubmit={handleSendQuestion}>
               <textarea
                  placeholder="O que voc?? quer perguntar?"
                  onChange={event => setNewQuestion(event.target.value)}
                  value={newQuestion}
               />

               <div className="form-footer">

                  {
                     user ? (
                        <div className='user-info'>
                           <img
                              src={user.avatar}
                              alt={`Foto De Perfil De ${user.name}`}
                           />
                           <span>{user.name}</span>
                        </div>
                     ) : (
                        <span>Para enviar uma pergunta, <button onClick = { signInWithGoogle }> fa??a seu login  </button>.</span>
                     )
                  }

                  <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
               </div>
            </form>

            <div className="questions-list">
               {
                  questions.map(question => {
                     return (
                        <div key = { question.id }>

                           <Question
                              content={question.content}
                              author={question.author}
                              isHighlighted={question.isHighlighted}
                              isAnswered={question.isAnswered}
                           >
                              {!question.isAnswered && (
                                 <button
                                    className={`like-button ${question.likeID ? 'liked' : ''}`}
                                    type='button'
                                    aria-label='Marcar como gostei'
                                    onClick={() => handleLikeQuestion(question.id, question.likeID)}
                                 >
                                    {question.likeCount > 0 && <span> {question.likeCount} </span>}

                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                 </button>
                              )}
                           </Question>
                           
                           { question.isAnswered && (
                              <div className = 'response'>

                                 <span>Resposta Do Admin</span>

                                 <div className="content-response">
                                    <span>{ question.response }</span>
                                    <span>{ question.dateResponse }</span>
                                 </div>

                                 <div className="user-response-info">
                                    <img
                                       src={ user.avatar }
                                       alt={`Foto De Perfil De ${ user.name }`}
                                    />
                                    <span>{ user.name }</span>
                                 </div>
                              </div>
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