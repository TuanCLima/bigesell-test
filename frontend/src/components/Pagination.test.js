import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const mockOnPrevious = jest.fn();
  const mockOnNext = jest.fn();

  const defaultProps = {
    pagination: {
      currentPage: 2,
      totalPages: 5,
      hasNext: true,
      hasPrev: true
    },
    onPrevious: mockOnPrevious,
    onNext: mockOnNext
  };

  beforeEach(() => {
    mockOnPrevious.mockClear();
    mockOnNext.mockClear();
  });

  test('displays current page information', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  test('calls onPrevious when Previous button is clicked', () => {
    render(<Pagination {...defaultProps} />);
    const prevButton = screen.getByText('← Previous');
    fireEvent.click(prevButton);
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });
});
