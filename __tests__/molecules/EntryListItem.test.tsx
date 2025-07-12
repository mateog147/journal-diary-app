import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {EntryListItem} from '../../src/components/molecules/EntryListItem';

describe('EntryListItem', () => {
  const entry = {id: '1', title: 'Test Entry', content: 'Test Content'};

  it('renders entry title', () => {
    const {getByText} = render(<EntryListItem entry={entry} />);
    expect(getByText('Test Entry')).toBeTruthy();
  });

  it('applies custom size and style', () => {
    const customStyle = {color: 'red'};
    const {getByText} = render(
      <EntryListItem entry={entry} size={100} customStyle={customStyle} />,
    );
    const title = getByText('Test Entry');
    expect(title.props.style.width).toBe(100);
    expect(title.props.style.color).toBe('red');
  });

  it('calls onEdit when edit icon is pressed', () => {
    const onEdit = jest.fn();
    const {getAllByRole} = render(
      <EntryListItem entry={entry} onEdit={onEdit} />,
    );
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(onEdit).toHaveBeenCalledWith(entry);
  });

  it('calls onDelete when delete icon is pressed', () => {
    const onDelete = jest.fn();
    const {getAllByRole} = render(
      <EntryListItem entry={entry} onDelete={onDelete} />,
    );
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[1]);
    expect(onDelete).toHaveBeenCalledWith(entry);
  });
});
