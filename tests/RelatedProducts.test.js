import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import axios from 'axios';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import RelatedProducts from '../client/src/components/RelatedProducts.jsx';
import RelatedProduct from '../client/src/components/RelatedProduct.jsx';
import getHandler from '../client/src/lib/getHandler.js';

// jest.mock('axios');

test('Related Products component should exist', () => {
  const { container } = render(<RelatedProducts />);
  expect(container.firstChild).toHaveClass('related-products');
});

test('Product rating should render to page', () => {
  const { getByTestId } = render(<RelatedProduct />);
  const productRatings = getByTestId('product-rating');
  const relatedProduct = getByTestId('related-product');
  expect(relatedProduct).toContainElement(productRatings)
});