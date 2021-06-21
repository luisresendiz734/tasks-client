import Layout from "./components/Layout";
import { useUser } from "./context/UserContext";
import TasksScreen from "./components/TasksScreen";
import LoginScreen from "./components/LoginScreen";

const App = () => {
  const { user } = useUser();
  return <Layout>{user ? <TasksScreen /> : <LoginScreen />}</Layout>;
};

export default App;
