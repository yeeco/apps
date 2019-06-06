// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types';
import { CodeStored } from '@polkadot/app-contracts/types';

import React from 'react';
import styled from 'styled-components';
import { withMulti } from '@polkadot/ui-api';
import { CopyButton, Icon, Messages } from '@polkadot/ui-app';
import { classes, toShortAddress } from '@polkadot/ui-app/util';
import contracts from '@polkadot/app-contracts/store';

import Row, { RowProps, RowState, styles } from './Row';
import translate from './translate';

type Props = RowProps & {
  code: CodeStored,
  withMessages?: boolean
};

type State = RowState & {
  codeHash: string
};

const DEFAULT_HASH = '0x';
const DEFAULT_NAME = '<unknown>';

const CodeIcon = styled.div`
  & {
    margin-right: 1em;
    background: #eee;
    color: #666;
    width: 4rem;
    height: 5rem;
    padding: 0.5rem;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;

class CodeRow extends Row<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState();
  }

  static getDerivedStateFromProps ({ code: { json } }: Props, prevState: State): State | null {

    const codeHash = json.codeHash || DEFAULT_HASH;
    const name = json.name || DEFAULT_NAME;
    const tags = json.tags || [];

    const state = { tags } as State;
    let hasChanged = false;

    if (codeHash !== prevState.codeHash) {
      state.codeHash = codeHash;
      hasChanged = true;
    }

    if (!prevState.isEditingName && name !== prevState.name) {
      state.name = name;
      hasChanged = true;
    }

    return hasChanged
      ? state
      : null;
  }

  render () {
    const { className, isInline, style } = this.props;

    return (
      <div
        className={classes('ui--Row', isInline && 'inline', className)}
        style={style}
      >
        <div className='ui--Row-base'>
          {this.renderIcon()}
          <div className='ui--Row-details'>
            {this.renderName()}
            {this.renderCodeHash()}
            {this.renderTags()}
          </div>
          {this.renderButtons()}
        </div>
        {this.renderMessages()}
        {this.renderChildren()}
      </div>
    );
  }

  private createState () {
    const { code: { json: { codeHash = DEFAULT_HASH, name = DEFAULT_NAME, tags = [] } } } = this.props;

    return {
      codeHash,
      isEditingName: false,
      isEditingTags: false,
      name,
      tags
    };
  }

  protected renderCodeHash () {
    const { codeHash } = this.state;

    return (
      <>
        <div className='ui--Row-name'>
          {name}
        </div>
        <div className='ui--Row-accountId'>
          <CopyButton
            isAddress
            value={codeHash}
          >
            <span>{toShortAddress(codeHash)}</span>
          </CopyButton>
        </div>
      </>
    );
  }

  protected renderButtons () {
    const { buttons } = this.props;

    if (!buttons) {
      return null;
    }

    return (
      <div className='ui--Row-buttons'>
        {buttons}
      </div>
    );
  }

  protected renderIcon () {
    return (
      <CodeIcon>
        <Icon
          name='code'
          size='large'
        />
      </CodeIcon>
    );
  }

  protected renderMessages () {
    const { code: { contractAbi }, withMessages } = this.props;

    if (!withMessages || !contractAbi) {
      return null;
    }

    return (
      <Messages
        contractAbi={contractAbi!}
        isRemovable
      />
    );
  }

  protected saveName = () => {
    const { codeHash, name } = this.state;
    const trimmedName = name.trim();

    // Save only if the name was changed or if it's no empty.
    if (trimmedName && codeHash) {
      contracts.saveCode(new Hash(codeHash), { name });

      this.setState({ isEditingName: false });
    }
  }

  protected saveTags = () => {
    const { codeHash, tags } = this.state;

    if (codeHash) {
      contracts.saveCode(new Hash(codeHash), { tags });

      this.setState({ isEditingTags: false });
    }
  }
}

export default withMulti(
  styled(CodeRow as React.ComponentClass<Props>)`
    ${styles}
  `,
  translate
);
