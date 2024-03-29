import React, { useEffect, useState } from 'react';
import PublicProjectInfoCard from 'components/TokenGated/ProjectInfoCard/Public';
import TabComponent from 'components/TokenGated/public/TabComponent';
import { getTokenGatedProject } from 'services/tokenGated/tokenGatedService';
import { useSelector } from 'react-redux';

export default function TokenGatedPublicContent({ query, userId }) {
  const userInfo = useSelector((state) => state.user.userinfo);
  const [showOverLayLoading, setShowOverLayLoading] = useState(false);
  const [project, setProject] = useState({});
  const onGetTokenGatedProject = async (id) => {
    setShowOverLayLoading(true);
    await getTokenGatedProject(id)
      .then((res) => {
        if (res.code === 0) {
          let response = { ...res?.token_gate_project };
          let photo = response?.assets?.find(
            (x) => x?.asset_purpose === 'subphoto'
          );
          let cover = response?.assets?.find(
            (x) => x?.asset_purpose === 'cover'
          );
          response.coverUrl = cover ? cover?.path : null;
          response.photoUrl = photo ? photo?.path : null;
          try {
            const links = JSON.parse(response?.links);
            response.links = links;
          } catch (error) {
            response.links = [
              { title: 'linkInsta', icon: 'instagram', value: '' },
              { title: 'linkGithub', icon: 'github', value: '' },
              { title: 'linkTwitter', icon: 'twitter', value: '' },
              { title: 'linkFacebook', icon: 'facebook', value: '' },
              { title: 'customLinks1', icon: 'link', value: '' },
            ];
          }
          response.file_types.all =
            parseInt(response?.file_types?.audio) +
            parseInt(response?.file_types?.image) +
            parseInt(response?.file_types?.movie) +
            parseInt(response?.file_types?.other);
          setProject(response);
          setShowOverLayLoading(false);
        } else {
          setShowOverLayLoading(false);
        }
      })
      .catch((err) => {
        setShowOverLayLoading(false);
      });
  };
  useEffect(() => {
    onGetTokenGatedProject(query?.id);
  }, [query?.id, userInfo?.id]);
  return (
    <div>
      {showOverLayLoading && <div className='loading'></div>}
      {!showOverLayLoading && (
        <div className='px-4 md:px-[50px]'>
          <PublicProjectInfoCard project={project}></PublicProjectInfoCard>
          <div className='my-10 md:mt-[50px] md:mb-[100px]'>
            <TabComponent project={project} />
          </div>
        </div>
      )}
    </div>
  );
}
