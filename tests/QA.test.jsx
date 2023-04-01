import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import QA from '../client/src/components/QA.jsx';
import QACard from '../client/src/components/QACard.jsx';
import Answer from '../client/src/components/Answer.jsx';

/**
 * @jest-environment jsdom
 */

// test('QA Components', () => {
//     render(<QA />);

//     expect(screen.getByRole('button', {name: 'Ask a question'})).toBeInTheDocument();

// })

describe('QA', () => {
  it('renders QA components', () => {
    render(<QA />);

    expect(screen.getByText('Ask a question')).toBeInTheDocument();
  });
});