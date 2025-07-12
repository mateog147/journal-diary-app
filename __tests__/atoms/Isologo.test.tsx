import React from 'react';
import { render } from '@testing-library/react-native';
import { Isologo } from '../../src/components/atoms/Isologo';
import { Image } from 'react-native';

describe('Isologo', () => {
  it('renders with default size and style', () => {
    const { getByTestId } = render(<Isologo />);
    const image = getByTestId('isologo-image');
    expect(image).toBeTruthy();
    expect(image.props.style.width).toBe(144);
    expect(image.props.style.height).toBe(144);
  });

  it('renders with custom size', () => {
    const { getByTestId } = render(<Isologo size={100} />);
    const image = getByTestId('isologo-image');
    expect(image.props.style.width).toBe(100);
    expect(image.props.style.height).toBe(100);
  });

  it('applies custom styles', () => {
    const customStyle = { borderRadius: 10, backgroundColor: 'red' };
    const { getByTestId } = render(<Isologo size={80} customStyle={customStyle} />);
    const image = getByTestId('isologo-image');
    expect(image.props.style).toEqual(
      expect.objectContaining({
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: 'red',
      })
    );
  });
});
