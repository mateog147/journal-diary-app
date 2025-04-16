import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from '../../store/reducers/token';
import userReducer from '../../store/reducers/user';

// Tipo para las opciones de renderizado con store
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Record<string, any>;
  store?: any;
}

/**
 * Función para renderizar componentes con Redux Provider
 * @param ui - Componente a renderizar
 * @param options - Opciones de renderizado
 * @returns Resultado del renderizado con métodos adicionales
 */
function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},|
  store = configureStore({
    reducer: {
      token: tokenReducer,
      user: userReducer,
    },
    preloadedState,
  }),
  ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }): ReactElement {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-exportar todo de testing-library
export * from '@testing-library/react-native';

// Sobrescribir render con nuestra versión personalizada
export { renderWithProviders as render };