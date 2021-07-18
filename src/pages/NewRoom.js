import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useHistory } from 'react-router-dom';
import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';

export function NewRoom(){
   const history = useHistory();

   const { user } = useAuth();
   
   const [ newRoom, setNewRoom ] = useState('');

   async function handleCreateRoom(event) {
      event.preventDefault();

      if (newRoom.trim() === '') {
         return;
      }

      const roomRef = database.ref('rooms');

      const firebaseRoom = roomRef.push({
         title: newRoom,
         authorID: user?.id
      });


      toast.promise(firebaseRoom, {
         loading: "Criando Sala...",
         success: "Sala Criada Com Sucesso!!",
         error: "Erro Ao Criar A Sala!!!"
      })

      history.push(`/admin/${user.id}/rooms/${firebaseRoom.key}`);
   }
   
   return(
      <div id = "page-auth">
         <Toaster />


         <aside>
            <img src = { illustrationImg } alt="Ilustração" />
            <strong>Crie salas de Q&amp;A ao-vivo</strong>
            <p>Tire dúvidas da sua audiência em tempo real</p>
         </aside>
         <main>
            <div className = 'main-content'>
               <img src = { logoImg } alt = "Logo" />
               
               <h1> { user?.name } </h1>

               <h2>Criar uma nova sala</h2>

               <form onSubmit = { handleCreateRoom }>
                  <input 
                     type="text" 
                     placeholder = "Criar uma sala"
                     onChange = { event => setNewRoom( event.target.value ) }
                     value = { newRoom }
                  />

                  <Button type = "submit">
                     Criar Sala
                  </Button>
               </form>

               <p>
                  Quer entrar em uma sala existente? <Link to = "/">clique aqui</Link>
               </p>
            </div>
         </main>
      </div>
   );
}