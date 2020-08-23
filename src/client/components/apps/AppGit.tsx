import React from 'react';

interface Props {
  gitUrl: string;
  gitBranch: string;
}

export const AppGit: React.FC<Props> = (props) => {
  const { gitUrl, gitBranch } = props;

  return (
    <React.Fragment>
      <a href={gitUrl} target='_blank' rel='noreferrer'>
        {gitUrl}
      </a>{' '}
      {`(${gitBranch})`}
    </React.Fragment>
  );
};
