import Modal from 'components/Commons/Modal';
import React from 'react';

import Splitter from 'components/Project/RoyaltySplitter/components/Splitter';

export default function CreateSplitter({
  handleClose,
  show,
  splitterId,
  onGetSplitterList,
  onDraftSave,
  onDelete,
}) {
  return (
    <>
      <Modal
        width={800}
        height={500}
        overflow={'auto'}
        show={show}
        handleClose={() => handleClose(false)}
        showCloseIcon={true}
      >
        <div className='mt-2'>
          <h3 className='text-txtblack mb-4 !text-[22px]'>
            {splitterId
              ? 'Update royalty splitter'
              : 'Create a Royalty Splitter'}
          </h3>

          <Splitter
            isModal={true}
            createSplitterClose={handleClose}
            splitterId={splitterId}
            onGetSplitterList={onGetSplitterList}
            onDraftSave={onDraftSave}
            onDelete={onDelete}
          />
        </div>
      </Modal>
    </>
  );
}
