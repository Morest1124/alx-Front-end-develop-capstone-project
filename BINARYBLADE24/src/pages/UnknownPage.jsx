import React from 'react';
import PageWrapper from './PageWrapper';

const UnknownPage = () => (
    <PageWrapper title="404 - Page Not Found">
        <p className="text-red-500">The pag you are looking for does not exist or requires different permisions.</p>
    </PageWrapper>
);

export default UnknownPage;