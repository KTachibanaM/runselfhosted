import React from 'react';

interface Props {
  webAddress: string;
}

export const AppWebAddress: React.FC<Props> = (props) => {
  const { webAddress } = props;
  if (!webAddress) {
    return <React.Fragment>N/A</React.Fragment>;
  }
  return (
    <a href={webAddress} target='_blank' rel='noreferrer'>
      {webAddress}
    </a>
  );
};
