import { useState, useEffect } from 'react'
import  {app}  from '../firebase//firebase';
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged, reload }   from "firebase/auth" 


const formatAuthUser = (user: any) => ({
  uid: user.uid,
  email: user.email
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [currentUser, setcurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: any) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return;
    }

    setLoading(true)
    var formattedUser: any = formatAuthUser(authState);
    setAuthUser(formattedUser);    
    setLoading(false);
  };

// listen for Firebase state change
  useEffect(() => {
    let auth = getAuth(app)
    const unsubscribe = auth.onAuthStateChanged(authStateChanged); 
    onAuthStateChanged(auth, (user) => {
      
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
         
        setcurrentUser(user)
        // ...
        //conso 
      } else {
        // User is signed out
        signout()
        clear()
        // ...
      }
    });
    return () => unsubscribe();
  }, []);
  const clear = () => {
    setcurrentUser(null);
    setAuthUser(null);
    setLoading(true);
    localStorage.removeItem("isAuth");
    location.reload();

  };


  const signInWithEmailAndPassword = (email: string, password: string) =>{
  let auth = getAuth(app)
   signInWithEmailAndPassword(email, password);}

  const createUserWithEmailAndPassword = (email: string, password: string) =>{
    let auth = getAuth(app)
     createUserWithEmailAndPassword(email, password);
}
  const signout = () =>{
    let auth = getAuth(app)
     signOut(auth)
     clear(); 

    }

 

  return {
    currentUser,
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signout
  };
}