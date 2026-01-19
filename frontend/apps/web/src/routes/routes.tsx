import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../pages/layout/Layout';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import ProblemSets from '../pages/problem-sets/ProblemSets';
import ProblemList from '../pages/problem-list/ProblemList';
import ProblemDetail from '../pages/problem-detail/ProblemDetail';
import IncorrectProblems from '../pages/incorrect/IncorrectProblems';
import CreateSet from '../pages/create-set/CreateSet';
import EditProblem from '../pages/edit-problem/EditProblem';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/app" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <ProblemSets />,
          },
          {
            path: 'problem-set/:setId',
            element: <ProblemList />,
          },
          {
            path: 'problem/:problemId',
            element: <ProblemDetail />,
          },
          {
            path: 'incorrect/:setId',
            element: <IncorrectProblems />,
          },
          {
            path: 'create-set',
            element: <CreateSet />,
          },
          {
            path: 'edit-problem/:setId',
            element: <EditProblem />,
          },
        ],
      },
    ],
  },
];

export { routes };
