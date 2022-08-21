import { useDetectClickOutside } from "react-detect-click-outside";
import { useHistory } from "react-router-dom";

const SearchBarResult = ({ isLoading, projectList, handleSearchClose }) => {
  const history = useHistory();
  const ref = useDetectClickOutside({ onTriggered: handleSearchClose });

  return (
    <div
      className="bg-light border border-slate-300 rounded-xl absolute w-full  max-w-[556px] z-20 mt-1"
      ref={ref}
    >
      <div className="mx-8 my-4 txtblack ">
        {projectList &&
          projectList.map((project, index) => (
            <div
              key={`search-project-${index}`}
              className="cursor-pointer"
              onClick={() => {
                history.push(`/project-details/${project.id}`);
                handleSearchClose();
              }}
              onTouchStart={() => {
                history.push(`/project-details/${project.id}`);
                handleSearchClose();
              }}
            >
              <div className="label">{project.name}</div>
              <div className="label-grey txtblack">
                {project.overview && project.overview.length > 77
                  ? project.overview.substring(0, 80) + "..."
                  : project.overview}
              </div>
            </div>
          ))}
      </div>
      <div className="my-2 text-center">
        {isLoading && (
          <i
            className="fa fa-spinner fa-spin text-primary-900"
            aria-hidden="true"
          ></i>
        )}
      </div>
    </div>
  );
};
export default SearchBarResult;
