import logoImg from '../../assets/logo.svg';
import { useEffect, useContext } from 'react'; 
import { Container } from '../../components/container';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { auth } from '../../services/firebaseConnection';
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    name: z.string().min(1, 'Campo obrigatório'),
    email: z.string().email('Insira um e-mail válido').min(1, 'O Campo e-mail é obrigatório'),
    password: z.string().min(6, 'A senha deve possuir no minimo 6 caracteres')
});

type FormData = z.infer<typeof schema>

export function Register() {
    const { handleInfoUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors} } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    async function onSubmit(data: FormData) {

        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user) => {
            await updateProfile(user.user, {
                displayName: data.name
            })
            handleInfoUser({
                name: data.name,
                email: data.email,
                uid: user.user.uid
            });
            
            toast.success('Usuario cadastrado com sucesso.');
            navigate('/dashboard', {replace: true});
        })
        .catch((err) => {
            toast.error('Erro ao cadastrar usuario');
            toast.error(err);
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
                            type="text"
                            placeholder="Digite seu nome completo"
                            name="name"
                            error={errors.name?.message}
                            register={register}
                        />
                    </div>

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
                        Cadastrar
                    </button>

                </form>
                
                <Link to='/login' className='italic font-medium underline'>
                    Já possui uma conta ? Faça Login
                </Link>
            </div>
        </Container>
    );
}