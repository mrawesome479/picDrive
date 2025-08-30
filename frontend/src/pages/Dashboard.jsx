import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainUI from "../components/MainUI";


const Dashboard = () => {

  return (
    <>
      <div className="flex flex-col min-h-screen w-full bg-[#dff1f5]">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <MainUI />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
