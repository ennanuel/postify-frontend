import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../utils/auth';
import './register.scss';

const Register = () => {
  const navigate = useNavigate()
  const [{ username, email, name, password, confirm_password }, setCredentials] = useState({ username: '', email: '', name: '', password: '', confirm_password: '' })
  const [{ failed, key, message }, setError] = useState<{ failed: Boolean; key: undefined | string; message: undefined | string; }>({ failed: false, key: '', message: '' })

  const handleChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setCredentials(prev => ({ ...prev, [event.target.name]: event.target.value }));
    if (failed && key === event.target.name) clearMessage();
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    register({ username, email, name, password, confirm_password })
      .then(handleSuccess)
      .catch(setError);
  }
  function handleSuccess() {
    clearMessage();
    navigate('/login');
  }
  function clearMessage() { setError({ failed: false, key: undefined, message: undefined }) };

  return (
    <section className="register p-4 bg-purple-100 flex items-center justify-center min-h-[100vh]">
      <div className="card max-w-[400px] w-full p-4 flex flex-col gap-4 rounded-lg bg-white overflow-hidden shadow-lg shadow-purple-400/50">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-bold text-xl text-purple-900">Postify</h2>
          <h1 className="text-purple-800 font-bold text-3xl">Register</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-[3px]">
            <input name="name" value={name} onChange={handleChange} type="name" placeholder="firstname lastname" className={`${failed && key === 'name' && 'failed'}`} />
            {failed && key === 'name' && <p className="px-2 text-red-600 text-xs">{message}</p>}
          </div>
          <div className="flex flex-col gap-[3px]">
            <input name="username" value={username} onChange={handleChange} type="text" placeholder="username" className={`${failed && key === 'username' && 'failed'}`} />
            {failed && key === 'username' && <p className="px-2 text-red-600 text-xs">{message}</p>}
          </div>
          <div className="flex flex-col gap-[3px]">
            <input name="email" value={email} onChange={handleChange} type="email" placeholder="email" className={`${failed && key === 'email' && 'failed'}`} />
            {failed && key === 'email' && <p className="px-2 text-red-600 text-xs">{message}</p>}
          </div>
          <div className="flex flex-col gap-[3px]">
            <input name="password" value={password} onChange={handleChange} type="password" placeholder="password" className={`${failed && key === 'password' && 'failed'}`} />
            {failed && key === 'password' && <p className="px-2 text-red-600 text-xs">{message}</p>}
          </div>
          <div className="flex flex-col gap-[3px]">
            <input name="confirm_password" value={confirm_password} onChange={handleChange} type="password" placeholder="confirm password" className={`${failed && key === 'confirm_password' && 'failed'}`} />
            {failed && key === 'confirm_password' && <p className="px-2  text-red-600 text-xs">{message}</p>}
          </div>
          <button
            className="register-btn mt-2"
          >
            Register
          </button>
        </form>
        <p className="">
          <span className="text-xs semibold text-gray-500 mr-1">Already have an account?</span>
          <Link
            to="/login"
            className="link-to-login"
          >Login</Link>
        </p>
      </div>
    </section>
  )
}

export default Register
