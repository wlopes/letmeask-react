import { createContext, useState, useEffect, ReactNode } from 'react'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../services/firebase'

type User = {
    id: string;
    avatar: string;
    name: string
}

type AuthContextType = {
    user: User | undefined;  
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps){
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                const {displayName, photoURL, uid} = user
                if(!displayName || !photoURL){
                    throw new Error('Missing Information from Google Account')          
                }else{
                    setUser({
                    id: uid,
                    name:displayName,
                    avatar: photoURL
                    })
                }
            }
        })

        return () => {
            unsubscribe();
        }
    },[])

async function signInWithGoogle(): Promise<void>{
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider)

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if(credential){        
        if(result.user){
            const {displayName, photoURL, uid} = result.user

            if(!displayName || !photoURL){
                throw new Error('Missing Information from Google Account')
            }else{
                setUser({
                    id: uid,
                    name:displayName,
                    avatar: photoURL
                })
            }
        }else{
            throw new Error('Missing User data')
        }
    }else{
        throw new Error('Login failed')
    }
}

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}