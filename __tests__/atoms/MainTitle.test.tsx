import React from 'react';
import {render} from '@testing-library/react-native';
import {MainTitle} from '../../src/components/atoms/MainTitle';

describe('MainTitle', () => {
  it('renders correctly with default props', () => {
    const {getByText} = render(<MainTitle title="Test Title" />);
    const titleElement = getByText('Test Title');
    expect(titleElement).toBeTruthy();
  });

  it('displays the correct text', () => {
    const testTitle = 'Hello World';
    const {getByText} = render(<MainTitle title={testTitle} />);
    expect(getByText(testTitle)).toBeTruthy();
  });

  it('applies custom styles when provided', () => {
    const customStyle = {color: 'red', fontSize: 24};
    const {getByText} = render(
      <MainTitle title="Styled Title" customStyle={customStyle} size={15}/>,
    );

    const titleElement = getByText('Styled Title');
    expect(titleElement.props.style).toEqual(
      expect.objectContaining(customStyle),
    );
  });

  it('applies different text size when specified', () => {
    const {getByText} = render(<MainTitle title="Right Aligned" size={10} />);

    const titleElement = getByText('Right Aligned');
    expect(titleElement.props.style).toEqual(
      expect.objectContaining({width: 10}),
    );
  });
});
