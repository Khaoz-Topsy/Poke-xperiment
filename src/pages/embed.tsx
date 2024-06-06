import { Component } from 'solid-js';

import { LevelWrapper } from '../components/level/levelWrapper';

export const EmbedPage: Component = () => {
  return (
    <LevelWrapper
      uiScale={100}
      setUiScale={(newValue: number) => {}}
      wrapper={(_, children) => (
        <div style={{ position: 'relative', display: 'inline-block' }}>{children}</div>
      )}
    />
  );
};
