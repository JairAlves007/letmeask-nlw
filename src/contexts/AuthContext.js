import { 
   createContext, 
   useEffect, 
   useState 
} from "react";

import { firebase, auth } from "../services/firebase";

export const AuthContext = createContext({});

export function AuthContextProvider(props) {

   const [user, setUser] = useState();

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {

         if (user) {
            const { displayName, photoURL, uid } = user;

            if (!photoURL || !displayName) {
               throw new Error('Missing Informations From Google Account');
            }

            setUser({
               id: uid,
               name: displayName,
               avatar: photoURL
            });
         }

      });

      return () => {
         unsubscribe();
      }

   }, [])

   async function signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();

      const result = await auth.signInWithPopup(provider);

      if (result.user) {
         const { displayName, photoURL, uid } = result.user;

         if (!displayName || !photoURL) {
            throw new Error('Missing Information From Google Account');
         }

         setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
         })
      }

   }

   return (
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
         {props.children}
      </AuthContext.Provider>
   );
}