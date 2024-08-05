import logoImg from '../../assets/logo.svg';
import { useEffect } from 'react';
import { Container } from '../../components/container';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { auth } from '../../services/firebaseConnection';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    email: z.string().email('Insira um e-mail válido').min(1, 'O Campo e-mail é obrigatório'),
    password: z.string().min(1, 'O Campo senha é obrigatório')
});

type FormData = z.infer<typeof schema>

export function Login() {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors} } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    function onSubmit(data: FormData) {
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
            navigate('/dashboard', {replace: true});
            toast.success('Bem vindo!');
        })
    }

    useEffect(() => {
        function deslogar() {
            signOut(auth);
            console.log('Deslogado');
        }
        deslogar();
    }, [])


    return(
        <Container>
            <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
                <Link to='/' className='mb-6 max-w-sm w-full'>
                    <img 
                    src={logoImg} 
                    alt='Logo Empresa Carro'
                    className='w-full'
                    />
                </Link>

                <form className='bg-white max-w-xl w-full rounded-lg p-4'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='mb-3'>
                        <Input 
                            type="email"
                            placeholder="Digite seu e-mail"
                            name="email"
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                    <div className='mb-3'>
                        <Input 
                            type="password"
                            placeholder="Digite sua senha"
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>

                    <button type='submit' className='bg-zinc-400 w-full rounded-md text-white h-10 font-medium'>
                        Acessar
                    </button>

                </form>

                <Link to='/register' className='italic font-medium'>
                    Não possui uma conta ? Cadastre-se
                </Link>

                <Link to='/' className='italic font-medium border border-slate-700 rounded-md py-1 px-3 hover:bg-slate-500 hover:text-white hover:border-0 transition-all'>
                    Veja os Anunciados
                </Link>
            </div>
        </Container>
    );
}