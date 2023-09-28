import { useContext, useState } from 'react';
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/authContext"
import './login.scss'
import { APIURL } from '../../assets/data';
import { fetchOptions } from '../../assets/data/data';


const Login = () => {
  const { login } = useContext(AuthContext);

  const [{ username, password }, setCredentials] = useState({ username: '', password: '' });

  const loginUser = async () => {
    const options = { ...fetchOptions, method: 'POST', body: JSON.stringify({ username, password })}
    const response = await fetch(`${APIURL}/auth/login`, options);
    if (response.status !== 200) return alert(`failed to login`);
    const { message } = await response.json();
    alert(message)
    login()
  }

  const handleChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCredentials( prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit : React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    loginUser()
  }

  return (
    <div className="login bg-[rgb(193,190,255)] h-[100vh] flex items-center justify-center">
      <div className="card w-[60%] bg-white rounded-[10px] max-h[600px] flex overflow-hidden">
        <div className="left flex-1 flex flex-col p-[50px] gap-[20px] text-white">
          <h1 className="text-[100px]">Hello World</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo mollitia esse commodi nisi libero exercitationem nostrum enim? Eveniet error, in, eum cupiditate quisquam aliquam praesentium non id corrupti, eaque doloribus!
          </p>
          <span className="text-[14px]">Don't have an account yet?</span>
          <Link to="/register" className="w-[50%] p-[10px] border-none bg-white text-[rebeccapurple] font-bold flex items-center justify-center">Register</Link>
        </div>
        <div className="right flex-1 w-full flex flex-col justify-center gap-[50px] p-4">
          <h1 className="text-[#555] text-[50px] font-bold">Login</h1>
          <form className="flex flex-col gap-[30px]" onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="username" value={username} onChange={handleChange} />
            <input type="password" name="password" placeholder="password" value={password} onChange={handleChange} />
            <button 
              type='submit'
              className="w-[50%] p-[10px] border-none bg-[#938eef] text-white font-bold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
