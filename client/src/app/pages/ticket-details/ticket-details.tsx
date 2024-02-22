/* eslint-disable react-hooks/exhaustive-deps */
import { Ticket, User } from '@acme/shared-models';
import {
  Box,
  Button,
  Card,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackdropLoading } from '../../elements';
import { usePostData, useQuery } from '../../hooks';
import { POST_DATA_METHOD } from '../../services/request.service';

/* eslint-disable-next-line */
export interface TicketDetailsProps {}

const TICKET_STATUS_DATA = [
  {
    value: 1,
    label: 'Incomplete',
  },
  {
    value: 2,
    label: 'Complete',
  },
];

export function TicketDetails(props: TicketDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ticket = {} as Ticket, refetch } = useQuery<Ticket>(
    `/api/tickets/${id}`,
    () => navigate(-1)
  );

  const { data: users = [], isFetching } = useQuery<User[]>(`/api/users`, () =>
    navigate(-1)
  );

  const { post: putRequest, isPosting: isPutting } = usePostData(
    POST_DATA_METHOD.PUT
  );
  const { post: deleteRequest, isPosting: isDeleteing } = usePostData(
    POST_DATA_METHOD.DELETE
  );

  const userInfo = users.find((i) => i.id === ticket.assigneeId);

  const onChangeAssignee = async (e: SelectChangeEvent<number>) => {
    await putRequest(`api/tickets/${ticket.id}/assign/${e.target.value}`);
    refetch();
  };

  const onUnassign = async () => {
    await putRequest(`api/tickets/${ticket.id}/unassign`);
    refetch();
  };

  const onChangeStatus = async (e: SelectChangeEvent<number>) => {
    const value = e.target.value;
    const url = `api/tickets/${ticket.id}/complete`;
    if (value === 1) {
      await deleteRequest(url);
    } else if (value === 2) {
      await putRequest(url);
    }
    refetch();
  };

  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(-1);
    }
  }, [id]);

  return (
    <Box>
      <Button onClick={() => navigate('/')} variant="text">
        Back
      </Button>

      <Box component={'h1'}>Ticket Details #{id}</Box>
      <Card
        sx={{
          p: 3,
          width: 600,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography>Description:</Typography>
          <Typography>{ticket.description || ''}</Typography>
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography>Assignee:</Typography>
          <Box display={'flex'} gap={1}>
            <Button onClick={onUnassign} variant="text">
              Unassign
            </Button>
            <Select
              labelId="demo-simple-select-label"
              value={userInfo?.id || ''}
              inputProps={{
                id: 'assignee-select',
                'data-testid': 'assignee-select',
              }}
              size="small"
              sx={{ width: 200 }}
              onChange={onChangeAssignee}
            >
              {users.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography>Status:</Typography>
          <Select
            labelId="demo-simple-select-label"
            value={ticket.completed ? 2 : 1}
            size="small"
            inputProps={{
              id: 'change-status-select',
              'data-testid': 'change-status-select',
            }}
            sx={{ width: 200 }}
            onChange={onChangeStatus}
          >
            {TICKET_STATUS_DATA.map((i) => (
              <MenuItem key={i.value} value={i.value}>
                {i.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Card>
      <BackdropLoading open={isDeleteing || isPutting || isFetching} />
    </Box>
  );
}

export default TicketDetails;
