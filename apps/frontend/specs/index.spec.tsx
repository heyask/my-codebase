import React from 'react';
import { render } from '@testing-library/react';

import Page from '../src/app/[lang]/page';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page params={{ id: 'test', title: 'test', lang: 'en' }} searchParams={{}} />);
    expect(baseElement).toBeTruthy();
  });
});
