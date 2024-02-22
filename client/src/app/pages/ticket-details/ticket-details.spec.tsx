import { fireEvent, render, waitFor } from '@testing-library/react';
import ReactTestUtils, { SyntheticEventData } from 'react-dom/test-utils'; // ES6
import { MemoryRouter as Router } from 'react-router-dom';
import { usePostData, useQuery } from '../../hooks';
import TicketDetails from './ticket-details';

jest.mock('../hooks');
const mockPostData = jest.mocked(usePostData);

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
) as jest.Mock;

describe('TicketDetails', () => {
  const mockPost = jest.fn();

  beforeAll(() => {
    jest.mocked(useQuery).mockImplementation((url) => {
      if (url.includes('/api/tickets/')) {
        return {
          data: {
            id: 1,
            description: 'Test Ticket',
            assigneeId: 2,
            completed: false,
          },
          isFetching: false,
          refetch: jest.fn(),
        };
      } else if (url.includes('/api/users')) {
        return {
          data: [{ id: 2, name: 'John Doe' }],
          isFetching: false,
          refetch: jest.fn(),
        };
      }
      return { data: undefined, isFetching: false, refetch: jest.fn() };
    });

    mockPostData.mockReturnValue({
      post: mockPost,
      isPosting: false,
    });
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Router>
        <TicketDetails />
      </Router>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should change assignee successfully', async () => {
    const { getByTestId, findByText } = render(
      <Router>
        <TicketDetails />
      </Router>
    );

    const select = await waitFor(() => getByTestId('assignee-select'));

    fireEvent.change(select, { target: { value: 2 } });
    expect(await findByText('John Doe')).toBeInTheDocument();
  });

  it('should change status complete successfully', async () => {
    const { getByTestId } = render(
      <Router>
        <TicketDetails />
      </Router>
    );

    const select = await waitFor(() => getByTestId('change-status-select'));
    await ReactTestUtils.Simulate.change(select, {
      target: { value: 1 },
    } as unknown as SyntheticEventData);
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
    });
  });

  it('should change to unassgin ', async () => {
    const { getByText } = render(
      <Router>
        <TicketDetails />
      </Router>
    );

    const button = await waitFor(() => getByText('Unassign'));
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
    });
  });
});
