import { ReactNode, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface PrivateProps{
    children: ReactNode;
}

export function Private( {children}: PrivateProps ) {
    const { loadingAuth, signed } = useContext(AuthContext);
    

    if(loadingAuth) {
        return <div>Carregando....</div>
    }

    if(!signed) {
        return <Navigate to='/login' />
    }


    return children;

}