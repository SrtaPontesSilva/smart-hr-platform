// frontend/src/shared/hooks/updateNestedValue.test.ts
import { updateNestedValue } from './updateNestedValue';

describe('updateNestedValue', () => {
  it('atualiza uma propriedade de nível superior', () => {
    const obj = { a: 1, b: 2 };
    const updated = updateNestedValue(obj, ['a'], 100);
    expect(updated).toEqual({ a: 100, b: 2 });
    // Garante imutabilidade
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it('atualiza uma propriedade aninhada de objeto', () => {
    const obj = { a: { b: { c: 3 } } };
    const updated = updateNestedValue(obj, ['a', 'b', 'c'], 300);
    expect(updated).toEqual({ a: { b: { c: 300 } } });
    // Garante imutabilidade dos objetos internos
    expect(obj).toEqual({ a: { b: { c: 3 } } });
  });

  it('atualiza um elemento dentro de um array', () => {
    const obj = { a: [10, 20, 30] };
    const updated = updateNestedValue(obj, ['a', 1], 200);
    expect(updated).toEqual({ a: [10, 200, 30] });
    // Garante que o array original não foi modificado
    expect(obj).toEqual({ a: [10, 20, 30] });
  });

  it('cria o caminho se não existir', () => {
    const obj = { a: 1 };
    const updated = updateNestedValue(obj, ['b', 'c'], 50);
    expect(updated).toEqual({ a: 1, b: { c: 50 } });
  });

  it('mantém imutabilidade em estruturas mistas', () => {
    const obj = {
      a: { b: [1, { c: 3 }] },
      d: 4
    };
    const updated = updateNestedValue(obj, ['a', 'b', 1, 'c'], 300);
    expect(updated).toEqual({
      a: { b: [1, { c: 300 }] },
      d: 4
    });
    // Verifica que a referência original não foi modificada
    expect(obj).toEqual({
      a: { b: [1, { c: 3 }] },
      d: 4
    });
  });
});
