import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';
import { toast } from 'react-hot-toast';


export function DashboardHeader() {

    async function deslogarUsuario() {
        await signOut(auth)
        .then(() => {
            toast.success('Até Logo');
        })
        .catch((err) => {
            toast.error(`Algo deu errado ${err}`);
        })
       
    }


    return(
        <div className='w-full items-center flex h-10 bg-red-600 rounded-lg text-white font-medium gap-4 px-4 mb-4'>
            <Link to='/dashboard'>Dashboard</Link>
            <Link to='/dashboard/new'>Cadastrar Carro</Link>
            
            <button className='ml-auto hover:text-black transition-all' onClick={deslogarUsuario}>Deslogar</button>
        </div>
    );
}