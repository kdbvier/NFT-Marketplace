import { useSelector } from "react-redux";
import noProject from "assets/images/profile/no-project.svg";
import emptyProject from "assets/images/profile/empty-project.svg";
import { useParams } from "react-router-dom";

const EmptyCaseCard = (props) => {
  return (
    <>
      {props.userType === "self" ? (
        <section className="text-center py-6">
          <img
            className="inline-block mb-4 md:mb-7"
            src={emptyProject}
            alt="This user haven’t create any Project."
          />
          <div className="text-color-ass-2 font-bold text-lg md:text-[26px]">
            You doesn't have any NFT for this project.
            <br /> let’s go, mint a NFT!
          </div>
          <button
            type="button"
            className="btn-outline-primary-gradient btn-md mt-5"
            disabled={true}
          >
            <span>
              MINT NFT <i className="fa-thin fa-square-plus ml-2"></i>
            </span>
          </button>
        </section>
      ) : (
        <>
          <section className="text-center py-3">
            <img
              className="inline-block mb-4"
              src={noProject}
              alt="This user haven’t create any Project."
            />
            <div className="text-color-ass-2 font-bold text-lg md:text-[26px]">
              This project doesn't have any NFT yet.
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default EmptyCaseCard;