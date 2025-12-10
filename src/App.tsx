import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return <HomePage username={user?.username || 'User'} onLogout={logout} />;
}

export default App;
