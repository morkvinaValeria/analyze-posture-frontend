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
import AnalyzePosture from './components/analyze';

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path={AppRoute.ROOT} element={<Intro />}></Route>
        <Route path={AppRoute.ANALYZE} element={<AnalyzePosture />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </>
    )
  );

  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
