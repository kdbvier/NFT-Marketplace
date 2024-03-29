import React, { useState, useCallback, useEffect } from 'react';
import styles from './index.module.css';
import { checkUniqueProjectName } from 'services/project/projectService';
import Outline from 'components/FormUtility/Outline';
import Confirmation from 'components/FormUtility/Confirmation';
import {
  createProject,
  updateProject,
  getProjectDetailsById,
  deleteAssetsOfProject,
  deleteDraftDao,
} from 'services/project/projectService';
import ErrorModal from 'components/Modals/ErrorModal';
import SuccessModal from 'components/Modals/SuccessModal';
import { getProjectCategory } from 'services/project/projectService';
import { ls_GetChainID } from 'util/ApplicationStorage';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import { event } from 'nextjs-google-analytics';
import TagManager from 'react-gtm-module';
import { useSelector } from 'react-redux';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { imageCompress } from 'util/ImageCompress';

function ProjectCreateContent({ search }) {
  // Logo start
  // logo is the cover photo
  const userInfo = useSelector((state) => state.user.userinfo);
  const [logoPhoto, setLogoPhoto] = useState([]);
  const [logoPhotoUrl, setLogoPhotoUrl] = useState('');
  const [toCreateDAO, setToCreateDAO] = useState(false);
  const onLogoPhotoSelect = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      let compressedImage = await imageCompress(acceptedFiles[0]);
      if (compressedImage) {
        setLogoPhoto([compressedImage]);
        let objectUrl = URL.createObjectURL(acceptedFiles[0]);
        let logoPhotoInfo = {
          path: objectUrl,
        };
        setLogoPhotoUrl(logoPhotoInfo);
        setoutlineKey((pre) => pre + 1);
      }
    }
  }, []);
  async function onLogoPhotoRemove() {
    if (logoPhotoUrl.id) {
      let payload = {
        projectId: projectId,
        assetsId: logoPhotoUrl.id,
      };
      setDataIsLoading(true);
      await deleteAssetsOfProject(payload).then((e) => {
        setLogoPhoto([]);
        setLogoPhotoUrl('');
        setDataIsLoading(false);
      });
    } else {
      setLogoPhoto([]);
      setLogoPhotoUrl('');
    }
  }
  // Logo End
  let chainId = ls_GetChainID();
  // Project Name start
  const [projectName, setProjectName] = useState('');
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  const [projectNameDisabled, setProjectNameDisabled] = useState(false);
  async function onProjectNameChange(e) {
    let payload = {
      projectName: e,
      project_uuid: projectId,
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

  // Dao symbol start
  const [daoSymbol, setDaoSymbol] = useState('');
  const [emptyDaoSymbol, setEmptyDaoSymbol] = useState(false);
  const [daoSymbolDisable, setDaoSymbolDisable] = useState(false);
  async function onDaoSymbolChange(e) {
    setDaoSymbol(e);
    setEmptyDaoSymbol(false);
  }
  // Dao symbol End

  // Dao wallet start
  const [daoWallet, setDaoWallet] = useState('');
  const [emptyDaoWallet, setEmptyDaoWallet] = useState(false);
  const [daoWalletDisable, setDaoWalletDisable] = useState(false);
  async function onDaoWalletChange(e) {
    setDaoWallet(e);
    setEmptyDaoWallet(false);
  }
  // Dao wallet End

  // overview start
  const [overview, setOverview] = useState('');
  function onOverviewChange(e) {
    setOverview(e.target.value);
  }
  // overview End

  // photos start
  const [photosLengthFromResponse, setPhotosLengthFromResponse] = useState(0);
  const [remainingPhotosName, setRemainingPhotosName] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [photosUrl, setPhotosUrl] = useState([]);
  const onPhotosSelect = useCallback((params, photos) => {
    if (photosLengthFromResponse + params.length > 7) {
      setShowErrorModal(true);
      setErrorMessage('Maximum 7 picture can be upload');
    } else {
      let totalSize = 0;
      params.forEach((element) => {
        totalSize = totalSize + element.size;
      });

      if (totalSize > 29360128) {
        setShowErrorModal(true);
        setErrorMessage('Maximum 28 MB can be upload');
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
        projectId: projectId,
        assetsId: i.id,
      };
      setDataIsLoading(true);
      await deleteAssetsOfProject(payload)
        .then((e) => {
          setUpPhotos();
        })
        .catch(() => {
          setDataIsLoading(false);
        });
    } else {
      setPhotosUrl(photosUrl.filter((x) => x.name !== i.name));
      setPhotos(photos.filter((x) => x.name !== i.name));
    }
  }
  async function setUpPhotos() {
    let payload = {
      id: projectId,
    };
    await getProjectDetailsById(payload)
      .then((e) => {
        let response = e.project;
        let photosInfoData = response?.assets?.filter(
          (x) => x.asset_purpose === 'subphoto'
        );
        setPhotosLengthFromResponse(photosInfoData.length);
        setPhotosUrl(photosInfoData);
        let constPhotosName = [
          'img1',
          'img2',
          'img3',
          'img4',
          'img5',
          'img6',
          'img7',
        ];
        let photosname = [];
        photosname = photosInfoData.map((e) => {
          return e.name;
        });
        let remainingPhotosName = constPhotosName.filter(function (v) {
          return !photosname.includes(v);
        });
        setRemainingPhotosName(remainingPhotosName);
        setDataIsLoading(false);
      })
      .catch(() => {
        setDataIsLoading(false);
      });
  }
  // Photos End

  // webLinks start
  const links = [
    { title: 'linkInsta', icon: 'instagram', value: '' },
    { title: 'linkGithub', icon: 'github', value: '' },
    { title: 'linkTwitter', icon: 'twitter', value: '' },
    { title: 'linkFacebook', icon: 'facebook', value: '' },
    { title: 'customLinks1', icon: 'link', value: '' },
  ];
  const [webLinks, setWebLinks] = useState(links);
  function onSocialLinkChange(url, index) {
    let oldLinks = [...webLinks];
    oldLinks[index].value = url;
    setWebLinks(oldLinks);
  }
  function addMoreSocialLink() {
    let oldLinks = [...webLinks];
    oldLinks.push({
      title: `customLinks${webLinks?.length + 1}`,
      icon: 'link',
      value: '',
    });
    setWebLinks(oldLinks);
  }
  function deleteSocialLinks(index) {
    let oldLinks = [...webLinks];
    oldLinks?.splice(index, 1);
    setWebLinks(oldLinks);
  }
  // webLinks end

  // category start
  const [projectCategory, setProjectCategory] = useState('');
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  const [emptyBlockchainCategory, setEmptyBlockchainCategory] = useState(false);
  const [projectCategoryName, setProjectCategoryName] = useState('');
  function onProjectCategoryChange(event) {
    setProjectCategory(event.target.value);
    setEmptyProjectCategory(false);
    const categoryName = projectCategoryList.find(
      (x) => x.id === parseInt(event.target.value)
    );

    setProjectCategoryName(categoryName ? categoryName.name : '');
  }
  // category end

  // Blockchain start
  const [blockchainCategory, setBlockchaainCategory] = useState(
    chainId?.toString()
  );
  // Blockchain end
  let query = useQuery();
  const [outlineKey, setoutlineKey] = useState(0);
  const [currentStep, setcurrentStep] = useState([1]);
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [isDataLoading, setDataIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  const [notOwner, setNotOwner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectPublished, setProjectPublished] = useState(false);
  const [daoDeleted, setDaoDeleted] = useState(false);

  useEffect(() => {
    if (toCreateDAO) {
      saveDraft();
    }

    return () => {
      setToCreateDAO(false);
    };
  }, [userInfo?.id]);

  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }

  async function createBlock(id) {
    try {
      setDataIsLoading(true);
      id = await createNewProject();
      await updateExistingProject(id);
      // await projectDetails(id);
      setDataIsLoading(false);
      setShowSuccessModal(true);
      setProjectId(id);
      setShowErrorModal(false);
    } catch (err) {
      setDataIsLoading(false);
      setShowErrorModal(true);
    }
  }

  async function updateBlock(id) {
    try {
      setDataIsLoading(true);
      await updateExistingProject(id);
      // await projectDetails(id);
      setDataIsLoading(false);
      setShowSuccessModal(true);
      setProjectId(id);
      setShowErrorModal(false);
    } catch (err) {
      setDataIsLoading(false);
      setShowErrorModal(true);
    }
  }

  async function saveDraft() {
    if (userInfo?.id) {
      // outline
      if (currentStep.length === 2) {
        setToCreateDAO(false);
        if (
          projectName !== '' &&
          // daoSymbol !== "" &&
          projectCategory !== '' &&
          alreadyTakenProjectName === false
        ) {
          let id = '';
          if (!projectCreated) {
            await createBlock(id);
          } else if (projectCreated && projectId !== '') {
            await updateBlock(projectId);
          }
        }
      }
    } else {
      setShowConnectModal(true);
      setToCreateDAO(true);
    }
  }

  async function createNewProject() {
    event('create_dao', { category: 'dao', label: 'name', value: projectName });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'dao',
        label: 'name',
        value: projectName,
        pageTitle: 'create_dao',
      },
    });
    let createPayload = {
      name: projectName,
      category_id: projectCategory,
      blockchain: blockchainCategory,
    };

    let projectId = '';
    await createProject(createPayload)
      .then((res) => {
        if (res.code === 4003) {
          setAlreadyTakenProjectName(true);
          setcurrentStep([1]);
          typeof window !== 'undefined' && window.scrollTo(0, 0);
        } else if (res.code === 0) {
          projectId = res.project.id;
          setProjectCreated(true);
          setProjectId(projectId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return projectId;
  }
  async function updateExistingProject(id) {
    event('update_dao', { category: 'dao', label: 'name', value: projectName });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'dao',
        label: 'name',
        value: projectName,
        pageTitle: 'update_dao',
      },
    });
    try {
      let updatePayload = {
        logo: logoPhoto.length > 0 ? logoPhoto[0] : null,
        name: projectName,
        daoSymbol: daoSymbol,
        daoWallet: daoWallet,
        overview: overview,
        photos: photos.length > 0 ? photos : null,
        photosLengthFromResponse: photosLengthFromResponse,
        remainingPhotosName: remainingPhotosName,
        webLinks: JSON.stringify(webLinks),
        category_id: projectCategory,
        blockchainCategory: blockchainCategory,
        id: id,
      };

      // console.log(updatePayload);
      await updateProject(updatePayload);
    } catch (err) {}
  }
  async function projectDetails(id) {
    setDataIsLoading(true);
    let payload = {
      id: id ? id : projectId,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      if (e.code === 4040 && !response) {
        setDataIsLoading(false);
        setShowErrorModal(true);
        setErrorMessage(e.message);
      } else {
        // console.log(response);

        setBlockchaainCategory(response?.blockchain?.toString());
        setProjectCategory(response?.category_id);
        setProjectName(response?.name);
        setDaoWallet(response?.treasury_wallet);
        setProjectCreated(true);
        setProjectId(id);
        setOverview(response?.overview);
        try {
          setWebLinks(JSON.parse(response?.urls));
        } catch (error) {
          console.log(error);
        }
        const logo = response?.assets?.find((x) => x.asset_purpose === 'cover');
        setLogoPhotoUrl(logo ? logo : '');
        let photosInfoData = response?.assets?.filter(
          (x) => x.asset_purpose === 'subphoto'
        );
        setPhotosLengthFromResponse(photosInfoData.length);
        setPhotosUrl(photosInfoData);
        let constPhotosName = [
          'img1',
          'img2',
          'img3',
          'img4',
          'img5',
          'img6',
          'img7',
        ];
        let photosname = [];
        photosname = photosInfoData.map((e) => {
          return e.name;
        });
        let remainingPhotosName = constPhotosName.filter(function (v) {
          return !photosname.includes(v);
        });
        setRemainingPhotosName(remainingPhotosName);
        if (response?.project_status === 'published') {
          setProjectNameDisabled(true);
          setDaoWalletDisable(true);
          setProjectPublished(true);
        }
        if (!response?.is_owner) {
          setNotOwner(true);
        }
        setDataIsLoading(false);
      }
    });
  }

  function handelClickNext() {
    // outline
    if (currentStep.length === 1) {
      if (projectName === '') {
        setemptyProjectName(true);
        typeof window !== 'undefined' &&
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // if (daoSymbol === "") {
      //   setEmptyDaoSymbol(true);
      //   window.scrollTo({ top: 0, behavior: "smooth" });
      // }

      if (projectCategory === '') {
        setEmptyProjectCategory(true);
      }
      if (blockchainCategory === '0') {
        setEmptyBlockchainCategory(true);
      }
      if (photos.length + photosLengthFromResponse > 7) {
        setShowErrorModal(true);
        setErrorMessage('Maximum 7 picture can be upload');
      } else if (
        projectName !== '' &&
        // daoSymbol !== "" &&
        projectCategory !== '' &&
        blockchainCategory !== '0' &&
        alreadyTakenProjectName === false
      ) {
        const payload = {
          cover: logoPhoto.length > 0 ? logoPhoto[0] : null,
          name: projectName,
          // daoSymbol: daoSymbol,
          daoWallet: daoWallet,
          overview: overview,
          photos: photos.length > 0 ? photos : null,
          photosLengthFromResponse: photosLengthFromResponse,
          remainingPhotosName: remainingPhotosName,
          webLinks: JSON.stringify(webLinks),
          category_id: projectCategory,
          blockchainCategory: blockchainCategory,
          // tags: tagList.toString(),
          // roles: roleList.toString(),

          // token_name: tokenName,
          // token_symbol: tokenSymbol,
          // token_amount_total: numberOfTokens,
        };
        // console.log(payload);
        const categoryName = projectCategoryList.find(
          (x) => x.id === parseInt(projectCategory)
        );
        setProjectCategoryName(categoryName ? categoryName.name : '');
        setcurrentStep([1, 2]);
      }
    }
  }
  function useQuery() {
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  async function deleteDao() {
    event('delete_dao', { category: 'dao', label: 'name', value: projectName });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'dao',
        label: 'name',
        value: projectName,
        pageTitle: 'delete_dao',
      },
    });
    setDataIsLoading(true);
    await deleteDraftDao(projectId)
      .then((res) => {
        if (res.code === 0) {
          setDaoDeleted(true);
          setShowDeleteModal(false);
          setShowSuccessModal(true);
          setDataIsLoading(false);
        } else {
          setShowErrorModal(true);
          setErrorMessage(res.message);
          setDataIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setDataIsLoading(false);
      });
  }
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  useEffect(() => {
    if (query.get('id')) {
      setProjectId(query.get('id'));
      projectDetails(query.get('id'));
      setProjectCreated(true);
      // setProjectId(query.get("id"));
    }
  }, []);

  return (
    <>
      {isDataLoading && <div className='loading'></div>}
      <div className='txtblack max-w-[600px] mx-4 pt-4 md:pt-0 md:mx-auto md:mt-[40px]'>
        {notOwner ? (
          <h3 className='text-center mt-6'>
            You are not owner of this DAO <br />
            You can not edit this DAO
          </h3>
        ) : (
          <>
            <div className='create-project-container'>
              {currentStep.length === 1 && (
                <div>
                  <div className='flex flex-wrap items-center mb-[24px]'>
                    <div>
                      <h1 className='text-[28px] font-black mb-[6px]'>
                        {!projectCreated ? 'Create New' : 'Edit'} DAO
                      </h1>
                      <p className='text-[14px] text-textSubtle '>
                        All fields are required to successfully{' '}
                        {!projectCreated ? 'create' : 'update'} your DAO
                      </p>
                    </div>
                    {query.get('id') && !notOwner && !projectPublished && (
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className='px-4 py-2 text-white bg-danger-1 ml-auto rounded'
                      >
                        <i className='fa-solid fa-trash mr-1'></i>
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                  <Outline
                    key={outlineKey}
                    // logo
                    logoLabel='DAO Logo'
                    logoPhotoUrl={logoPhotoUrl}
                    onLogoPhotoSelect={onLogoPhotoSelect}
                    onLogoPhotoRemove={onLogoPhotoRemove}
                    // name
                    nameLabel='DAO'
                    projectName={projectName}
                    emptyProjectName={emptyProjectName}
                    alreadyTakenProjectName={alreadyTakenProjectName}
                    projectNameDisabled={projectNameDisabled}
                    onProjectNameChange={onProjectNameChange}
                    // Dao symbol
                    showDaoSymbol={false}
                    daoSymbol={daoSymbol}
                    emptyDaoSymbol={emptyDaoSymbol}
                    onDaoSymbolChange={onDaoSymbolChange}
                    daoSymbolDisable={daoSymbolDisable}
                    // Dao Wallet
                    showDaoWallet={true}
                    daoWallet={daoWallet}
                    daoWalletDisable={daoWalletDisable}
                    onDaoWalletChange={onDaoWalletChange}
                    // overview
                    overview={overview}
                    onOverviewChange={onOverviewChange}
                    //photos
                    showPhotos={true}
                    photosUrl={photosUrl}
                    onPhotosSelect={onPhotosSelect}
                    onPhotosRemove={onPhotosRemove}
                    // cover
                    showCover={false}
                    // Royalties
                    showRoyalties={false}
                    // webLinks
                    showWebLinks={true}
                    webLinks={webLinks}
                    onSocialLinkChange={onSocialLinkChange}
                    addMoreSocialLink={addMoreSocialLink}
                    deleteSocialLinks={deleteSocialLinks}
                    // category
                    showProjectCategory={true}
                    projectCategory={projectCategory}
                    emptyProjeCtCategory={emptyProjeCtCategory}
                    onProjectCategoryChange={onProjectCategoryChange}
                    onBlockchainCategoryChange={setBlockchaainCategory}
                    blockchainCategory={blockchainCategory}
                    emptyBlockchainCategory={emptyBlockchainCategory}
                    setEmptyBlockchainCategory={setEmptyBlockchainCategory}
                    // Freeze metadata
                    showFreezeMetadata={false}
                    userId={userInfo?.id}
                  />
                </div>
              )}
              {currentStep.length === 2 && (
                <Confirmation
                  key={outlineKey}
                  // logo
                  logoLabel='DAO Logo'
                  logoPhotoUrl={logoPhotoUrl}
                  // name
                  nameLabel='DAO Name'
                  projectName={projectName}
                  // Dao symbol
                  showDaoSymbol={false}
                  daoSymbol={daoSymbol}
                  // Dao Wallet
                  showDaoWallet={true}
                  daoWallet={daoWallet}
                  // overview
                  overview={overview}
                  //photos
                  showPhotos={true}
                  photosUrl={photosUrl}
                  // cover
                  showCover={false}
                  // royalties
                  showRoyalties={false}
                  // webLinks
                  webLinks={webLinks}
                  showWebLinks={true}
                  // category
                  showProjectCategory={true}
                  projectCategoryName={projectCategoryName}
                  blockchainCategory={blockchainCategory}
                  showFreezeMetadata={false}
                />
              )}
            </div>
            <div className='py-4'>
              <div className='flex'>
                <>
                  {currentStep.length > 1 && (
                    <button
                      className='bg-primary-900/[0.10] text-primary-900 px-3 font-black w-[140px] !text-[16px] h-[44px]'
                      onClick={() => handelClickBack()}
                    >
                      <i className='fa-regular fa-angle-left'></i> Back
                    </button>
                  )}
                  {currentStep.length === 1 && (
                    <button
                      className=' w-[140px] !text-[16px] h-[44px] contained-button '
                      onClick={() => handelClickNext()}
                    >
                      Next <i className='fa-regular fa-angle-right ml-1'></i>
                    </button>
                  )}
                  {currentStep.length > 1 && (
                    <button
                      onClick={() => saveDraft('public')}
                      className={`w-[140px] !text-[16px] h-[44px] contained-button  ml-auto`}
                    >
                      Submit
                    </button>
                  )}
                </>
              </div>
            </div>
          </>
        )}
      </div>
      {showSuccessModal && (
        <SuccessModal
          redirection={!daoDeleted ? `/dao/${projectId}` : `/dashboard`}
          show={showSuccessModal}
          message={`DAO successfully ${!daoDeleted ? 'saved' : 'deleted'}`}
          subMessage={!daoDeleted ? "Let's explore the DAO" : ''}
          buttonText={!daoDeleted ? 'VIEW DAO' : 'Close'}
          handleClose={() => setShowSuccessModal(false)}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => {
            setShowErrorModal(false);
            setErrorMessage('');
          }}
          show={showErrorModal}
          message={errorMessage}
          redirection={'/dashboard'}
        />
      )}
      {showDeleteModal && (
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleApply={deleteDao}
          message='Are you sure  to delete this DAO?'
        />
      )}
      {showConnectModal && (
        <WalletConnectModal
          showModal={showConnectModal}
          noRedirection={true}
          closeModal={() => setShowConnectModal(false)}
        />
      )}
    </>
  );
}

export default ProjectCreateContent;
