import '../styles/question.scss';
import cx from 'classnames';

export function Question({
   content,
   author,
   isHighlighted = false,
   isAnswered = false,
   children
}) {
   return(
      <div 
         className = {
            cx(
               'question',
               { answered: isAnswered },
               { highlighted: isHighlighted }
            )
         }
      >
         <p>{ content }</p>

         <footer>
            <div className="user-info">
               <img src = { author.avatar } alt = {`Foto De Perfil De ${ author.name }`} />
               <span>{ author.name }</span>
            </div>
            
            <div>
               { children }
            </div>
         </footer>
      </div>
   );
}