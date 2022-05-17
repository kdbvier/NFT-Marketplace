import likeIcon from "assets/images/profile/ico_like.svg";
import viewIcon from "assets/images/profile/ico_view.svg";
import { useHistory } from "react-router-dom";
const ProjectListCard = ({ project }) => {
  const history = useHistory();

  function projectDetails(projectId) {
    history.push(`/project-details/${projectId}`);
  }

  return (
    <div
      className={`roboto mx-auto md:mx-[0px] w-[166px] md:max-w-[280px] md:w-full`}
      style={{ boxShadow: " 0px 0px 4px #00000024" }}
      onClick={() => projectDetails(project.id)}
    >
      <img
        style={{ borderRadius: "8px 8px 0px 0px" }}
        src={
          project.assets.length > 0
            ? project.assets.find((x) => x.asset_purpose === "cover").path
            : ""
        }
        alt="Project Cover"
        className={` h-[166px] md:h-[280px] w-[166px] md:w-[280px] object-cover cursor-pointer`}
      />
      <div
        style={{ borderRadius: "0px 0px 8px 8px" }}
        className="bg-[#FFFFFF] pl-4 pr-4 "
      >
        <div className="flex mt-[-16px] ">
          {project.status === "draft" && (
            <div
              style={{ borderRadius: " 4px 4px 0px 0px" }}
              className="bg-[#FFFFFF] px-4 py-1 text-[10px] roboto font-bold text-[#0AB4AF]"
            >
              COMMING SOON
            </div>
          )}

          {project.status === "published" && (
            <div>
              {project.member_needed ? (
                <div
                  style={{ borderRadius: " 4px 4px 0px 0px" }}
                  className="bg-[#FFFFFF] px-4 py-1 text-[10px] roboto font-bold text-[#0AB4AF]"
                >
                  JOIN TEAM
                </div>
              ) : (
                <div
                  style={{ borderRadius: " 4px 4px 0px 0px" }}
                  className="bg-[#FFFFFF] px-4 py-1 text-[10px] roboto font-bold text-[#8B9199]"
                >
                  FIXED MEMBERS
                </div>
              )}
            </div>
          )}
          {project.status === "published" && (
            <div>
              {project.project_fundraising !== null && (
                <div
                  style={{ borderRadius: " 4px 4px 0px 0px" }}
                  className="bg-[#FFFFFF] px-4 py-1 text-[10px] ml-5 roboto font-bold text-[#D31B0C]"
                >
                  TOKEN SALE
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-[14px] mb-[28px] text-[#192434] roboto font-bold">
          {project.name}
        </div>
        {project.project_fundraising === null && (
          <div className="test-[12px] text-[#192434] mt-[28px] mb-[11px] min-h-[48px]">
            {project.overview.substring(0, 70) + " ..."}
          </div>
        )}
        {project.status === "published" && (
          <div>
            {project.project_fundraising !== null && (
              <div className="min-h-[57px]">
                <div className="flex mt-[11px] justify-between text-[#192434] text-[10px]">
                  <div>0</div>
                  <div>
                    <span>{project.project_fundraising.total_allocation}</span>
                    {project.token_name}
                  </div>
                </div>
                <div className="w-full rounded-lg  bg-gray-200 mb-[9px] h-[8px]">
                  <div
                    className="bg-[#0AB4AF] rounded-lg h-[8px]"
                    style={{
                      width: `${project.project_fundraising.user_allocated_percent}px`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between pb-[16px]">
          <div className="w-[100px] pt-[2px] h-[20px] text-center rounded-[12px] border-[1px] text-[10px] border-[#B9CCD5] text-[#192434]">
            {project.category_name}
          </div>
          <div className="flex">
            <div className="flex items-center">
              <img height={"24px"} width="24px" src={likeIcon} alt="" />{" "}
              <span className="text-[#192434] text-[14px] ">
                {project.project_like_count}
              </span>
            </div>
            <div className="flex items-center">
              <img height={"24px"} width="24px" src={viewIcon} alt="" />
              <span className="text-[#192434] text-[14px] ">
                {project.project_view_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectListCard;