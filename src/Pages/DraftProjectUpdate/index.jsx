import { useState, useCallback, useEffect } from "react";
import "assets/css/CreateProject/mainView.css";
import {
  checkUniqueProjectName,
  deleteAssetsOfProject,
  updateProject,
  getProjectDetailsById,
} from "services/project/projectService";
import selectTypeTabData from "Pages/DraftProjectUpdate/projectCreateData";
import LeftSideBar from "components/DraftProjectUpdate/LeftSideBar";
import SelectType from "components/DraftProjectUpdate/SelectType";
import Outline from "components/DraftProjectUpdate/Outline";
import Token from "components/DraftProjectUpdate/Token";
import DraftLogo from "assets/images/projectCreate/draftLogo.svg";
import Modal from "components/Modal";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function DraftProjectUpdate() {
  const history = useHistory();
  /**
   * ==============================================
   * Project Type Start
   * ==============================================
   */
  const [selectedTab, setSelectedTab] = useState(selectTypeTabData[0]);
  const [votingPower, setVotingPower] = useState("");
  const [canVote, setCanVote] = useState("");
  const { id } = useParams();
  const [isDataLoading, setDataIsLoading] = useState(true);
  function setActiveTab(arg) {
    setSelectedTab(arg);
  }
  function votingPowerProps(params) {
    setVotingPower(params);
  }
  function canVoteProps(params) {
    setCanVote(params);
  }
  /**
   * ==============================================
   * Project Type End
   * ==============================================
   */

  /**
   * ==============================================
   * Outline Start
   * ==============================================
   */

  // Project Name start
  const [projectName, setProjectName] = useState("");
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  async function onProjectNameChange(e) {
    let payload = {
      projectName: e,
    };
    setProjectName(payload.projectName);
    await checkUniqueProjectName(payload)
      .then((e) => {
        if (e.code === 0) {
          setemptyProjectName(false);
          setAlreadyTakenProjectName(false);
        } else {
          setAlreadyTakenProjectName(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // Project Name End

  // Cover photo start
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const onCoverPhotoSelect = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      setCoverPhoto(acceptedFiles);
      let objectUrl = URL.createObjectURL(acceptedFiles[0]);
      let coverPhotoInfo = {
        path: objectUrl,
      };
      setCoverPhotoUrl(coverPhotoInfo);
      setoutlineKey(1);
    }
  }, []);
  function onCoverPhotoRemove() {
    console.log(coverPhotoUrl);
    if (coverPhotoUrl.id) {
      let payload = {
        projectId: id,
        assetsId: coverPhotoUrl.id,
      };
      deleteAssetsOfProject(payload).then((e) => {
        setCoverPhoto([]);
        setCoverPhotoUrl("");
      });
    } else {
      setCoverPhoto([]);
      setCoverPhotoUrl("");
    }

    setCoverPhoto([]);
    setCoverPhotoUrl("");
  }
  // Cover photo end

  // photos start
  const [photos, setPhotos] = useState([]);
  const [photosUrl, setPhotosUrl] = useState([]);

  const onPhotosSelect = useCallback((params, photos) => {
    if (photosLengthFromResponse + params.length > 4) {
      alert("Maxmimum 4 photos");
    } else {
      let totalSize = 0;
      params.forEach((element) => {
        totalSize = totalSize + element.size;
      });
      if (totalSize > 16000000) {
        alert("Size Exceed");
      } else {
        let objectUrl = [];
        params.forEach((element) => {
          objectUrl.push({
            name: element.name,
            path: URL.createObjectURL(element),
          });
        });
        let megred = [...photos, ...objectUrl];
        setPhotosUrl(megred);
        setPhotos(params);
      }
    }
  }, []);
  async function onPhotosRemove(i) {
    if (i.id) {
      let payload = {
        projectId: id,
        assetsId: i.id,
      };
      await deleteAssetsOfProject(payload).then((e) => {
        setUpPhotos();
      });
    } else {
      setPhotosUrl(photosUrl.filter((x) => x.name !== i.name));
    }
  }
  // Photos End

  // overview start
  const [overview, setOverview] = useState("");
  function onOverviewChange(e) {
    setOverview(e.target.value);
  }
  // overview End

  // category start
  const [projectCategory, setProjectCategory] = useState("");
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  function onProjectCategoryChange(e) {
    setProjectCategory(e.target.value);
    setEmptyProjectCategory(false);
  }
  // category end

  // tags start
  const [tagList, setTagList] = useState([]);
  const [tagLimit, setTagLimit] = useState(false);
  function onTagEnter(event) {
    const value = event.target.value;
    if (event.code === "Enter" && value.length > 0) {
      if (tagList.length > 4) {
        setTagLimit(true);
      } else {
        setTagList([...tagList, value]);
        event.target.value = "";
      }
    }
  }
  function onTagRemove(index) {
    if (index >= 0) {
      const newRoleList = [...tagList];
      newRoleList.splice(index, 1);
      setTagList(newRoleList);
      setTagLimit(false);
    }
  }
  // tag end

  // role start
  const [roleList, setRoleList] = useState([]);
  function onRoleEnter(event) {
    const value = event.target.value;
    if (event.code === "Enter" && value.length > 0) {
      setRoleList([...roleList, value]);
      event.target.value = "";
    }
  }
  function onRoleRemove(index) {
    if (index >= 0) {
      const newRoleList = [...roleList];
      newRoleList.splice(index, 1);
      setRoleList(newRoleList);
    }
  }

  // role end

  // Need mamber start
  const [needMember, setNeedMember] = useState(false);
  function onNeedMemberChange(e) {
    if (e) {
      setNeedMember(true);
    } else {
      setRoleList([]);
      setNeedMember(false);
    }
  }
  // need member end

  const [outlineKey, setoutlineKey] = useState(0);
  const [photosLengthFromResponse, setPhotosLengthFromResponse] = useState(0);
  const [remainingPhotosName, setRemainingPhotosName] = useState([]);

  /**
   * ==============================================
   * Outline ENd
   * ==============================================
   */
  async function projectDetails() {
    let payload = {
      id: id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      // project type start
      if (response.org_type !== "") {
        let org_type = selectTypeTabData.find(
          (x) => x.title === response.org_type.toUpperCase()
        );
        setSelectedTab(org_type);
        if (response.org_type === "custom") {
          let votingPowerIndex = selectTypeTabData[0].votingPower.findIndex(
            (x) => x.value === response.voting_power
          );
          let canVoteIndex = selectTypeTabData[0].canVote.findIndex(
            (x) => x.value === response.voter_mode
          );
          selectTypeTabData[0].votingPower[votingPowerIndex].active = true;
          selectTypeTabData[0].canVote[canVoteIndex].active = true;
          setVotingPower(selectTypeTabData[0].votingPower[votingPowerIndex]);
          setCanVote(selectTypeTabData[0].canVote[canVoteIndex]);
        }
      }
      // project type end

      // outline start
      setProjectName(response.name);
      let cover = response.assets.find((x) => x.asset_purpose === "cover");

      setCoverPhotoUrl(cover ? cover : "");
      let photosInfoData = response.assets.filter(
        (x) => x.asset_purpose === "subphoto"
      );
      setPhotosLengthFromResponse(photosInfoData.length);
      setPhotosUrl(photosInfoData);
      let constPhotosName = ["img1", "img2", "img3", "img4"];
      let photosname = [];
      photosname = photosInfoData.map((e) => {
        return e.name;
      });
      let remainingPhotosName = constPhotosName.filter(function (v) {
        return !photosname.includes(v);
      });
      setRemainingPhotosName(remainingPhotosName);
      setOverview(response.overview);
      setProjectCategory(response.category_id);
      if (response.tags) {
        if (response.tags.length > 0) {
          let tags = [];
          response.tags.forEach((element) => {
            tags.push(element.name);
          });
          setTagList(tags);
        }
      }
      setNeedMember(response.member_needed);
      if (response.roles) {
        if (response.roles.length > 0) {
          let roles = [];
          response.roles.forEach((element) => {
            roles.push(element.name);
          });
          setRoleList(roles);
        }
      }
      // outline end
      setDataIsLoading(false);
    });
  }
  useEffect(() => {
    projectDetails();
  }, []);

  async function setUpPhotos() {
    let payload = {
      id: id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      let photosInfoData = response.assets.filter(
        (x) => x.asset_purpose === "subphoto"
      );
      setPhotosLengthFromResponse(photosInfoData.length);
      setPhotosUrl(photosInfoData);
      let constPhotosName = ["img1", "img2", "img3", "img4"];
      let photosname = [];
      photosname = photosInfoData.map((e) => {
        return e.name;
      });
      let remainingPhotosName = constPhotosName.filter(function (v) {
        return !photosname.includes(v);
      });
      setRemainingPhotosName(remainingPhotosName);
    });
  }
  const [currentStep, setcurrentStep] = useState([1]);
  const [isLoading, setIsloading] = useState(false);
  const [isLoadingPublic, setisLoadingPublic] = useState(false);
  const [isLoadingPrivate, setisLoadingPrivate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  function handelClickNext() {
    // Select type start
    if (currentStep.length === 1) {
      if (selectedTab.title === "CUSTOM") {
        if (votingPower === "" && canVote === "") {
          alert("Chosse 1 who have voting power and who can vote");
        } else if (votingPower === "") {
          alert("Chosse 1 who have voting power");
        } else if (canVote === "") {
          alert("Chosse 1 who can vote");
        } else if (votingPower !== "" && canVote !== "") {
          setcurrentStep([1, 2]);
        }
      } else {
        setcurrentStep([1, 2]);
      }
    }
    // Select type end

    // Outline start
    if (currentStep.length === 2) {
      if (projectName === "") {
        setemptyProjectName(true);
      } else if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else {
        setcurrentStep([1, 2, 3]);
      }
    }
    // Outline end

    // Token  start
    if (currentStep.length === 3) {
      setcurrentStep([1, 2, 3, 4]);
    }
    // Token end
  }
  async function saveDraft(visibility) {
    // Select type start
    if (currentStep.length === 1) {
      if (visibility === "private") {
        setisLoadingPrivate(true);
      } else if (visibility === "public") {
        setisLoadingPublic(true);
      }

      let selectType = {
        id: id,
        org_type: selectedTab.title.toLocaleLowerCase(),
        voting_power: selectedTab.votingPower.find((x) => x.active === true)
          .value,
        voter_mode: selectedTab.canVote.find((x) => x.active === true).value,
        visibility: visibility,
      };
      await updateProject("update", selectType)
        .then(() => {
          if (visibility === "private") {
            setisLoadingPrivate(false);
          } else if (visibility === "public") {
            setisLoadingPublic(false);
          }
          setShowModal(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // select type end

    // outline start
    if (currentStep.length === 2) {
      if (projectName === "") {
        setemptyProjectName(true);
      } else if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== "" &&
        projectCategory !== "" &&
        !alreadyTakenProjectName
      ) {
        if (visibility === "private") {
          setisLoadingPrivate(true);
        } else if (visibility === "public") {
          setisLoadingPublic(true);
        }

        let updatePayload = {
          id: id,
          org_type: selectedTab.title.toLocaleLowerCase(),
          voting_power: selectedTab.votingPower.find((x) => x.active === true)
            .value,
          voter_mode: selectedTab.canVote.find((x) => x.active === true).value,
          visibility: visibility,
          name: projectName,
          category_id: projectCategory,
          overview: overview,
          tags: tagList.toString(),
          need_member: needMember,
          roles: roleList.toString(),
          cover: coverPhoto.length > 0 ? coverPhoto[0] : null,
          photos: photos.length > 0 ? photos : null,
          photosLengthFromResponse: photosLengthFromResponse,
          remainingPhotosName: remainingPhotosName,
        };
        updateProject("update", updatePayload)
          .then((res) => {
            if (visibility === "private") {
              setisLoadingPrivate(false);
            } else if (visibility === "public") {
              setisLoadingPublic(false);
            }
            setShowModal(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // outline end
  }
  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }
  return (
    <div>
      {isDataLoading && <div className="loading"></div>}
      <div className="flex flex-col md:flex-row ">
        <div className="hidden md:block md:relative bg-[#f6f6f7]  w-full md:w-64 lg:w-80  content-center">
          <LeftSideBar currentStep={currentStep} key={currentStep} />
        </div>
        <div className="flex-1">
          <div className="stepTitleName">STEP{currentStep.length}</div>
          <div className="cardContainer px-3 md:px-5">
            {currentStep.length === 1 && (
              <SelectType
                setActiveTab={setActiveTab}
                votingPowerProps={votingPowerProps}
                canVoteProps={canVoteProps}
                selectedTab={selectedTab}
              />
            )}
            {currentStep.length === 2 && (
              <Outline
                key={outlineKey}
                // name
                projectName={projectName}
                emptyProjectName={emptyProjectName}
                alreadyTakenProjectName={alreadyTakenProjectName}
                onProjectNameChange={onProjectNameChange}
                //cover photos
                coverPhotoUrl={coverPhotoUrl}
                onCoverPhotoSelect={onCoverPhotoSelect}
                onCoverPhotoRemove={onCoverPhotoRemove}
                //photos
                photosUrl={photosUrl}
                onPhotosSelect={onPhotosSelect}
                onPhotosRemove={onPhotosRemove}
                // overview
                overview={overview}
                onOverviewChange={onOverviewChange}
                // category
                projectCategory={projectCategory}
                emptyProjeCtCategory={emptyProjeCtCategory}
                onProjectCategoryChange={onProjectCategoryChange}
                // tag
                tagList={tagList}
                tagLimit={tagLimit}
                onTagEnter={onTagEnter}
                onTagRemove={onTagRemove}
                // need member
                needMember={needMember}
                onNeedMemberChange={onNeedMemberChange}
                // role list
                roleList={roleList}
                onRoleEnter={onRoleEnter}
                onRoleRemove={onRoleRemove}
              />
            )}
            {currentStep.length === 3 && <Token />}
            {/* {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />}
        {currentStep === 1 && <SelectType />} */}
            <div className="buttonContainer">
              <div
                className={
                  currentStep.length > 1
                    ? "flex justify-between"
                    : "flex justify-end"
                }
              >
                {currentStep.length > 1 ? (
                  <button
                    className="backButton"
                    onClick={() => handelClickBack()}
                    disabled={
                      isLoadingPrivate ? true : isLoadingPublic ? true : false
                    }
                  >
                    BACK
                  </button>
                ) : (
                  <button
                    className="nextButton"
                    onClick={() => handelClickNext()}
                  >
                    NEXT
                  </button>
                )}
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <button
                  onClick={() => saveDraft("private")}
                  disabled={isLoadingPrivate ? true : false}
                  className={`
                  ${
                    isLoadingPrivate === true ? "onlySpinner" : ""
                  } h-[54px] w-[200px] rounded bg-[#B9CCD5] text-[white] hover:bg-[#192434]
                `}
                >
                  {isLoadingPrivate ? "" : "PRIVATE"}
                </button>
                <button
                  onClick={() => saveDraft("public")}
                  disabled={isLoadingPublic ? true : false}
                  className={`
                  ${
                    isLoadingPublic === true ? "onlySpinner" : ""
                  } h-[54px] w-[200px] rounded bg-[#B9CCD5] text-[white] hover:bg-[#192434]
                `}
                >
                  {isLoadingPublic ? "" : "PUBLIC"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <Modal
            height={361}
            width={800}
            show={showModal}
            handleClose={() => setShowModal(false)}
          >
            <div className="text-center">
              <img
                className="w-[151px] h-[133px] block mx-auto mt-[50px]"
                src={DraftLogo}
                alt=""
              />
              <div className="mb-4 text-[20px] font-bold color-[#192434] draftModalText">
                Your project saved the draft.
              </div>
              <div className="font-roboto mb-6">
                You can edit information from your project list
              </div>
              <button className="w-[200px] h-[54px] bg-[#0AB4AF] rounded text-white">
                PROJECT LIST
              </button>
            </div>
          </Modal>
        )}
      </div>
      {showModal && (
        <Modal
          height={361}
          width={800}
          show={showModal}
          handleClose={() => setShowModal(false)}
        >
          <div className="text-center">
            <img
              className="w-[151px] h-[133px] block mx-auto mt-[50px]"
              src={DraftLogo}
              alt=""
            />
            <div className="mb-4 text-[20px] font-bold color-[#192434] draftModalText">
              Your project saved the draft.
            </div>
            <div className="font-roboto mb-6">
              You can edit information from your project list
            </div>
            <button
              onClick={() => history.push("/profile-project-list")}
              className="w-[200px] h-[54px] bg-[#0AB4AF] rounded text-white"
            >
              PROJECT LIST
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
