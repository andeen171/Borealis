import React, { useEffect } from "react";
import Header from "./layout/Header";
import Carousel from "react-multi-carousel";
import { Image } from "semantic-ui-react";
import { useState } from "react";
import LightBox from "./layout/Modal.js";
import Box from "@material-ui/core/Box";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../actionCreators";
import { Typography } from "@material-ui/core";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    paritialVisibilityGutter: 60,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    paritialVisibilityGutter: 50,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30,
  },
};

export default function OrderDetailPage(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(false);
  const [arrowsShow, setArrowsShow] = useState(false);
  const order = useSelector((state) => state.orders.order);
  const dispatch = useDispatch();
  const { getOrderDetails } = bindActionCreators(actionCreators, dispatch);
  const orderCode = props.match.params.orderCode;
  useEffect(() => {
    getOrderDetails(orderCode);
  }, []);
  console.log(typeof order.image);
  const handleModal = (idx) => {
    setModalOpen(!modalOpen);
    setCurrentImage(idx);
  };
  return (
    <React.Fragment>
      <Header />
      <Typography variant="h4">{order.title}</Typography>
      <Typography variant="h6">{order.description}</Typography>
      <Box
        onMouseEnter={() => setArrowsShow(true)}
        onMouseLeave={() => setArrowsShow(false)}
      >
        <Carousel
          keyBoardControl={false}
          // focusOnSelect={true}
          responsive={responsive}
          // infinite
          arrows
          // arrows={arrowsShow}
          // showDots={arrowsShow}
          showDots
          dotListClass="dotsList"
        >
          {order.image.map((image, idx) => {
            return (
              <Image
                key={image}
                draggable={false}
                src={image.src}
                onClick={() => handleModal(idx)}
                className={idx === 0 ? "first-item" : "image-items"}
              />
            );
          })}
        </Carousel>
        <LightBox
          images={order.image}
          handleModal={handleModal}
          currentImage={currentImage}
          modalOpen={modalOpen}
        />
      </Box>
    </React.Fragment>
  );
}
