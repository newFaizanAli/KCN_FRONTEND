import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import appRoutes from './routes';
import { ToastProvider } from './components/shared';
function App() {


  function AppRoutes() {
    const routes = useRoutes([...appRoutes]);

    return routes;
  }

  return (
    <Router>
      <AppRoutes />
      <ToastProvider />
    </Router>
  );
}

export default App;