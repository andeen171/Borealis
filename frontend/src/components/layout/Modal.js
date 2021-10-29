import React, { useState } from "react";
import Carousel, { Modal, ModalGateway } from "react-images";

export default function LightBox({
  modalOpen,
  images,
  handleModal,
  currentImage,
}) {
  return (
    <ModalGateway>
      {modalOpen ? (
        <Modal onClose={() => handleModal()}>
          <Carousel
            currentIndex={currentImage}
            views={images.map((x) => ({
              ...x,
              srcset: x.srcSet,
            }))}
          />
        </Modal>
      ) : null}
    </ModalGateway>
  );
}
