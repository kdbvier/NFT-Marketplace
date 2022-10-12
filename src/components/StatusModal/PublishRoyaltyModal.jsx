import {useMemo} from 'react';
import StatusModal from './index';

const PublishRoyaltyModal = (props) => {
  const {
    status,
    ...otherProps
  } = props;

  const textStatus = useMemo(() => {
    if (status === 1) {
      return 'Creating the contract';
    }

    if (status === 2) {
      return 'Contract created. Now, we are publishing it.'
    }

    return '';
  }, [status]);

  return (
    <StatusModal {...otherProps} status={textStatus} />
  );
};

export default PublishRoyaltyModal;
