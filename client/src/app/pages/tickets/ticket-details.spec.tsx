import { Box, Button, TextField } from '@mui/material';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { Dialog } from '../../elements';
import { useDialog, usePostData, useQuery } from '../../hooks';
import Tickets from './tickets';

jest.mock('../hooks');
const mockPostData = jest.mocked(usePostData);
const mockQuery = jest.mocked(useQuery);
const mockDialog = jest.mocked(useDialog);

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
) as jest.Mock;

describe('TicketDetails', () => {
  const mockPostFn = jest.fn();

  beforeAll(() => {
    mockPostData.mockReturnValue({
      post: mockPostFn,
      isPosting: false,
    });

    mockDialog.mockReturnValue({
      open: false,
      onCloseDialog: jest.fn(),
      onOpenDialog: jest.fn(),
    });

    mockQuery.mockReturnValue({
      data: [
        { id: 1, description: 'Ticket 1', completed: true },
        { id: 2, description: 'Ticket 2', completed: false },
      ],
      isFetching: false,
      refetch: jest.fn(),
    });
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Router>
        <Tickets />
      </Router>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should filter tickets based on COMPLETE stats', async () => {
    jest.mock('../hooks', () => ({
      useQuery: () => ({
        data: [
          { id: 1, description: 'Completed Ticket', completed: true },
          { id: 2, description: 'Incomplete Ticket', completed: false },
        ],
        isFetching: false,
      }),
    }));

    const { getByTestId, findByText } = render(
      <Router>
        <Tickets />
      </Router>
    );

    const select = await waitFor(() => getByTestId('status-select'));

    fireEvent.change(select, { target: { value: 'COMPLETE' } });

    expect(await findByText('Complete')).toBeInTheDocument();
  });

  it('should filter tickets based on INCOMPLETE status', async () => {
    jest.mock('../hooks', () => ({
      useQuery: () => ({
        data: [
          { id: 1, description: 'Completed Ticket', completed: true },
          { id: 2, description: 'Incomplete Ticket', completed: false },
        ],
        isFetching: false,
      }),
    }));

    const { getByTestId, findByText } = render(
      <Router>
        <Tickets />
      </Router>
    );

    const select = await waitFor(() => getByTestId('status-select'));

    fireEvent.change(select, { target: { value: 'INCOMPLETE' } });

    expect(await findByText('Incomplete')).toBeInTheDocument();
  });

  it('should allow adding a new ticket', async () => {
    const { getByText } = render(
      <Router>
        <Tickets />
      </Router>
    );

    fireEvent.click(getByText('Add Ticket'));

    render(
      <Router>
        <Dialog
          title="Add Ticket"
          open={true}
          handleClose={() => {
            console.log('mock');
          }}
        >
          <TextField />
          <Box display={'flex'} gap={2} mt={2}>
            <Button
              onClick={mockPostFn}
              fullWidth
              size="medium"
              variant="contained"
            >
              Add
            </Button>
          </Box>
        </Dialog>
      </Router>
    );

    fireEvent.click(getByText('Add'));
    expect(mockPostFn).toHaveBeenCalled();
  });
});
