import { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { login } from '../../utils/auth';
import './login.scss';


const Login = () => {
  const { logUserIn } = useContext(AuthContext);

  const [{ username, password }, setCredentials] = useState({ username: '', password: '' });
  const [{ failed, message }, setError] = useState<{ failed: Boolean; message: undefined | string; }>({ failed: false, message: '' });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError({ failed: false, message: '' });
  };
  const handleSubmit : React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    login({ username, password })
      .then(logUserIn)
      .catch((error) => setError(error));
  }

  return (
    <div className="login p-4 bg-blue-100 flex items-center justify-center min-h-[100vh]">
      <div className="card max-w-[400px] w-full p-4 flex flex-col gap-4 rounded-lg bg-white overflow-hidden shadow-lg shadow-blue-400/50">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-bold text-xl text-blue-900">Postify</h2>
          <h1 className="text-blue-800 font-bold text-3xl">Login</h1>
        </div>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="username" value={username} onChange={handleChange} />
          <input type="password" name="password" placeholder="password" value={password} onChange={handleChange} />
          <p className={`text-center text-xs font-semibold text-red-600 ${!failed && 'h-0 overflow-hidden'}`}>{message}</p>
          <button
            className={`login-btn ${failed && 'failed'}`}
          >
            Login
          </button>
        </form>
        <p className="">
          <span className="text-xs semibold text-gray-500 mr-1">Don't have an account yet?</span>
          <Link
            to="/register"
            className="link-to-register"
          >Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
