import { useEffect, useState } from "react";
import {
  getProjectDetailsById,
  projectLike,
} from "services/project/projectService";
import { ReactComponent as LikeIcon } from "assets/images/projectDetails/ico_like.svg";
import { ReactComponent as ViewIcon } from "assets/images/projectDetails/ico_view.svg";
import locationIcon from "assets/images/profile/locationIcon.svg";
import { useHistory } from "react-router-dom";

export default function ProjectDetails(props) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({});
  const projectId = props.match.params.id;
  const [selectedImages, setSelectedImages] = useState({});

  useEffect(() => {
    if (projectId && !isLoading) {
      projectDetails(projectId);
    }
  }, []);

  function projectDetails(pid) {
    setIsLoading(true);
    getProjectDetailsById({ id: pid })
      .then((res) => {
        if (res.code === 0) {
          setProject(res.project);
          if (res?.project?.assets[1]) {
            setSelectedImages(res.project.assets[1]);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function LikeProject() {
    setIsLoading(true);
    const request = new FormData();
    request.append("status", true);
    projectLike(projectId, request)
      .then((res) => {
        if (res.code === 0) {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function changeImagePreview(image) {
    setSelectedImages(image);
  }

  return (
    <div className={`my-4 ${isLoading ? "loading" : ""}`}>
      {!isLoading && project && !project.name && (
        <div className="text-center text-red-500">Project not Found</div>
      )}
      {!isLoading && project && project.name && (
        <div>
          <div className="ml-12 text-2xl font-bold">{project.name}</div>
          <div className="py-4">
            <img
              src={
                project?.assets[0]?.path
                  ? project.assets[0].path
                  : require(`assets/images/no-image-found.png`)
              }
              alt="cover"
              className="w-full h-96"
            />
          </div>
          <div className="float-right mr-10">
            <div
              className="relative bottom-10 left-1 rounded-full h-14 w-14 bg-[#B9CCD5] hover:bg-[#0AB4AF] grid grid-cols-1 content-center cursor-pointer"
              onClick={LikeProject}
            >
              <LikeIcon className="ml-1.5" />
            </div>
            <div className="relative bottom-10 left-0 text-sm">Appreciate</div>
          </div>
          <div className="h-4"></div>
          {/* <div className="flex flex-row mt-24 mx-8">
            <div className="w-2/4 border border-gray-300 float-right">
              <div class="grid grid-cols-4 divide-x divide-gray-300 text-gray-400">
                <div className="h-28 text-center">
                  <div className="m-4">
                    <p className="text-sm font-semibold">TOKEN SALE</p>
                    <p className="text-black font-semibold my-2">
                      {project.token_amount_total
                        ? project.token_amount_total
                        : 0}
                    </p>
                    <p className="text-xs">(0000MATIC)</p>
                  </div>
                </div>
                <div className="h-28 text-center">
                  <div className="m-4">
                    <p className="text-sm font-semibold">TOKEN PRICE</p>
                    <p className="text-black font-semibold my-2">0 MATIC</p>
                    <p className="text-xs">(0000MATIC)</p>
                  </div>
                </div>
                <div className="h-28 text-center">
                  <div className="m-4">
                    <p className="text-sm font-semibold">BALANCE</p>
                    <p className="text-black font-semibold my-2">0 MATIC</p>
                    <p className="text-xs">(0000MATIC)</p>
                  </div>
                </div>
                <div className="h-28 text-center">
                  <div className="m-4">
                    <p className="text-sm font-semibold">IN WALLET</p>
                    <p className="text-black font-semibold my-2">0 MATIC</p>
                    <p className="text-xs">(0000MATIC)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-2/4 ml-14">
              <div className="bg-gray-300 text-white text-center h-14 w-1/2 rounded p-4 mr-2">
                TOKEN NOT SALE
              </div>
              <div className="bg-gray-300 text-white text-center h-14 w-1/2 rounded p-4">
                FIXED MEMBER
              </div>
            </div>
          </div> */}
          {/* <div className="flex flex-row mt-8 mx-8">
            <div className="w-2/4">
              <div class="flex justify-center">
                {project.voting_power === "TknW8" && (
                  <img
                    src={require(`assets/images/projectDetails/badge/badge_vr_weighted.png`)}
                    alt="weighted"
                    className="h-40 w-40"
                  />
                )}
                {project.voting_power === "1VPM" && (
                  <img
                    src={require(`assets/images/projectDetails/badge/badge_vr_1vote.png`)}
                    alt="weighted"
                    className="h-40 w-40"
                  />
                )}
              </div>
            </div>
            <div className="w-2/4">
              <div class="flex ml-12">
                <div className="w-1/2">
                  <p>
                    <strong>INVESTER</strong> <span>0 people</span>
                  </p>
                  <div className="mt-12 border-2 rounded h-36 w-72"></div>
                </div>
                <div className="w-1/2">
                  <p>
                    <strong>MEMBERS</strong> <span>3 people</span>
                  </p>
                  <div>
                    <div className="flex flex-row">
                      <img
                        className="rounded border-8 border-gray-300 shadow-sm h-14 w-14 mr-2"
                        src={require(`assets/images/ico_profilephoto@2x.png`)}
                        alt="user icon"
                      />
                      <img
                        className="rounded border-8 border-gray-300 shadow-sm h-14 w-14 mr-2"
                        src={require(`assets/images/ico_profilephoto@2x.png`)}
                        alt="user icon"
                      />
                      <img
                        className="rounded border-8 border-gray-300 shadow-sm h-14 w-14"
                        src={require(`assets/images/ico_profilephoto@2x.png`)}
                        alt="user icon"
                      />
                    </div>
                  </div>
                  <div className="border-2 rounded h-36 w-72 p-2">
                    <div className="flex">
                      <p className="text-sm font-semibold">NAME </p>
                      <img className="h-5 w-5" src={locationIcon} alt="" />
                      <p className="text-sm">Tokyo, Japan</p>
                    </div>
                    <div className="text-xs">
                      Designer, Web Analytics Consultant
                    </div>
                    <div className="text-sm mt-2">
                      Profile text Profile text Profile text Profile text
                      Profile text Profile text Profile text Profile text
                      Profile text Profile text Profile text Profile text
                      Profile text …
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="text-center w-full my-8 border-t">
            <div className="text-2xl font-semibold my-8">About Project</div>
          </div>
          <div className="flex flex-row mt-8 mx-8">
            <div className="w-2/4 pr-8">
              {!!project?.assets[1] && (
                <img
                  className="rounded-lg shadow-sm h-96 w-full"
                  src={
                    selectedImages?.path
                      ? selectedImages.path
                      : require(`assets/images/no-image-found-square.png`)
                  }
                  alt="user icon"
                />
              )}
              <div className="flex flex-row mt-2">
                {project &&
                  project.assets &&
                  project.assets.length > 0 &&
                  project.assets.map((image, index) => (
                    <>
                      {index > 0 && (
                        <img
                          key={`project-image-${index}`}
                          className={`rounded-lg shadow-sm h-24 w-30 mr-2 ${
                            image.path === selectedImages?.path
                              ? "border-4 border-[#0AB4AF]"
                              : ""
                          }`}
                          src={
                            image.path
                              ? image.path
                              : require(`assets/images/no-image-found-square.png`)
                          }
                          alt={`project pic-${index}`}
                          onClick={() => changeImagePreview(image)}
                        />
                      )}
                    </>
                  ))}
              </div>
            </div>
            <div className="w-2/4">
              <p>{project.overview}</p>
            </div>
          </div>
          <div className="flex justify-center my-8 border-t">
            <div className="bg-gray-200 text-center text-white h-14 w-1/4 rounded p-4 mr-2 mt-8">
              TOKEN NOT SALE
            </div>
          </div>
          <div className="flex justify-center">
            <div className="mt-4 justify-center text-center">
              <div className="rounded-full h-14 w-14 bg-[#B9CCD5] hover:bg-[#0AB4AF] grid grid-cols-1 content-center cursor-pointer m-4">
                <LikeIcon className="ml-1.5" />
              </div>
              <div className="text-sm mt-1">Appreciate</div>
            </div>
            <div className="mt-4 justify-center text-center">
              <div className="rounded-full h-14 w-14 bg-[#B9CCD5] hover:bg-[#0AB4AF] grid grid-cols-1 content-center cursor-pointer m-4">
                <ViewIcon className="ml-1.5" />
              </div>
              <div className="text-sm mt-1">
                {project?.project_view_count ? project.project_view_count : 0}
              </div>
            </div>
          </div>
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => history.push("/all-project")}
          >
            <div className="border rounded-full text-center text-black h-14 w-1/4 rounded p-4 mr-2 mt-8 hover:border-[#0AB4AF] hover:text-[#0AB4AF]">
              Back to project list
            </div>
          </div>
        </div>
      )}
    </div>
  );
}