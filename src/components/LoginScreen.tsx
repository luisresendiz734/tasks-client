import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useUser } from "../context/UserContext";

const LoginScreen = () => {
  const { login, register, error } = useUser();
  const [isOnRegister, setIsOnRegister] = useState(true);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChangeData = (
    e: ChangeEvent<HTMLInputElement>,
    isRegisterData: boolean
  ) => {
    const { name, value } = e.target;
    if (isRegisterData) {
      setRegisterData({ ...registerData, [name]: value });
    } else {
      setLoginData({ ...loginData, [name]: value });
    }
  };
  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { email, password } = loginData;
    if (email.length > 5 && password.length > 7) {
      await login(email, password);
    }
  };
  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { name, email, password } = registerData;
    if (name.length > 6 && email.length > 5 && password.length > 7) {
      await register(name, email, password);
    }
  };
  return (
    <div>
      {isOnRegister ? (
        <section>
          <h4>Register</h4>
          <form onSubmit={handleRegister}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                value={registerData.name}
                onChange={(e) => handleChangeData(e, true)}
                type="text"
                name="name"
                id="name"
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                value={registerData.email}
                onChange={(e) => handleChangeData(e, true)}
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                value={registerData.password}
                onChange={(e) => handleChangeData(e, true)}
                type="password"
                name="password"
                id="password"
              />
            </div>
            <button>register</button>
          </form>
          <span
            onClick={() => setIsOnRegister(!isOnRegister)}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Have account? Login
          </span>
        </section>
      ) : (
        <section>
          <h4>Login</h4>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                value={loginData.email}
                onChange={(e) => handleChangeData(e, false)}
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                value={loginData.password}
                onChange={(e) => handleChangeData(e, false)}
                type="password"
                name="password"
                id="password"
              />
            </div>
            <button>login</button>
          </form>
          <span
            onClick={() => setIsOnRegister(!isOnRegister)}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Need account? Register
          </span>
        </section>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginScreen;
