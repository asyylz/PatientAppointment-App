import { render, screen } from '@testing-library/react';
import CustomInput from './CustomInput';
import '@testing-library/jest-dom';

describe('CustomInput component', () => {
  it('should render input', () => {
    render(<CustomInput />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    //screen.logTestingPlaygroundURL();
  });
});
