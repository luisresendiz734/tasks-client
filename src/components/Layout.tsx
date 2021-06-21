import { FC } from "react";
import { useUser } from "../context/UserContext";

const Layout: FC = ({ children }) => {
  const { user, logout } = useUser();
  return (
    <div>
      <header>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <h3 style={{ flexGrow: 1 }}>Tasks app</h3>
          {user && (
            <div>
              <span style={{ marginRight: "1rem" }}>{user.name}</span>
              <button onClick={logout}>logout</button>
            </div>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
