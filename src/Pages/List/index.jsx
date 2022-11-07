/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  getUserProjectListById,
  getProjectCategory,
} from "services/project/projectService";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore, { Autoplay } from "swiper";
import DAOCard from "components/Cards/DAOCard";
import CollectionCard from "components/Cards/CollectionCard";
import NFTListCard from "components/Cards/NFTListCard";
import Sort from "assets/images/icons/sort.svg";
import { useLocation } from "react-router-dom";
import { getCollections } from "services/collection/collectionService";
import ReactPaginate from "react-paginate";
import { getMintedNftListByUserId, refreshNFT } from "services/nft/nftService";
import { updateMetadata } from "Pages/User/Profile/update-metadata";
import { createProvider } from "util/smartcontract/provider";
import { createMintInstance } from "config/ABI/mint-nft";
import { toast } from "react-toastify";
import emptyStateCommon from "assets/images/profile/emptyStateCommon.svg";
function List() {
  const provider = createProvider();
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  SwiperCore.use([Autoplay]);
  // const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  // const [popularProjectList, setPopularProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortType, setSortType] = useState("newer");
  const [pagination, SetPagination] = useState([1, 2]);
  const [isActive, setIsactive] = useState(1);

  const payload = {
    order_by: "newer",
    page: 1,
    limit: 10,
    keyword: "",
  };
  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  async function getProjectList(payload, orderBy, isSearch = false) {
    payload.order_by = orderBy;

    const categoriesRes = await getProjectCategory();
    let projectResponse = [];
    if (query.get("type") === "collection") {
      let listType = "";
      if (query.get("user") === "true") {
        listType = "user";
      }
      projectResponse = await getCollections(
        listType,
        "",
        payload.page,
        10,
        payload.keyword,
        payload.order_by
      );
    } else if (query.get("type") === "dao") {
      let payloadData = {
        id: query.get("user"),
        page: payload.page,
        perPage: 10,
        keyword: payload.keyword,
        order_by: payload.order_by,
      };
      projectResponse = await getUserProjectListById(payloadData);
    } else if (query.get("type") === "nft") {
      let payloadData = {
        userId: query.get("user"),
        page: payload.page,
        limit: 10,
        keyword: payload.keyword,
        order_by: payload.order_by,
      };
      projectResponse = await getMintedNftListByUserId(payloadData);
    }

    if (categoriesRes?.categories && projectResponse?.data) {
      let projects = [];

      if (query.get("type") !== "nft") {
        projects = projectResponse.data.map((project) => {
          project.category_name = categoriesRes.categories.find(
            (category) => category.id === project.category_id
          )?.name;
          return project;
        });
      } else {
        projects = projectResponse.data;
      }

      // types

      if (isSearch) {
        setSearchList(projects);
      } else {
        setProjectList(projects);
      }
      if (projectResponse.total && projectResponse.total > 0) {
        const page = calculatePageCount(10, projectResponse.total);
        const pageList = [];
        for (let index = 1; index <= page; index++) {
          pageList.push(index);
        }
        SetPagination(pageList);
      }
    } else {
      SetPagination([]);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      payload.page = isActive;
      if (searchKeyword.length > 0) {
        payload.keyword = searchKeyword;
      }
      await getProjectList(
        payload,
        sortType,
        searchKeyword.length > 0 ? true : false
      );
      // await getCollectionList();
    })();
  }, [sortType]);

  function handleSortType(type) {
    setSortType(type);
  }

  function searchProject(event) {
    event.stopPropagation();
    event.preventDefault();
    const text = event.currentTarget.value;
    setSearchKeyword(text);
    if (text && text.length > 2) {
      // todo: use debounce
      payload.keyword = text;
      setIsactive(1);
      getProjectList(payload, sortType, true);
    }
  }
  async function clearSearch() {
    setSearchKeyword("");
    payload.page = 1;
    setIsactive(1);
    await getProjectList(payload, "newer");
  }

  // async function getCollectionList() {
  //   setIsLoading(true);
  //   await getCollections("", "", 1, 10)
  //     .then((e) => {
  //       if (e.code === 0 && e.data !== null) {
  //         setCollectionList(e.data);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch(() => {
  //       setIsLoading(false);
  //     });
  // }

  useEffect(() => {
    const navItem = document.getElementById("nav-home");
    if (navItem) navItem.classList.add("active-menu");
  }, []);
  useEffect(
    () => () => {
      const navItem = document.getElementById("nav-home");
      if (navItem) navItem.classList.remove("active-menu");
    },
    []
  );
  const isSearching = searchKeyword.length > 2;

  const handlePageClick = (event) => {
    setIsactive(event.selected + 1);
  };
  function setNftData(nft, type) {
    let nftList = [...projectList];
    const nftIndex = nftList.findIndex(
      (item) => item.id === nft.id && item.token_id === nft.token_id
    );
    const nftLocal = { ...nft };
    if (type === "loadingTrue") {
      nftLocal.loading = true;
    } else if (type === "loadingFalse") {
      nftLocal.loading = false;
    } else if (type === "hideRefreshButton") {
      nftLocal.refresh_status = "notRequired";
    } else if (type === "showRefreshButton") {
      nftLocal.refresh_status = "failed";
    }
    nftList[nftIndex] = nftLocal;
    setProjectList(nftList);
  }
  async function refreshNFTWithtnx(payload) {
    return await refreshNFT(payload);
  }

  async function onRefreshNft(nft) {
    // hide the refresh button start
    setNftData(nft, "hideRefreshButton");
    // hide the refresh end

    // 1. set Loading true start
    setNftData(nft, "loadingTrue");
    // 1. set loading true end

    // 2. call refresh api for getting config object
    const payload = {
      id: nft.id,
      tokenId: nft.token_id,
    };
    let config = {};
    let hasConfigForNft = false;

    await refreshNFT(payload)
      .then((res) => {
        if (res.code === 0) {
          if (res.config.collection_contract_address !== "") {
            config = res.config;
            hasConfigForNft = true;
          }
        } else {
          setNftData(nft, "loadingFalse");
          setNftData(nft, "sowRefreshButton");
        }
      })
      .catch((error) => {
        setNftData(nft, "loadingFalse");
        setNftData(nft, "sowRefreshButton");
      });
    if (hasConfigForNft) {
      try {
        const erc721CollectionContract = createMintInstance(
          config.collection_contract_address,
          provider
        );
        const result = await updateMetadata(
          erc721CollectionContract,
          provider,
          config
        );
        if (result) {
          console.log(result);
          const data = {
            id: nft.id,
            tokenId: nft.token_id,
            tnxHash: result,
          };
          await refreshNFTWithtnx(data)
            .then((res) => {
              if (res.code === 0) {
                if (res.function.status === "success") {
                  setNftData(nft, "loadingFalse");
                  setNftData(nft, "hideRefreshButton");
                  toast.success(`Successfully refreshed ${nft.name} NFT`);
                }
                if (res.function.status === "failed") {
                  setNftData(nft, "loadingFalse");
                  setNftData(nft, "sowRefreshButton");
                  toast.error(`Unexpected error, Please try again`);
                }
              }
            })
            .catch((err) => {
              setNftData(nft, "loadingFalse");
            });
        } else {
          setNftData(nft, "loadingFalse");
        }
      } catch (error) {
        setNftData(nft, "loadingFalse");
        setNftData(nft, "sowRefreshButton");
        toast.error(`Unexpected error or cancelled, please try again`);
      }
    } else {
      setNftData(nft, "loadingFalse");
    }
  }

  useEffect(() => {
    payload.page = isActive;
    if (searchKeyword.length > 0) {
      payload.keyword = searchKeyword;
    }
    setIsLoading(true);
    getProjectList(payload, sortType, searchKeyword.length > 0 ? true : false);
  }, [isActive]);

  return (
    <>
      {isLoading && <div className="loading"></div>}
      <div className="text-txtblack mx-4 md:mx-0">
        <h1 className="my-6">
          {query.get("type") === "collection"
            ? "Collection List"
            : query.get("type") === "dao"
            ? "DAO List"
            : "Minted NFT"}
        </h1>
        <section className="flex mb-6">
          <div className="mr-4 flex-1">
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
                <i className="fa-regular fa-magnifying-glass text-primary-900 text-lg"></i>
              </div>
              <input
                type="text"
                id="default-search"
                style={{
                  paddingLeft: 40, // todo: use tailwind
                  border: "none",
                }}
                className="text-lg shadow-main w-full rounded-lg placeholder-color-ass-4 h-[72px] text-[#000] pl-[40px]"
                placeholder="Search by name or title..."
                onChange={searchProject}
                value={searchKeyword}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    searchProject(event);
                  }
                }}
              />
            </div>
          </div>

          <div className="dropdown relative">
            <button
              className="bg-white dropdown-toggle p-4 text-textSubtle font-black font-satoshi-bold rounded-lg shadow-main flex items-center justify-between w-15 md:w-44 h-[72px]"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="hidden md:block"> Sort Of</span>
              <i className="fa-solid fa-angle-down hidden md:block"></i>
              <img src={Sort} alt="sort" className="block md:hidden" />
            </button>

            <ul
              className="dropdown-menu w-[150px] md:w-full absolute hidden bg-white text-base z-50 py-2 list-none rounded-lg shadow-main  mt-1 "
              aria-labelledby="dropdownMenuButton1"
            >
              <li onClick={() => handleSortType("newer")}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === "newer" ? "text-primary-900" : "text-txtblack"
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  Newer
                </div>
              </li>
              <li onClick={() => handleSortType("older")}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === "older" ? "text-primary-900" : "text-txtblack"
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  older
                </div>
              </li>
              <li onClick={() => handleSortType("view")}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === "view" ? "text-primary-900" : "text-txtblack"
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  view
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section>
          {isSearching ? (
            <h4>
              {`Showing result for "${searchKeyword}"`}{" "}
              <p
                className="text-primary-900 font-light cursor-pointer"
                onClick={clearSearch}
              >
                clear
              </p>
            </h4>
          ) : null}
          {isSearching && searchList.length === 0 ? (
            <div className="p-5 text-center min-h-[100px] text-primary-700">
              <div className="text-center mt-6 text-textSubtle">
                <img
                  src={emptyStateCommon}
                  className="h-[210px] w-[315px] m-auto"
                  alt=""
                />
                <p className="text-subtitle font-bold">Nothing Found</p>
              </div>
            </div>
          ) : null}
          {!isLoading && (
            <>
              {projectList.length > 0 ? (
                <>
                  {query.get("type") === "collection" && (
                    <section className="flex flex-wrap items-start  space-x-4 justify-center md:justify-start">
                      {isSearching
                        ? searchList.map((item, index) => (
                            <div key={item.id}>
                              <CollectionCard key={index} collection={item} />
                            </div>
                          ))
                        : projectList.map((item, index) => (
                            <div key={item.id}>
                              <CollectionCard key={item.id} collection={item} />
                            </div>
                          ))}
                    </section>
                  )}

                  {query.get("type") === "dao" && (
                    <section className="flex flex-wrap items-center  justify-center md:justify-start">
                      {isSearching
                        ? searchList.map((item, index) => (
                            <div key={item.id}>
                              <DAOCard item={item} key={item.id} />
                            </div>
                          ))
                        : projectList.map((item, index) => (
                            <div key={item.id}>
                              <DAOCard item={item} key={item.id} />
                            </div>
                          ))}
                    </section>
                  )}

                  {query.get("type") === "nft" && (
                    <section className="flex flex-wrap items-center space-x-4 justify-center md:justify-start">
                      {isSearching
                        ? searchList.map((nft, index) => (
                            <div key={`${nft.id}-${nft.token_id}`}>
                              <NFTListCard
                                nft={nft}
                                projectWork="ethereum"
                                refresh={onRefreshNft}
                                loading={nft.loading}
                              />
                            </div>
                          ))
                        : projectList.map((nft, index) => (
                            <div key={`${nft.id}-${nft.token_id}`}>
                              <NFTListCard
                                nft={nft}
                                projectWork="ethereum"
                                refresh={onRefreshNft}
                                loading={nft.loading}
                              />
                            </div>
                          ))}
                    </section>
                  )}
                </>
              ) : (
                <>
                  <div className="p-5 text-center min-h-[100px] text-primary-700">
                    <div className="text-center mt-6 text-textSubtle">
                      <img
                        src={emptyStateCommon}
                        className="h-[210px] w-[315px] m-auto"
                        alt=""
                      />
                      <p className="text-subtitle font-bold">
                        You don`t have any {query.get("type")} yet
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </section>

        {/* ----- End Card Section ---- */}

        {pagination.length > 0 && (
          <ReactPaginate
            className="flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6"
            pageClassName="px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack "
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pagination.length}
            previousLabel="<"
            renderOnZeroPageCount={null}
            activeClassName="text-primary-900 bg-primary-900 !no-underline"
            activeLinkClassName="!text-txtblack !no-underline"
          />
        )}
        {/* End pagination */}
      </div>
    </>
  );
}

export default List;
