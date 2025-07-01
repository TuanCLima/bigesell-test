import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar';

// Mock the DataContext
const mockSetSearchQuery = jest.fn();
jest.mock('../state/DataContext', () => ({
  useData: () => ({
    searchQuery: '',
    setSearchQuery: mockSetSearchQuery
  })
}));

describe('SearchBar Component', () => {
  beforeEach(() => {
    mockSetSearchQuery.mockClear();
  });

  test('renders search input with placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
  });
});
