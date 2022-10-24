import React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DebounceInput } from "react-debounce-input";
import Tooltip from "components/Commons/Tooltip";
import Modal from "components/Commons/Modal";
import SuccessModal from "components/Modals/SuccessModal";
import { useLocation } from "react-router-dom";
import { mockCreateProject } from "services/project/projectService";
import { mockCreateCollection } from "services/collection/collectionService";
import {
  generateUploadkey,
  createMembershipNft,
  getassetDetails,
  getNftDetails,
  updateMembershipNFT,
} from "services/nft/nftService";
import { updateRoyaltySplitter } from "services/collection/collectionService";

import axios from "axios";
import Config from "config/config";
import { getNotificationData } from "Slice/notificationSlice";
import { getFunctionStatus } from "services/websocketFunction/webSocketFunctionService";
import { getAsset } from "services/notification/notificationService";
import { useHistory } from "react-router-dom";
export default function MembershipNFT() {
  const history = useHistory();
  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );

  let query = useQuery();
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isListUpdate, setIsListUpdate] = useState(false);
  const nftList = [
    {
      tierName: "",
      assets: {
        file: null,
        path: null,
        isFileError: false,
        limitExceeded: false,
      },
      // nftName: "",
      externalLink: "",
      description: "",
      benefits: [{ title: "" }],
      properties: [
        {
          key: "",
          value: "",
          value_type: "string",
          display_type: "properties",
        },
      ],
      sensitiveContent: false,
      supply: "",
      isOpen: true,
      blockchainCategory: "polygon",
      indexId: 1,
    },
  ];
  const [nfts, setNfts] = useState(nftList);
  const audioRef = useRef();
  const [checkedValidation, setCheckedValidation] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [indexOfNfts, setIndexOfNfts] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dao_id, setDao_id] = useState(null);
  const [collection_id, setCollection_id] = useState(null);
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectInfo, setProjectInfo] = useState({});
  const jobIds = [];
  const [calledIds, setCalledIds] = useState([]);
  const [showDataUploadingModal, setShowDataUploadingModal] = useState(false);
  const [nftItem, setNft] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [isNftLoading, setIsNftLoading] = useState(false);
  const [asseteRemoveInUpdateMode, setAsseteRemoveInUpdateMode] =
    useState(false);
  function onTextfieldChange(index, fieldName, value) {
    setValue(index, fieldName, value);
  }
  function setValue(index, fieldName, value) {
    let oldNfts = [...nfts];
    oldNfts[index][fieldName] = value;
    setNfts(oldNfts);
  }
  function addMoreTier() {
    let oldNfts = [...nfts];
    oldNfts.push({
      tierName: "",
      assets: {
        file: null,
        path: null,
        isFileError: false,
        limitExceeded: false,
      },
      // nftName: "",
      externalLink: "",
      description: "",
      benefits: [{ title: "" }],
      properties: [
        {
          key: "",
          value: "",
          value_type: "string",
          display_type: "properties",
        },
      ],
      sensitiveContent: false,
      supply: "",
      isOpen: true,
      blockchainCategory: "polygon",
      indexId: oldNfts.length + 1,
    });
    setNfts(oldNfts);
  }
  function deleteNfs(index) {
    let oldNfts = [...nfts];
    oldNfts.splice(index, 1);
    setNfts(oldNfts);
  }
  function nftFileChangeHandler(event, index) {
    let oldNfts = [...nfts];
    const nftFile = oldNfts[index].assets;
    try {
      const file = event.currentTarget.files[0];
      // const usedSize = 4000;
      // let totalSize = 0;
      if (file) {
        // console.log(file.size / 1024);
        //   nftFile.file = file;
        //   nftFile.path = URL.createObjectURL(file);
        //   nftFile.isFileError = false;
        // }
        // totalSize = (usedSize + file.size) / 1024 / 1024;
        // if (totalSize > 102) {
        //   nftFile.limitExceeded = true;
        //   event.currentTarget.value = "";
        //
        const size = file.size / 1024;
        if (size > 100000) {
          nftFile.limitExceeded = true;
          event.currentTarget.value = "";
        } else {
          nftFile.file = file;
          nftFile.path = URL.createObjectURL(file);
          nftFile.isFileError = false;
          if (updateMode) {
            setAsseteRemoveInUpdateMode(true);
          }
        }
      }
    } catch {
      nftFile.isFileError = true;
    }
    setNfts(oldNfts);
  }
  function addMoreBenefits(index) {
    let oldNfts = [...nfts];
    oldNfts[index].benefits.push({ title: "" });
    setNfts(oldNfts);
  }
  function onBenefitChange(index, benefitIndex, value) {
    let oldNfts = [...nfts];
    oldNfts[index].benefits[benefitIndex].title = value;
    setNfts(oldNfts);
  }
  function deleteBenefits(index, benefitIndex) {
    let oldNfts = [...nfts];
    oldNfts[index].benefits.splice(benefitIndex, 1);
    setNfts(oldNfts);
  }
  function handleOnChangePropertyType(event, index) {
    const value = event.target.value;
    let tempProperty = [...propertyList];
    const property = propertyList[index];
    property.key = value;
    setPropertyList(tempProperty);
  }
  function handleOnChangePropertyName(event, index) {
    const value = event.target.value;
    let tempProperty = [...propertyList];
    const property = tempProperty[index];
    property.value = value;
    setPropertyList(tempProperty);
  }
  function addProperty() {
    const tempProperty = [...propertyList];
    tempProperty.push({
      key: "",
      value: "",
      value_type: "string",
      display_type: "properties",
    });
    setPropertyList(tempProperty);
  }
  function removeProperty(index) {
    setIsListUpdate(true);
    let tempProperty = [...propertyList];
    tempProperty = tempProperty.filter((prop) => prop !== tempProperty[index]);
    setPropertyList(tempProperty);
    setTimeout(() => {
      setIsListUpdate(false);
    }, 50);
  }
  function onSensitiveContentChange(index) {
    let oldNfts = [...nfts];
    oldNfts[index].sensitiveContent = !oldNfts[index].sensitiveContent;
    setNfts(oldNfts);
  }
  function openPropertyModal(index) {
    setIndexOfNfts(index);
    let oldNfts = [...nfts];
    setPropertyList(oldNfts[index].properties);
    setShowPropertyModal(true);
  }
  function onSavePropertiesChange() {
    setIsListUpdate(true);
    let oldNfts = [...nfts];
    oldNfts[indexOfNfts].properties = propertyList;
    setNfts(oldNfts);
    setShowPropertyModal(false);
    setPropertyList([]);
    setTimeout(() => {
      setIsListUpdate(false);
    }, 50);
  }
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  async function daoCreate() {
    let daoId = "";
    await mockCreateProject().then((res) => {
      daoId = res.project.id;
      setDao_id(daoId);
    });
    return daoId;
  }
  async function collectionCreate(dao_id) {
    let collection_id = "";
    let payload = {
      dao_id: dao_id,
      collection_type: "membership",
    };
    await mockCreateCollection(payload).then((res) => {
      collection_id = res.collection.id;
      let members = [{ wallet_address: userinfo?.eoa, royalty: 100 }];
      let formData = new FormData();
      formData.append("royalty_data", JSON.stringify(members));
      formData.append("collection_uid", res.collection.id);
      updateRoyaltySplitter(formData);
      setCollection_id(collection_id);
      // const newUrl =
      //   window.location.protocol +
      //   "//" +
      //   window.location.host +
      //   window.location.pathname +
      //   `?collection_id=${collection_id}`;
      // window.history.pushState({ path: newUrl }, "", newUrl);
    });
    return collection_id;
  }
  async function saveNFTDetails(assetId, jobId) {
    let nft = JSON.parse(localStorage.getItem(`${jobId}`));
    const request = new FormData();
    request.append("asset_uid", assetId);
    request.append("collection_uid", collection_id);
    request.append("tier_name", nft.tier_name);
    request.append("supply", nft.supply);
    request.append("blockchain", nft.blockchain);
    request.append("description", nft.description);
    request.append("external_link", nft.external_link);
    request.append("sensitive_content", nft.sensitive_content);
    request.append("attributes", JSON.stringify(nft.properties));
    request.append("job_id", nft.job_id);
    const benefit_array = nft.benefit_array.filter((x) => x.title !== "");
    request.append("benefit_array", JSON.stringify(benefit_array));

    if (!updateMode) {
      await createMembershipNft(request)
        .then((res) => {
          localStorage.removeItem(`${jobId}`);
          const index = jobIds.indexOf(jobId);
          if (index > -1) {
            jobIds.splice(index, 1); // 2nd parameter means remove one item only
          }
          console.log("remove", jobIds.length);
          const upload_number = localStorage.getItem("upload_number");
          const update_upload_number = parseInt(upload_number) - 1;
          localStorage.setItem("upload_number", update_upload_number);
          if (update_upload_number === 0) {
            setShowDataUploadingModal(false);
            setShowSuccessModal(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (updateMode) {
      await updateMembershipNFT(nftItem.id, request)
        .then((res) => {
          setShowDataUploadingModal(false);
          setShowSuccessModal(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  async function uploadAFile(uploadKey, daoId, nft) {
    let headers;
    headers = {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
      key: uploadKey,
    };
    let formdata = new FormData();
    formdata.append("file", nft.assets.file);
    await axios({
      method: "POST",
      url: Config.FILE_SERVER_URL,
      data: formdata,
      headers: headers,
    })
      .then((response) => {
        let data = {
          collection_uid: collection_id,
          tier_name: nft.tierName,
          supply: nft.supply,
          blockchain: nft.blockchainCategory,
          description: nft.description,
          external_link: nft.externalLink,
          sensitive_content: nft.sensitiveContent,
          benefit_array: nft.benefits.filter((x) => x.title !== ""),
          job_id: response["job_id"],
          properties: nft.properties,
        };
        localStorage.setItem(`${response["job_id"]}`, JSON.stringify(data));
        jobIds.push(response["job_id"]);
        console.log("add", jobIds);
        const notificationData = {
          projectId: daoId,
          etherscan: "",
          function_uuid: response["job_id"],
          data: "",
        };
        dispatch(getNotificationData(notificationData));
      })
      .catch((err) => {
        console.log(err);
        // setIsLoading(false);
      });
  }
  async function genUploadKey() {
    let key = "";
    const request = new FormData();
    await generateUploadkey(request)
      .then((res) => {
        if (res.key) {
          key = res.key;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return key;
  }
  async function updateNFT(nft) {
    const request = new FormData();
    request.append("tier_name", nft.tierName);
    request.append("asset_uid", nftItem.asset.id);
    request.append("external_link", nft.externalLink);
    request.append("description", nft.description);
    const benefit_array = nft.benefits.filter((x) => x.title !== "");
    request.append("benefit_array", JSON.stringify(benefit_array));
    request.append("attributes", JSON.stringify(nft.properties));
    request.append("sensitive_content", nft.sensitiveContent);
    request.append("supply", nft.supply);
    await updateMembershipNFT(nftItem.id, request)
      .then((res) => {
        setShowDataUploadingModal(false);
        setShowSuccessModal(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function createBlock(validateNfts) {
    setShowDataUploadingModal(true);
    if (!updateMode) {
      if (query.get("collection_id")) {
        localStorage.setItem("upload_number", validateNfts.length);
        for (const iterator of validateNfts) {
          const key = await genUploadKey();
          if (key !== "") {
            await uploadAFile(key, dao_id, iterator);
          }
        }
        // recheckStatus();
      } else {
        const daoId = await daoCreate();
        const collection_id = await collectionCreate(daoId);
        localStorage.setItem("upload_number", validateNfts.length);
        for (const iterator of validateNfts) {
          const key = await genUploadKey(daoId, collection_id, iterator);
          if (key !== "") {
            await uploadAFile(key, daoId, iterator);
          }
        }
        // recheckStatus();
        const process_status = localStorage.getItem("upload_number");
      }
    } else if (updateMode) {
      if (!asseteRemoveInUpdateMode) {
        await updateNFT(validateNfts[0]);
      } else if (asseteRemoveInUpdateMode) {
        const uploadKey = await genUploadKey();
        if (uploadKey !== "") {
          await uploadAFile(uploadKey, dao_id, validateNfts[0]);
        }
      }
    }
  }
  async function nextHandle() {
    const validateNfts = nfts.filter(
      (element) =>
        element.tierName !== "" &&
        element.assets.file !== null &&
        element.assets.isFileError === false &&
        element.assets.limitExceeded === false &&
        element.nftName !== "" &&
        element.supply !== ""
    );

    if (isPreview) {
      if (!projectCreated) {
        await createBlock(validateNfts);
      }
    } else {
      setCheckedValidation(true);
      if (validateNfts.length === nfts.length) {
        window.scroll({ top: 0, behavior: "smooth" });
        setIsPreview(true);
      } else {
        const invalidNfts = nfts.filter(
          (element) =>
            element.tierName === "" ||
            element.assets.file === null ||
            element.assets.isFileError === true ||
            element.assets.limitExceeded === true ||
            element.nftName === "" ||
            element.supply === ""
        );
        invalidNfts.forEach((element) => {
          document.getElementById(`nft-${element.indexId}`).scrollIntoView({
            behavior: "smooth",
          });
          console.log(element.indexId);
        });
      }
    }
  }
  function validate() {
    for (const localkey in localStorage) {
      const projectDeployStatus = fileUploadNotification.find(
        (x) => x.function_uuid === localkey
      );
      // console.log(projectDeployStatus);
      if (projectDeployStatus) {
        if (projectDeployStatus.data !== "") {
          const data = JSON.parse(projectDeployStatus.data);
          if (data.Data["assetId"] && data.Data["assetId"].length > 0) {
            if (!calledIds.includes(data.Data["assetId"])) {
              saveNFTDetails(
                data.Data["assetId"],
                projectDeployStatus.function_uuid
              );
              let nftId = [...calledIds, data.Data["assetId"]];
              setCalledIds(nftId);
            }
          }
        } else {
          getassetDetails(projectDeployStatus.function_uuid).then((res) => {
            if (res.code === 0) {
              if (res["asset"] && res["asset"]["id"]) {
                const asstdata = {
                  Data: { assetId: res["asset"]["id"] },
                };
                const deployData = {
                  function_uuid: projectDeployStatus.function_uuid,
                  data: JSON.stringify(asstdata),
                };
                dispatch(getNotificationData(deployData));
              }
            } else if (res.code === 5001) {
              setTimeout(function () {
                const notificationData = {
                  projectId: projectDeployStatus.projectId,
                  etherscan: "",
                  function_uuid: projectDeployStatus.function_uuid,
                  data: "",
                };
                dispatch(getNotificationData(notificationData));
              }, 30000);
            }
          });
        }
      }
    }
  }
  async function nftDetails(type, id) {
    setIsNftLoading(true);
    await getNftDetails(type, id)
      .then((resp) => {
        if (resp.code === 0) {
          const nft = resp.lnft;
          console.log(resp);
          setUpdateMode(true);
          setNft(nft);
          onTextfieldChange(0, "tierName", nft.name);
          const assets = {
            file: { type: nft.asset.asset_type },
            path: nft.asset.path,
            isFileError: false,
            limitExceeded: false,
          };
          onTextfieldChange(0, "assets", assets);
          onTextfieldChange(0, "externalLink", nft.external_url);
          onTextfieldChange(0, "description", nft.description);
          try {
            onTextfieldChange(
              0,
              "benefits",
              JSON.parse(resp.more_info.benefits)
            );
          } catch (error) {
            console.log(error);
            onTextfieldChange(0, "benefits", []);
          }
          onTextfieldChange(0, "properties", nft.attributes);
          onTextfieldChange(0, "sensitiveContent", nft.sensitive_content);
          onTextfieldChange(0, "supply", nft.supply);

          setIsNftLoading(false);
        } else {
          setIsNftLoading(false);
        }
      })
      .catch((e) => {
        setIsNftLoading(false);
      });
  }

  useEffect(() => {
    // console.log(fileUploadNotification);
    validate();
  }, [fileUploadNotification]);
  useEffect(() => {
    setPropertyList(propertyList);
  }, [propertyList]);
  useEffect(() => {
    setNfts(nfts);
  }, [nfts]);
  useEffect(() => {
    setCollection_id(collection_id);
  }, [collection_id]);
  useEffect(() => {
    setDao_id(dao_id);
  }, [dao_id]);
  useEffect(() => {
    if (query.get("collection_id")) {
      setCollection_id(query.get("collection_id"));
    }
    if (query.get("dao_id")) {
      setDao_id(query.get("collection_id"));
    }
  }, []);
  useEffect(() => {
    try {
      const query = new URLSearchParams(history.location.search);
      const nftId = query.get("nftId");
      if (nftId) {
        nftDetails("membership", nftId);
      }
    } catch { }
  }, []);

  function removePropertyOfTier(nft, index) {
    setIsListUpdate(true);
    let tempProperty = [...nft.properties];
    tempProperty = tempProperty.filter((prop) => prop !== tempProperty[index]);
    let oldNfts = [...nfts];
    oldNfts[indexOfNfts].properties = tempProperty;
    setNfts(oldNfts);
    setTimeout(() => {
      setIsListUpdate(false);
    }, 50);
  }

  return (
    <>
      {isNftLoading && <div className="loading"></div>}
      <div className="max-w-[600px] md:mx-auto pt-6 md:pt-0 md:mt-[40px] mx-4  ">
        <div className="mb-[24px]">
          <h1 className="text-[28px] font-black mb-[6px]">
            {isPreview
              ? "Review Membership NFT"
              : updateMode
                ? "Update Membership NFT"
                : "Create Membership NFT"}
          </h1>
          <p className="text-[14px] text-textSubtle ">
            {isPreview
              ? " Review the NFT"
              : " Please fill this require data for setup your NFT"}
          </p>
        </div>
        <div>
          {nfts.map((nft, index) => (
            <div
              key={index}
              id={`nft-${index + 1}`}
              className="mb-6 rounded-[12px]  border border-divider  p-4"
            >
              {nfts.length > 1 && !isPreview && (
                <div className="text-right">
                  <i
                    onClick={() => deleteNfs(index)}
                    className="cursor-pointer fa-solid fa-trash text-danger-1/[0.7]"
                  ></i>
                </div>
              )}
              <div className="mb-6">
                <p className="txtblack text-[14px]">Tier Name</p>
                <>
                  <DebounceInput
                    minLength={1}
                    debounceTimeout={0}
                    className={`debounceInput mt-1 ${isPreview ? " !border-none bg-transparent" : ""
                      } `}
                    disabled={isPreview}
                    value={nft.tierName}
                    onChange={(e) =>
                      onTextfieldChange(index, "tierName", e.target.value)
                    }
                    placeholder="Tier name for the NFT"
                  />
                  {checkedValidation && nft.tierName === "" && (
                    <p className="validationTag">Tier Name is required</p>
                  )}
                </>
              </div>
              <div className="mb-6">
                <label
                  className="block text-[16px] font-bold font-satoshi-bold"
                  htmlFor="dropzone-file"
                >
                  Upload Assets
                </label>
                <p className="block text-[14px] text-textSubtle mb-4">
                  you can use format PNG, GIF, WEBP, MP4 or MP3. Max 100MB.
                </p>
                <div
                  className={`flex justify-center items-center max-w-full ${nft.assets.file?.type?.split("/")[0]?.toLowerCase() ===
                    "video"
                    ? ""
                    : "w-40 h-40"
                    }`}
                >
                  <label
                    htmlFor={`dropzone-file${index}`}
                    className={`flex flex-col justify-center items-center w-full  ${nft.assets.file?.type?.split("/")[0]?.toLowerCase() ===
                      "video"
                      ? ""
                      : "h-40"
                      } ${nft.assets.file ? "" : "bg-white-filled-form"
                      } rounded-xl  cursor-pointer`}
                  >
                    <div className="flex flex-col justify-center items-center pt-5 pb-6 relative">
                      {nft.assets.file ? (
                        <>
                          {nft.assets.file?.type
                            ?.split("/")[0]
                            ?.toLowerCase() === "image" && (
                              <img
                                src={nft.assets.path}
                                alt="nft"
                                className="rounded-xl  max-w-full w-40 h-40 object-cover"
                              />
                            )}
                          {nft.assets.file?.type
                            ?.split("/")[0]
                            ?.toLowerCase() === "audio" && (
                              <>
                                <i
                                  onClick={(e) => nftFileChangeHandler(e, index)}
                                  className="absolute top-0 text-[18px] cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark"
                                ></i>
                                <audio
                                  ref={audioRef}
                                  src={nft.assets.path}
                                  controls
                                  autoPlay={false}
                                  className="ml-[8rem]"
                                />
                              </>
                            )}
                          {nft.assets.file?.type
                            ?.split("/")[0]
                            ?.toLowerCase() === "video" && (
                              <>
                                <i
                                  onClick={(e) => nftFileChangeHandler(e, index)}
                                  className="absolute top-0 text-[18px] cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark"
                                ></i>
                                <video width="650" height="400" controls>
                                  <source
                                    src={nft.assets.path}
                                    type="video/mp4"
                                  />
                                </video>
                              </>
                            )}
                        </>
                      ) : (
                        <>
                          <svg
                            width="39"
                            height="39"
                            viewBox="0 0 39 39"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              opacity="0.4"
                              d="M27.8167 38.5097H11.4644C5.0695 38.5097 0.773438 34.0245 0.773438 27.3479V11.9373C0.773438 5.2606 5.0695 0.77356 11.4644 0.77356H27.8186C34.2135 0.77356 38.5095 5.2606 38.5095 11.9373V27.3479C38.5095 34.0245 34.2135 38.5097 27.8167 38.5097Z"
                              fill="#9499AE"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18.2168 13.368C18.2168 15.9529 16.113 18.0567 13.5281 18.0567C10.9413 18.0567 8.83938 15.9529 8.83938 13.368C8.83938 10.783 10.9413 8.67737 13.5281 8.67737C16.113 8.67737 18.2168 10.783 18.2168 13.368ZM33.6045 23.5805C34.0441 24.0069 34.3592 24.4937 34.5667 25.0126C35.195 26.5824 34.8686 28.4692 34.1969 30.0239C33.4007 31.8749 31.8761 33.273 29.9554 33.8843C29.1025 34.1579 28.2082 34.2749 27.3157 34.2749H11.5024C9.92882 34.2749 8.53636 33.9089 7.39484 33.2221C6.67974 32.7919 6.55332 31.8013 7.08352 31.156C7.97031 30.0805 8.84579 29.0013 9.72882 27.9126C11.4118 25.8296 12.5458 25.2258 13.8062 25.756C14.3175 25.9748 14.8307 26.305 15.359 26.6522C16.7666 27.5843 18.7232 28.8635 21.3006 27.4749C23.0623 26.5115 24.085 24.8631 24.9751 23.4283L24.9931 23.3994C25.053 23.3033 25.1124 23.2073 25.1716 23.1116C25.4743 22.6226 25.7724 22.1409 26.1101 21.6975C26.5289 21.1484 28.0837 19.4314 30.0931 20.6541C31.3743 21.4239 32.4516 22.4654 33.6045 23.5805Z"
                              fill="#9499AE"
                            />
                          </svg>
                          <p className="text-xs mt-2 text-color-ass-8">
                            Add Assets from
                          </p>
                          <p className="text-xs text-primary-color-1">
                            Computer
                          </p>
                        </>
                      )}
                    </div>

                    <input
                      disabled={isPreview}
                      key={index}
                      id={`dropzone-file${index}`}
                      type="file"
                      className="hidden"
                      accept="audio/*, image/*, video/*"
                      onChange={(e) => nftFileChangeHandler(e, index)}
                    />
                  </label>
                </div>
                {nft.assets.isFileError && (
                  <p className="validationTag">Please select a valid file.</p>
                )}
                {checkedValidation && !nft.assets.file && (
                  <p className="validationTag">Assets is required.</p>
                )}
                {nft.assets.limitExceeded && (
                  <p className="validationTag">
                    {`You can upload your assets up to 100 MB`}
                  </p>
                )}
              </div>
              {/* <div className="mb-6">
                    <div className="txtblack text-[14px]">Name</div>
                    <>
                      <DebounceInput
                        minLength={1}
                        debounceTimeout={0}
                        className={`debounceInput mt-1 ${
                          isPreview ? " !border-none bg-transparent" : ""
                        } `}
                        disabled={isPreview}
                        value={nft.nftName}
                        onChange={(e) =>
                          onTextfieldChange(index, "nftName", e.target.value)
                        }
                        placeholder="Name for the NFT"
                      />
                      {checkedValidation && nft.nftName === "" && (
                        <div className="validationTag">Name is required</div>
                      )}
                    </>
                  </div> */}
              <div className="mb-6">
                <p className="txtblack text-[14px]">External Links</p>
                <>
                  <DebounceInput
                    minLength={1}
                    debounceTimeout={0}
                    className={`debounceInput mt-1 ${isPreview ? " !border-none bg-transparent" : ""
                      } `}
                    disabled={isPreview}
                    value={nft.externalLink}
                    onChange={(e) =>
                      onTextfieldChange(index, "externalLink", e.target.value)
                    }
                    placeholder="https://"
                  />
                </>
              </div>
              <div className="mb-6">
                <p className="txtblack text-[14px]">Description</p>
                <textarea
                  value={nft.description}
                  onChange={(e) =>
                    onTextfieldChange(index, "description", e.target.value)
                  }
                  name="description"
                  id="description"
                  cols="30"
                  rows="6"
                  placeholder="Add brief description about this NFT"
                  className={`mt-1 ${isPreview ? " !border-none bg-transparent" : ""
                    } `}
                  disabled={isPreview}
                ></textarea>
              </div>
              <div className="mb-6">
                <p className="txtblack text-[14px]">Benefit</p>
                {nft.benefits.map((benefit, benefitIndex) => (
                  <div
                    className="md:mb-6 mb-3 flex items-center"
                    key={benefitIndex}
                  >
                    <DebounceInput
                      minLength={1}
                      debounceTimeout={0}
                      className={`debounceInput mt-1 ${isPreview ? " !border-none bg-transparent" : ""
                        } `}
                      disabled={isPreview}
                      value={benefit.title}
                      onChange={(e) =>
                        onBenefitChange(index, benefitIndex, e.target.value)
                      }
                      placeholder=""
                    />
                    {nft.benefits.length > 1 && !isPreview && (
                      <div className="ml-4">
                        <i
                          onClick={() => deleteBenefits(index, benefitIndex)}
                          className="cursor-pointer fa-solid fa-trash text-danger-1/[0.7]"
                        ></i>
                      </div>
                    )}
                  </div>
                ))}
                {!isPreview && (
                  <button
                    onClick={() => addMoreBenefits(index)}
                    className="h-[43px] mb-4 mr-4 px-4 py-2 text-[14px]  bg-primary-900/[.20] font-black  rounded text-primary-900   "
                  >
                    Add More Benefit
                  </button>
                )}
              </div>

              <div className="mb-6">
                <p className="text-txtblack font-bold ">Properties</p>
                <p className="text-textSubtle text-[14px] mb-[16px]">
                  Add the properties on your NFT.
                </p>
                <div className="flex py-3 border-b border-b-divider">
                  <i className="fa-regular fa-grip-lines"></i>
                  <div className="flex-1 px-3">
                    <p className="-mt-1">Properties</p>
                    <small className="text-textSubtle">
                      Add NFT properties
                    </small>
                  </div>
                  {!isPreview && (
                    <i
                      className="fa-regular fa-square-plus text-2xl text-primary-900 cursor-pointer"
                      onClick={() => openPropertyModal(index)}
                    ></i>
                  )}
                </div>
                <div className="flex py-3 border-b border-b-divider">
                  <p className="text-txtblack text-[18px] font-black">18+</p>
                  <div className="flex-1 px-3">
                    <p className="-mt-1">Sensitive Content</p>
                    <small className="text-textSubtle">
                      Defined properties on your NFT
                    </small>
                  </div>
                  {isPreview ? (
                    <p className="text-[14px] text-textSubtle">
                      {nft.sensitiveContent.toString().toLocaleUpperCase()}
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center">
                      <label
                        htmlFor={`checked-toggle-${index}`}
                        className="inline-flex relative items-center cursor-pointer ml-auto"
                      >
                        <input
                          type="checkbox"
                          value={nft.sensitiveContent}
                          id={`checked-toggle-${index}`}
                          checked={nft.sensitiveContent}
                          className="sr-only peer outline-none"
                          onChange={(e) =>
                            onSensitiveContentChange(
                              index,
                              nft.sensitiveContent
                            )
                          }
                        />
                        <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-900"></div>
                      </label>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 mt-2">
                  {isListUpdate && (
                    <div className="text-center mt-3">
                      <i className="fa-solid fa-loader fa-spin text-primary-900"></i>
                    </div>
                  )}
                  {!isListUpdate &&
                    nft.properties &&
                    nft.properties.map((property, i) => (
                      <div key={i}>
                        {property.key && property.value && (
                          <div key={i}>
                            <div className="flex items-center mt-3">
                              <input
                                name={`preview-type-${i}`}
                                type={"text"}
                                className="w-32 bg-gray-200 disabled:cursor-not-allowed"
                                defaultValue={property.key}
                                disabled={true}
                              />

                              <input
                                name={`preview-name-${i}`}
                                type={"text"}
                                className="ml-4 w-32 bg-gray-200 disabled:cursor-not-allowed"
                                defaultValue={property.value}
                                disabled={true}
                              />

                              {!isPreview && (
                                <i
                                  className="cursor-pointer fa-solid fa-trash text-danger-1/[0.7] ml-3"
                                  onClick={() => {
                                    removePropertyOfTier(nft, i);
                                  }}
                                ></i>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="mb-6 ">
                <div className="flex items-center mb-2">
                  <Tooltip></Tooltip>
                  <p className="txtblack text-[14px]">Supply</p>
                </div>
                <>
                  <DebounceInput
                    minLength={1}
                    debounceTimeout={0}
                    className={`debounceInput mt-1 ${isPreview ? " !border-none bg-transparent" : ""
                      } `}
                    disabled={isPreview}
                    value={nft.supply}
                    type="number"
                    onChange={(e) =>
                      onTextfieldChange(index, "supply", e.target.value)
                    }
                    placeholder="Supply for the NFT"
                  />
                  {checkedValidation && nft.supply === "" && (
                    <p className="validationTag">Supply is required</p>
                  )}
                </>
              </div>
              {/* <div className="mb-6">
                    <div className="flex flex-wrap items-center">
                      <Tooltip></Tooltip>
                      <div className="txtblack text-[14px] mb-[6px]">
                        Blockchain
                      </div>
                    </div>
                    <select
                      value={nft.blockchainCategory}
                      disabled
                      className={`h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3 ${
                        isPreview ? " !border-none bg-transparent" : ""
                      } `}
                    >
                      <option value={nft.blockchainCategory} defaultValue>
                        Polygon
                      </option>
                    </select>
                  </div> */}
            </div>
          ))}
        </div>
        <div className="py-6 flex justify-center">
          {isPreview ? (
            <>
              <button
                onClick={() => setIsPreview(false)}
                className="h-[43px] mb-4 mr-4 px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900   "
              >
                Back
              </button>
              <button
                onClick={nextHandle}
                className="w-[140px] !text-[16px] h-[44px] contained-button   md:ml-auto"
              >
                Submit
              </button>
            </>
          ) : (
            <>
              {!updateMode && (
                <button
                  onClick={addMoreTier}
                  className="h-[43px] mb-4 mr-4 px-3  md:px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900   "
                >
                  Add More Tier
                </button>
              )}
              <button
                onClick={nextHandle}
                className="w-[140px] !text-[16px] h-[44px] contained-button   md:ml-auto"
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
      <Modal
        show={showPropertyModal}
        handleClose={() => setShowPropertyModal(false)}
        height={"auto"}
        width={"564"}
      >
        <h1 className="font-black text-[24px] md:text-[42px] mb-4">
          Add your Properties
        </h1>
        <div className="md:w-10/12">
          <p className="mb-4 break-normal">
            Add the properties, with value , you can add more than 5 properties
          </p>
          <p className="text-color-ass-9 text-sm">Add Properties</p>
          {isListUpdate && (
            <div className="text-center mt-3">
              <i className="fa-solid fa-loader fa-spin text-primary-900"></i>
            </div>
          )}
          {!isListUpdate &&
            propertyList &&
            propertyList.map((property, index) => (
              <div key={index}>
                <div className="flex items-center mt-3">
                  <input
                    name={`type-${index}`}
                    type={"text"}
                    className="w-32"
                    defaultValue={property.key}
                    onChange={(e) => handleOnChangePropertyType(e, index)}
                  />

                  <input
                    name={`name-${index}`}
                    type={"text"}
                    className="ml-3 w-32"
                    defaultValue={property.value}
                    onChange={(e) => handleOnChangePropertyName(e, index)}
                  />

                  {propertyList.length > 1 && (
                    <i
                      className="cursor-pointer fa-solid fa-trash text-danger-1/[0.7] ml-3"
                      onClick={() => removeProperty(index)}
                    ></i>
                  )}
                </div>
              </div>
            ))}

          <div className="mt-5">
            <button
              type="button"
              className="h-[43px] mb-4 mr-4 px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900"
              onClick={() => addProperty()}
            >
              Add more +
            </button>
          </div>

          <div className="mt-5">
            <button
              type="button"
              className="w-[140px] !text-[16px] h-[44px] contained-button"
              onClick={onSavePropertiesChange}
            >
              SAVE
            </button>
          </div>
        </div>
      </Modal>
      {showSuccessModal && (
        <SuccessModal
          message={`You successfully ${updateMode ? "update" : "create"}
                    a Membership NFT!`}
          subMessage="Let's explore the NFT"
          buttonText="View NFT"
          redirection={`/collection-details/${collection_id}`}
          handleClose={() => setShowSuccessModal(false)}
          show={showSuccessModal}
        />
      )}
      {showDataUploadingModal && (
        <Modal
          width={800}
          show={showDataUploadingModal}
          showCloseIcon={false}
          handleClose={() => setShowDataUploadingModal(false)}
        >
          <div className="text-center md:my-6 md:mx-16">
            <h1>Do not close the Tab</h1>
            <h1>Your Assets is uploading</h1>
            <div className="overflow-hidden rounded-full h-4 w-full mt-4 md:mt-12 mb-8 relative animated fadeIn">
              <div className="animated-process-bar"></div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}