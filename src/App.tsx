import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { AppRoute } from './common/enums';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import NotFound from './components/not-found';
import Info from './components/info';
import Draggable from 'react-draggable';

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* <Route path={AppRoute.ROOT} element={<ListOfAllRecords />}></Route> */}
        <Route path={AppRoute.INFO} element={<Info />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
