// frontend/src/shared/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook customizado para trabalhar com valores salvos no localStorage.
 * - Inicializa o estado a partir do localStorage (se existir) ou usa o valor inicial fornecido.
 * - Salva automaticamente no localStorage sempre que o estado for atualizado.
 * - Oferece uma função de remoção para limpar a chave do localStorage.
 *
 * @param key A chave (string) a ser usada no localStorage.
 * @param initialValue Valor inicial do estado.
 * @returns [valorAtual, setValorAtual, removeValor]
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  // Armazena o valor inicial em uma ref para que sua referência não mude entre renderizações
  const initialValueRef = useRef(initialValue);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Segurança para SSR
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        let value: T;
        // Se o valor esperado for uma string e o item não estiver entre aspas, trata como string simples.
        if (typeof initialValue === 'string' && item[0] !== '"') {
          value = item as unknown as T;
        } else {
          value = JSON.parse(item);
        }
        setStoredValue(value);
      }
    } catch (error) {
      console.error(`Erro ao fazer parse do valor armazenado para a chave "${key}":`, error);
      // Atualiza o localStorage com o valor inicial para evitar erro recorrente
      setStoredValue(initialValueRef.current);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(initialValueRef.current));
      }
    }
    // Executa apenas quando a chave mudar
  }, [key]);

  const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (valueOrFn) => {
      try {
        setStoredValue((prevValue) => {
          const newValue =
            typeof valueOrFn === 'function'
              ? (valueOrFn as (val: T) => T)(prevValue)
              : valueOrFn;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(newValue));
          }
          return newValue;
        });
      } catch (error) {
        console.error(`Erro ao salvar no localStorage para a chave "${key}":`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValueRef.current); // Resetar para o valor inicial
    } catch (error) {
      console.error(`Erro ao remover a chave "${key}" do localStorage:`, error);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
