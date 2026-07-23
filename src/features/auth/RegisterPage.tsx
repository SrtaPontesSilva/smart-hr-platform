// src/features/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useLocalStorage from '../../shared/hooks/useLocalStorage';

interface User {
  nome: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Persistência dos campos de cadastro
  const [nome, setNome] = useLocalStorage<string>('register_nome', '');
  const [email, setEmail] = useLocalStorage<string>('register_email', '');
  const [password, setPassword] = useLocalStorage<string>('register_password', '');
  const [confirmPassword, setConfirmPassword] = useLocalStorage<string>('register_confirmPassword', '');

  // Persistência dos usuários cadastrados (somente setter é utilizado)
  const [, setUsers] = useLocalStorage<User[]>('registered_users', []);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      setIsSubmitting(false);
      return;
    }

    // Simulação de registro
    setTimeout(() => {
      const newUser: User = { nome, email, password };
      setUsers(prevUsers => [...prevUsers, newUser]);

      setSuccessMessage('Conta criada com sucesso!');
      setIsSubmitting(false);

      // Limpa campos persistidos no localStorage
      setNome('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redireciona para login
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 transition-colors dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg transition-colors dark:bg-gray-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Cadastro
        </h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="register-nome"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nome Completo
            </label>
            <input
              id="register-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              E-mail
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Senha
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="register-confirm-password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirmar Senha
            </label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-sm font-semibold text-green-500">{successMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary py-3 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Já possui uma conta?{' '}
            <Link
              to="/login"
              className="text-primary underline hover:text-blue-800 dark:text-primary-light dark:hover:text-blue-400"
            >
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
