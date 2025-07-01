import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DataProvider, useData } from './DataContext';

// Mock fetch
global.fetch = jest.fn();

// Test component to access the context
const TestComponent = () => {
  const { items, isLoading, searchQuery, setSearchQuery } = useData();
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="items-count">{items.length}</div>
      <div data-testid="search-query">{searchQuery}</div>
      <button onClick={() => setSearchQuery('test')}>Set Search</button>
    </div>
  );
};

describe('DataContext', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('provides initial state values', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    expect(screen.getByTestId('search-query')).toHaveTextContent('');
  });

  test('updates search query when setSearchQuery is called', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    act(() => {
      screen.getByText('Set Search').click();
    });
    
    expect(screen.getByTestId('search-query')).toHaveTextContent('test');
  });
});
