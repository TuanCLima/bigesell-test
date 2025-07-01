import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Items from './Items';

// Mock the DataContext
jest.mock('../state/DataContext', () => ({
  useData: () => ({
    items: [
      { id: 1, name: 'Test Item 1' },
      { id: 2, name: 'Test Item 2' }
    ],
    isLoading: false,
    pagination: {
      currentPage: 1,
      totalPages: 2,
      totalItems: 2,
      pageSize: 10,
      hasNext: true,
      hasPrev: false
    },
    fetchItems: jest.fn().mockResolvedValue(),
    searchQuery: ''
  })
}));

// Mock react-virtuoso
jest.mock('react-virtuoso', () => ({
  Virtuoso: ({ data, itemContent }) => (
    <div data-testid="virtuoso-list">
      {data.map((item, index) => (
        <div key={item.id}>{itemContent(index, item)}</div>
      ))}
    </div>
  )
}));

const ItemsWithRouter = () => (
  <BrowserRouter>
    <Items />
  </BrowserRouter>
);

describe('Items Component', () => {
  test('renders items list', () => {
    render(<ItemsWithRouter />);
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });

  test('renders pagination component', () => {
    render(<ItemsWithRouter />);
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });
});
