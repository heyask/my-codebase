'use client';

import React from 'react';

export default function BaseFunctionality({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  return children;
}
