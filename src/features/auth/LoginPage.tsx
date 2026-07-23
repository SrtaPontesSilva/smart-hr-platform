// frontend/src/features/auth/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useLocalStorage from '../../shared/hooks/useLocalStorage';

interface User {
  nome: string;
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useLocalStorage<string>('login_email', '');
  const [password, setPassword] = useLocalStorage<string>('login_password', '');
  const [users] = useLocalStorage<User[]>('registered_users', []);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const matchedUser = users.find(u => u.email === email && u.password === password);

      if (matchedUser) {
        localStorage.setItem('user_authenticated', 'true');
        // limpa campos persistidos
        setEmail('');
        setPassword('');
        navigate('/');
      } else {
        setErrorMessage('Credenciais inválidas ou usuário não cadastrado.');
      }

      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="loginEmail" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <input
              id="loginEmail"
              name="loginEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border bg-gray-50 p-3 focus:ring-2 focus:ring-primary dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="loginPassword" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha
            </label>
            <input
              id="loginPassword"
              name="loginPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border bg-gray-50 p-3 focus:ring-2 focus:ring-primary dark:bg-gray-700"
              required
            />
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary py-3 text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Ainda não possui conta?{' '}
          <Link to="/register" className="text-primary underline hover:text-blue-800">
            Cadastre‑se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
