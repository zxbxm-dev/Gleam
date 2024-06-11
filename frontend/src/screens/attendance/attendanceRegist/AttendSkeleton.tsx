import Skeleton from "react-loading-skeleton";

const AttendSkeleton = () => {
  return (
    <div className="attend-skeleton">
      <div>
        <Skeleton count={1} width='1670px' height='753px'/>
      </div>
    </div>
  );
};

export default AttendSkeleton;