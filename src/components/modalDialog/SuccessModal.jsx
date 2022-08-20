import IconSuccess from "assets/images/modal/success/success_modal_img.svg";
import Modal from "../Modal";
import NewSuccess from "assets/images/new-success.svg";
import { Link } from "react-router-dom";

const SuccessModal = ({
  handleClose,
  show,
  message,
  subMessage,
  buttonText,
  redirection = "/",
}) => {
  const btnText = buttonText ? buttonText : "CLOSE";
  const bodyMsg = message ? message : "Successfully saved.";
  return (
    <Modal
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
      showCloseIcon={false}
    >
      <div className="text-center mt-2">
        <img className="block mx-auto" src={NewSuccess} alt="" />
        <div className="mb-2 text-[28px] font-black txtblack dark:text-white w-[350px] mx-auto">
          {bodyMsg}
        </div>
        <p className="text-[#7D849D] text-[16px]">{subMessage}</p>
        <div className="flex justify-center">
          <Link to={`${redirection ? redirection : "/"}`}>
            <button
              type="button"
              className="rounded-[4px] py-2 mt-2 mb-4 px-4 bg-[#9A5AFF] bg-opacity-[0.1] text-[#9A5AFF] w-[125px] text-[14px] font-black"
              onClick={(e) => {
                handleClose(false);
              }}
            >
              <span>{btnText}</span>
            </button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
