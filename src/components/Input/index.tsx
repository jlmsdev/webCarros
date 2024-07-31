import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps{
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({name, placeholder, type, register, rules, error}: InputProps) {
    return(
        <div>
            <input
                placeholder={placeholder}
                type={type}
                {...register(name, rules)}
                id={name}
                className="w-full border-2 rounded-md h-11 px-2"
            />
            {error && <p className="text-red-900 my-2">{error}</p>}
        </div>
    )
}