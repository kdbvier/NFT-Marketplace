import { useState } from "react";
import "assets/css/tab.css";
import ProjectCard from "./ProjectCard";
import WorkCard from "./WorkCard";
import CollectionCard from "./CollectionCard";
import Modal from "components/Modal";

const Tab = (props) => {
  const [active, setActive] = useState(props.tabs[0]);
  const [modalInfo, setModalInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  function openModal(card) {
    console.log(card);
    setModalInfo(card);
    setShowModal(true);
  }
  return (
    <div>
      <div className="container px-4 mx-auto">
        <div className="buttonGroup">
          {props.tabs.map((type) => (
            <button
              className={`max-w-[418px] ${
                active.name === type.name ? "activeBUttonTab" : ""
              }`}
              key={type.id}
              onClick={() => setActive(type)}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      <div className="tabDivider"></div>
      <div className="tabContent">
        {active.name === "PROJECT" && (
          <div className="container mx-auto">
            {active.cardList.length === 0 ? (
              <div>No Projects yet</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {active.cardList.map((cardlist) => (
                  <div key={cardlist.id}>
                    <div className="projectCardLayout">
                      <ProjectCard cardInfo={cardlist} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {active.name === "WORK" && (
          <div className="container mx-auto md:px-4">
            {active.cardList.length === 0 ? (
              <div>No works yet</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                {active.cardList.map((cardlist) => (
                  <div key={cardlist.id}>
                    <div
                      className="workCardLayout"
                      onClick={() => openModal(cardlist)}
                      key={cardlist.id}
                    >
                      <WorkCard key={cardlist.id} cardInfo={cardlist} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {active.name === "COLLECTION" && (
          <div className="container mx-auto">
            {active.cardList.length === 0 ? (
              <div>No collections yet</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:px-5 ">
                {active.cardList.map((cardlist) => (
                  <div key={cardlist.id} className="collectionCardLayout">
                    <CollectionCard cardInfo={cardlist} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <Modal show={showModal} handleClose={() => setShowModal(false)}>
          <div className="mx-4 my-6 text-left">
            <div className="flex">
              <div>
                <img
                  src={modalInfo.img}
                  className="h-[250px] w-[400px] rounded "
                  alt=""
                />
                <div className="mt-3 font-bold">{modalInfo.title}</div>
                <div className="mt-2">
                  {modalInfo.details.metadata.description}
                </div>
              </div>
              <div className="md:ml-3">
                <div>
                  {" "}
                  <span className="font-bold">Balance:</span>{" "}
                  <span>{modalInfo.details.balance}</span>
                </div>
                <div className="mt-2">
                  <span className="font-bold">Address:</span>
                  <span>{modalInfo.details.contract.address}</span>
                </div>
                <div className="mt-2">
                  <h3 className="font-bold mb-3">Attributes</h3>
                  <div>
                    <div className="">
                      {modalInfo.details.metadata.attributes && (
                        <div>
                          {modalInfo.details.metadata.attributes.map(
                            (i, index) => (
                              <div key={index} className="my-3">
                                <span className="mx-3  rounded px-4 py-1 bg-[grey] text-[white]">
                                  {i.trait_type} :
                                </span>
                                <span>{i.value}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Tab;
