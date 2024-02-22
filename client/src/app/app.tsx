import { Route, Routes } from 'react-router-dom';

import Layout from './layouts';
import TicketDetails from './pages/ticket-details/ticket-details';
import Tickets from './pages/tickets/tickets';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Tickets />} />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<TicketDetails />} />
      </Routes>
    </Layout>
  );
};

export default App;
