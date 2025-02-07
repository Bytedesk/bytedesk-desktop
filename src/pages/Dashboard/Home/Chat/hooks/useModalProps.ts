/* eslint-disable @typescript-eslint/no-explicit-any */
export const useModalProps = (modalStates: any, handleModalClose: any) => {
  const modalProps = {
    ...modalStates,
    ...handleModalClose
  };

  return modalProps;
}; 