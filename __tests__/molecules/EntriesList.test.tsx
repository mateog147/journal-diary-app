import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {EntriesList} from '../../src/components/molecules/EntriesList';

describe('EntriesList', () => {
  const entry = {id: '1', title: 'Entry 1', content: 'Content 1'};
  const entry2 = {id: '2', title: 'Entry 2', content: 'Content 2'};

  it('renders empty message when entries is empty', () => {
    const {getByText} = render(<EntriesList entries={[]} />);
    expect(getByText('You do not have entries for this day')).toBeTruthy();
  });

  it('renders a list of entries', () => {
    const {getByText} = render(<EntriesList entries={[entry, entry2]} />);
    expect(getByText('Entry 1')).toBeTruthy();
    expect(getByText('Entry 2')).toBeTruthy();
  });

  it('calls onEditEntry when edit icon is pressed', () => {
    const onEditEntry = jest.fn();
    const {getAllByRole} = render(
      <EntriesList entries={[entry]} onEditEntry={onEditEntry} />,
    );
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(onEditEntry).toHaveBeenCalledWith(entry);
  });

  it('calls onDeleteEntry when delete icon is pressed', () => {
    const onDeleteEntry = jest.fn();
    const {getAllByRole} = render(
      <EntriesList entries={[entry]} onDeleteEntry={onDeleteEntry} />,
    );
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[1]);
    expect(onDeleteEntry).toHaveBeenCalledWith(entry);
  });
});
