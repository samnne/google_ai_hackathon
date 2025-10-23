import React from "react";
import { navLinks } from "../utils/constants";
import { Link, useNavigate } from "react-router";
import { auth } from "../../config/firebase-config";
import { FaDoorOpen } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/userSlice";
import { updateList } from "../reducers/cardListSlice";
import { createCard } from "../reducers/rootSlice";

const logo = {
  id: "Home",
  title: "Home",
  link: "/google_ai_hackathon/",
  image: "./uPathLogo.png",
};

const NavBar = () => {
  const navigate = useNavigate();
  const cUser = useSelector((state) => state.curUser.value);
  const dispatch = useDispatch();
  console.log(cUser);

  async function handleLogOut() {
    await signOut(auth)
      .then(() => {
        console.log("SIGNOUT");
        dispatch(setUser(null));
        dispatch(updateList([]));
        dispatch(createCard([]));
        navigate("/google_ai_hackathon/profile");
      })
      .catch((e) => {
        console.log("FAIL SIGN", e);
      });
  }
  return (
    <nav className=" w-full pt-5 max-sm:px-2  min-sm:p-5 flex justify-between items-center z-20">
      <div className="min-sm:text-2xl  gap-1 text-xl p-2 font-bold dark:bg-gray-900 dark:text-yellow-500 bg-white text-black z-20 rounded-full shadow-lg dark:shadow-gray-800 h-20 w-full flex max-sm:justify-center  justify-between items-center">
        <div className="flex gap-1">
          <div className="flex justify-center items-center pl-4">
            <a
              className="min-sm:px-5 flex  items-center justify-center   px-1  dark:hover:bg-gray-600  hover:bg-gray-200 z-20 rounded-full transition-all duration-100"
              id={logo.id}
              href={logo.link}>
              <img src={logo.image} className=" min-sm:w-20 min-sm:h-10 w-15 scale-75" alt="" />
            </a>
          </div>

          {navLinks.map((link) => {
            return (
              <div
                key={link.id}
                className="min-sm:px-5 flex text-md px-1 items-center justify-center  dark:hover:bg-gray-600  hover:bg-gray-200 z-20 rounded-full transition-all duration-100"
              >
                <Link to={link.link} className="font-bold">
                  {link.title}
                </Link>
              </div>
            );
          })}
        </div>
        {cUser && (
          <>
            <div onClick={handleLogOut} className="log-out min-sm:hidden">
              <FaDoorOpen />
            </div>
            <div onClick={handleLogOut} className="log-out max-sm:hidden">
              Log Out
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
