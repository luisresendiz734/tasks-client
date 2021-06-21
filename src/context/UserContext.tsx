import { createContext, FC, useContext, useEffect, useState } from "react";

interface ISuccessResponse {
  status: true;
  result: IUser;
}

interface IFailResponse {
  status: false;
  error: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface IUserContext {
  user: IUser | null;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<IUserContext>({
  user: null,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
});

const serverURL = "http://localhost:4001";

const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localUser: IUser | null = JSON.parse(
      localStorage.getItem("user") || "null"
    );
    if (localUser) {
      setUser(localUser);
    }
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const params: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      };
      const res = await fetch(`${serverURL}/users/register`, params);
      const data: ISuccessResponse | IFailResponse = await res.json();
      if (data.status) {
        setUser(data.result);
        setError(null);
        localStorage.setItem("user", JSON.stringify(data.result));
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const params: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      };
      const res = await fetch(`${serverURL}/users/login`, params);
      const data: ISuccessResponse | IFailResponse = await res.json();
      if (data.status) {
        setUser(data.result);
        setError(null);
        localStorage.setItem("user", JSON.stringify(data.result));
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, error, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
