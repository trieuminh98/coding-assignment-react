/* eslint-disable react-hooks/exhaustive-deps */
import { Ticket, User } from '@acme/shared-models';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackdropLoading, Dialog, Loading } from '../../elements';
import { useDialog, usePostData, useQuery } from '../../hooks';
import { POST_DATA_METHOD } from '../../services/request.service';

enum STATUS {
  ALL = 'ALL',
  COMPLETE = 'COMPLETE',
  INCOMPLETE = 'INCOMPLETE',
}

const TICKET_STATUS_DATA = [
  {
    value: STATUS.ALL,
    label: 'All',
  },
  {
    value: STATUS.COMPLETE,
    label: 'Complete',
  },
  {
    value: STATUS.INCOMPLETE,
    label: 'Incomplete',
  },
];

export function Tickets() {
  const [filterStatus, setFilterStatus] = useState<STATUS>(STATUS.ALL);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { open, onCloseDialog, onOpenDialog } = useDialog();
  const {
    data: ticket = [],
    refetch,
    isFetching,
  } = useQuery<Ticket[]>(`/api/tickets`);

  const { data: users = [] } = useQuery<User[]>(`/api/users`);
  const [err, setErr] = useState(false);
  const { post, isPosting } = usePostData(POST_DATA_METHOD.POST);
  const ticketsFilterByStatus = useMemo(() => {
    const isCompleted = filterStatus === STATUS.COMPLETE;
    return filterStatus === STATUS.ALL
      ? ticket
      : ticket.filter((i) => i.completed === isCompleted);
  }, [filterStatus, ticket]);

  const onNavigateToDetail = (id: number) => {
    navigate(`/${id}`);
  };

  const reset = () => {
    setErr(false);
    setDescription('');
    onCloseDialog();
  };

  const onAdd = async () => {
    if (!description) {
      setErr(true);
      return;
    }
    await post(`/api/tickets`, {
      description,
    });
    reset();
    onCloseDialog();

    await refetch();
  };

  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box component={'h1'}>Ticket List</Box>
        <IconButton
          sx={{
            gap: 2,
            '&:hover': {
              background: 'white',
            },
          }}
          color="primary"
          aria-label="delete"
          onClick={onOpenDialog}
        >
          <AddCircleIcon />
          <Typography>Add Ticket</Typography>
        </IconButton>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterStatus}
          inputProps={{
            id: 'status-select',
            'data-testid': 'status-select',
          }}
          label="Status"
          sx={{ width: 300 }}
          onChange={(e) => setFilterStatus(e.target.value as STATUS)}
        >
          {TICKET_STATUS_DATA.map((i) => (
            <MenuItem key={i.value} value={i.value}>
              {i.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Card sx={{ p: 3, width: 700, mt: 2 }}>
        <List
          sx={{
            bgcolor: 'background.paper',
          }}
        >
          {ticketsFilterByStatus.length > 0 ? (
            ticketsFilterByStatus.map((value, index) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onNavigateToDetail(value.id);
                    }}
                    dense
                  >
                    <ListItemText
                      id={labelId}
                      primary={
                        <Box display={'flex'} justifyContent={'space-between'}>
                          <Typography>
                            {index + 1}: {value.description}
                          </Typography>
                          <Box gap={4} display={'flex'}>
                            <Typography>
                              {
                                users.find((i) => i.id === value.assigneeId)
                                  ?.name
                              }
                            </Typography>
                            <EditIcon />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })
          ) : (
            <Box>No tickets</Box>
          )}
        </List>
      </Card>
      <Dialog title="Add Ticket" open={open} handleClose={onCloseDialog}>
        <TextField
          sx={{ width: 400 }}
          error={err}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="outlined-basic"
          label="Ticket Description"
          variant="outlined"
        />
        <Box display={'flex'} gap={2} mt={2}>
          <Button onClick={reset} fullWidth size="medium" variant="outlined">
            Cancel
          </Button>
          <Button onClick={onAdd} fullWidth size="medium" variant="contained">
            {isPosting ? <Loading color="inherit" size={20} /> : 'Add'}
          </Button>
        </Box>
      </Dialog>
      <BackdropLoading open={isFetching} />
    </Box>
  );
}

export default Tickets;
