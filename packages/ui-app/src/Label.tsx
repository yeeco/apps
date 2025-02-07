// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import LabelHelp from './LabelHelp';

interface Props extends BareProps {
  help?: React.ReactNode;
  label?: React.ReactNode;
  withEllipsis?: boolean;
}

export default class Label extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, help, label, withEllipsis } = this.props;

    return (
      <label className={className}>
        {
          withEllipsis
            ? <div className='withEllipsis'>{label}</div>
            : label
        }{help && <LabelHelp help={help} />}
      </label>
    );
  }
}
