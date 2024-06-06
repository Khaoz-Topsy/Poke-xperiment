import type { Component } from 'solid-js';
import { PageHeader } from '../components/common/pageHeader';
import { CommonLayout } from '../components/common/layout';

export const AboutPage: Component = () => {
  return (
    <CommonLayout>
      <PageHeader text="About"></PageHeader>
    </CommonLayout>
  );
};

export default AboutPage;
