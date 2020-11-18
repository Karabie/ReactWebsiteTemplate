import { fireEvent } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';

import * as teamsActions from 'state/actions/teams';

import TeamsCard from '.';

describe('<TeamsCard /> rendering', () => {
  const dispatchMock = jest.fn();

  const state = {
    auth: { userData: { isAdmin: true } },
    teams: {
      success: false,
      deleted: false,
      loadingUsers: false,
      loadingTeams: false,
      teamsList: [{ id: 'teamTestId', name: 'testTeam', createdBy: 'test' }],
      usersList: [],
    },
    users: { data: [{ id: 'testUser', name: 'testUser' }] },
  };

  beforeEach(() => {
    jest
      .spyOn(reactRedux, 'useDispatch')
      .mockImplementation(() => dispatchMock);
    jest.spyOn(teamsActions, 'teamsCleanUp').mockImplementation(jest.fn);
  });
  it('should render without crashing', () => {
    const { component } = renderWithProviders(<TeamsCard />)({ ...state });

    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should not render any buttons for non-admins', () => {
    const { component } = renderWithProviders(<TeamsCard />)({
      ...state,
      auth: { userData: { isAdmin: false } },
    });

    expect(component.queryByRole('button')).toBeNull();
  });

  it('should render buttons for admins', () => {
    const { component } = renderWithProviders(<TeamsCard />)({
      ...state,
    });

    expect(component.getAllByRole('button')).toBeTruthy();
  });

  it('should open TeamModal when clicking add button', () => {
    const { component } = renderWithProviders(<TeamsCard />)({
      ...state,
    });

    fireEvent.click(component.getByText('Add Team'));

    expect(component.getByText('Team Information')).toBeTruthy();
  });
});
