import LeftSideBar from '../components/UI/LeftSideBar';
import TopSearchBar from './../components/UI/TopSearchBar';
import RightSubMain from './RighMainSection';
export default function HomePage() {
  return (
    <>
      <LeftSideBar />
      <div className="main">
        <TopSearchBar />
        <RightSubMain />
      </div>
    </>
  );
}
