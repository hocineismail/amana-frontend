import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { onSetUserDetails } from '../features/userSlice';
 
import { db } from '../firebase/firebase';
import { useAppDispatch } from './useReduxHook';
 

export default function useCurrentUser() {
    const dispatch = useAppDispatch()
    const getFullDetails = async () => { 
        let userId = localStorage.getItem("userId") || ""
        const userRef = doc(db, "users", userId?.toString())
        const querySnapshot = await getDoc(userRef);
        const details = querySnapshot.data(); 
        dispatch(onSetUserDetails(details))
      };
  return  {
    
    getFullDetails
  }
}