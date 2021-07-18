import toast from 'react-hot-toast';
import copyImg from '../assets/images/copy.svg';
import '../styles/roomCode.scss';

export function RoomCode(props) {

   function copyRoomCodeToClipBoard() {
      navigator.clipboard.writeText(props.code);
      toast.success('Código Da Sala Copiado!');
   }

   return(
      <div className = "room-code" onClick = { copyRoomCodeToClipBoard }>
         <div>
            <img src = { copyImg } alt = "Copy" />
         </div>
         <span>
            Sala #{ props.code }
         </span>
      </div>
   );
}