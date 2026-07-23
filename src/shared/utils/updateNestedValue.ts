// frontend/src/shared/hooks/updateNestedValue.ts
export function updateNestedValue<T extends object>(
    obj: T,
    path: (string | number)[],
    value: any
  ): T {
    if (path.length === 0) return obj;
    // Cria uma cópia rasa do objeto
    const updated = Array.isArray(obj) ? ([...obj] as unknown as T) : ({ ...obj } as T);
    let current: any = updated;
  
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      // Garante que o caminho existe e é imutável
      current[key] = current[key]
        ? (Array.isArray(current[key])
            ? ([...current[key]])
            : ({ ...current[key] }))
        : {};
      current = current[key];
    }
    current[path[path.length - 1]] = value;
    return updated;
  }
  