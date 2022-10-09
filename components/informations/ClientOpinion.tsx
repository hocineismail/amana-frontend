import React from "react";
import { FaQuoteRight } from "react-icons/fa";
import Carousel from "react-elastic-carousel";
import Container from "../common/container/Container";
type Props = {};

export default function ClientOpinion({}: Props) {
  return (
    <div
      className=" pt-20  pt-50 m-auto bg-blue rounded-t-3xl "
      style={{
        marginTop: "-40px",
        position: "relative",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{ marginTop: "-130px" }}
        className="w-24 h-24 bg-orange m-auto rounded-full pt-6 pl-6 "
      >
        <FaQuoteRight className="text-blue text-bold  " size={50} />
      </div>
      <div className="mt-20 mb-20">
        <Container>
          <Carousel enableAutoPlay={true} isRTL={false} itemsToShow={1}>
            <div className="team-grid">
              <div>
                <img
                  src={"/images/avatar.jpg"}
                  className="review-avatar rounded-xl"
                />
              </div>
              <div>
                <p className="text-white text-lg font-bold  review-text ">
                  {" "}
                  Interviewing can be nerve-wracking, but with this interactive
                  tool I was able to gain confidence by polishing my answers,
                  being aware of timing, and paying attention to my non-verbal
                  language - things that I would not have paid attention to
                  otherwise
                </p>
              </div>
            </div>
            <div className="team-grid">
              <div>
                <img
                  src={"/images/avatar.jpg"}
                  className="review-avatar rounded-xl"
                />
              </div>
              <div>
                <p className="text-white text-lg font-bold  review-text ">
                  {" "}
                  Interviewing can be nerve-wracking, but with this interactive
                  tool I was able to gain confidence by polishing my answers,
                  being aware of timing, and paying attention to my non-verbal
                  language - things that I would not have paid attention to
                  otherwise
                </p>
              </div>
            </div>
            <div className="team-grid">
              <div>
                <img
                  src={"/images/avatar.jpg"}
                  className="review-avatar rounded-xl"
                />
              </div>
              <div>
                <p className="text-white text-lg font-bold  review-text ">
                  {" "}
                  Interviewing can be nerve-wracking, but with this interactive
                  tool I was able to gain confidence by polishing my answers,
                  being aware of timing, and paying attention to my non-verbal
                  language - things that I would not have paid attention to
                  otherwise
                </p>
              </div>
            </div>
          </Carousel>
        </Container>
      </div>
    </div>
  );
}
