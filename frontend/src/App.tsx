// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */
// //app.tsx
// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Layout from './components/Layout';
// import ModerationQueue from './pages/ModerationQueue';
// import ModerationDetail from './pages/ModerationDetail';
// import Users from './pages/Users';
// import Analytics from './pages/Analytics';
// import Financials from './pages/Financials';
// import Reports from './pages/Reports';
// import CreateEvent from './pages/CreateEvent';
// import ApprovedEvents from './pages/ApprovedEvents';
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Navigate to="/moderation" replace />} />
//           <Route path="moderation" element={<ModerationQueue />} />
//           <Route path="moderation/:id" element={<ModerationDetail />} />
//           <Route path="users" element={<Users />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="financials" element={<Financials />} />
//           <Route path="reports" element={<Reports />} />
//           {/* <Route path="create-event" element={<CreateEvent />} /> */}
//          <Route path="events/create" element={<CreateEvent />} />
//            <Route path="events/approved" element={<ApprovedEvents />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }
// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ModerationQueue from './pages/ModerationQueue';
import ModerationDetail from './pages/ModerationDetail';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Financials from './pages/Financials';
import Reports from './pages/Reports';
import CreateEvent from './pages/CreateEvent';
import ApprovedEvents from './pages/ApprovedEvents';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/moderation" replace />} />
          <Route path="moderation" element={<ModerationQueue />} />
          <Route path="moderation/:id" element={<ModerationDetail />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="financials" element={<Financials />} />
          <Route path="reports" element={<Reports />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/approved" element={<ApprovedEvents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}