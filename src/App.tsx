import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { AppRoute } from './common/enums';
import React from 'react';
import './App.css';
import NotFound from './components/not-found';
import Intro from './components/intro';
import Draggable from 'react-draggable';

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path={AppRoute.ROOT} element={<Intro />}></Route>
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
